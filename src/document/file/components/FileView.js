/**
 * @Description: 文件
 * @Author: gaomengyuan
 * @Date: 2025/3/14
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/14
 */
import React, {useState, useEffect, useRef} from "react";
import DocumentStore from "../../document/store/DocumentStore";
import {Col, Empty, message, Row, Spin} from "antd";
import "./FileView.scss";
import Button from "../../../common/button/Button";
import ShareModal from "../../share/components/ShareModal";
import CommentShare from "../../document/store/CommentStore";
import {VerticalAlignBottomOutlined} from "@ant-design/icons";
import {getUser} from "tiklab-core-ui";
import RepositoryDetailStore from "../../../repository/common/store/RepositoryDetailStore";
import {observer} from "mobx-react";
import {getFileExtension} from "../../../common/utils/overall";
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';

const FileView = (props) => {

    const { findDocument, createDocumentFocus, deleteDocumentFocusByCondition } = DocumentStore;
    const { createShare, updateShare } = CommentShare;

    const documentId = props.match.params.id;
    const repositoryId = props.match.params.repositoryId;
    const userId = getUser().userId;

    const { documentTitle, setDocumentTitle } = RepositoryDetailStore;

    //文档
    const [documentData, setDocumentData] = useState(null);
    //加载状态
    const [spinning, setSpinning] = useState(true);
    //分享弹出框
    const [shareVisible, setShareVisible] = useState(false);

    useEffect(() => {
        setDocumentTitle()
        setSpinning(true)
        //获取文档
        findDocument(documentId).then(res=>{
            if(res.code===0){
                setDocumentData(res.data)
                setDocumentTitle(res.data?.node?.name)
            }
        }).finally(()=>setSpinning(false))

    }, [documentId]);

    /**
     * 取消收藏
     */
    const deleteFocus = () => {
        const params = {
            documentId: documentId,
            masterId: userId
        }
        deleteDocumentFocusByCondition(params).then(res => {
            if (res.code === 0) {
                setDocumentData(pev=>({
                   ...pev,
                   focus:false
               }))
                message.info("取消收藏文档")
            }
        })
    }

    /**
     * 收藏
     */
    const createFocus = () => {
        const params = {
            documentId: documentId,
            masterId: userId,
            wikiRepository: {
                id: repositoryId
            }
        }
        createDocumentFocus(params).then(res => {
            if (res.code === 0) {
                setDocumentData(pev=>({
                    ...pev,
                    focus:true
                }))
                message.info("收藏文档成功")
            }
        })
    }

    const details = documentData?.details && JSON.parse(documentData.details);

    /**
     * 下载
     * @param event
     */
    const downFile = (event) => {
        event.preventDefault();
        const a = document.createElement('a');
        a.style.display = 'none';
        a.download = documentTitle;
        a.href = `${upload_url}/file/${details.fileUrl}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const fileType = documentTitle ? getFileExtension(documentTitle) : null;

    const getFileUrl = {
        doc: `${upload_url}/document/download/file/${details?.fileUrl}`,
        ppt: `${upload_url}/document/download/file/${details?.fileUrl}`,
        pptx: `${upload_url}/document/download/file/${details?.fileUrl}`,
        default: `${upload_url}/file/${details?.fileUrl}`
    }

    const fileUrl = getFileUrl[fileType] || getFileUrl.default;

    //excel文件数据
    const [excelData, setExcelData] = useState(null);
    //doc数据
    const [docData,setDocData] = useState(null);
    //文件加密
    const [encryption,setEncryption] = useState(null);
    //文件加载
    const [docSpinning,setDocSpinning] = useState(false);

    /**
     * 自动加载和解析Word
     */
    const fetchAndParseDoc = async () => {
        try {
            // 使用 fetch 获取文件
            const response = await fetch(fileUrl);
            // 将文件转换为 ArrayBuffer
            const arrayBuffer = await response.arrayBuffer();
            // 使用 mammoth 解析文件为 HTML
            const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
            setDocData(result.value);
        } catch (error) {
            let errorMsg = '加载文件失败。';
            if (error.message.includes('password')) {
                errorMsg = '该文件受密码保护。';
            } else if (error.message.includes('Encryption scheme unsupported')) {
                errorMsg = '不支持的加密方式，无法解析该文件。';
            } else if (error.message.includes('Unsupported file format')) {
                errorMsg = '不支持的文件格式，请上传正确的文件。';
            }
            setEncryption(errorMsg);
            setDocData(null)
        }
    }

    /**
     * 自动加载和解析Excel
     */
    const fetchAndParseExcel = async () => {
        try {
            const response = await fetch(fileUrl);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });

            // 获取所有的工作表名
            const sheetNames = workbook.SheetNames;
            const allSheetsData = [];
            for (let i = 0; i < sheetNames.length; i++) {
                const sheetName = sheetNames[i];
                const worksheet = workbook.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true });
                allSheetsData.push({ sheetName, sheetData });
            }
            setExcelData(allSheetsData);
        } catch (error) {
            let errorMsg = '加载文件失败。';
            if (error.message.includes('password')) {
                errorMsg = '该文件受密码保护。';
            } else if (error.message.includes('Encryption scheme unsupported')) {
                errorMsg = '不支持的加密方式，无法解析该文件。';
            } else if (error.message.includes('Unsupported file format')) {
                errorMsg = '不支持的文件格式，请上传正确的文件。';
            }
            setEncryption(errorMsg);
            setExcelData(null);
        }
    };

    /**
     * 自动加载和解析Pdf
     */
    const loadScript = () => {
        return new Promise((resolve, reject) => {
            if (window.pdfjsLib) {
                resolve(); // 如果已经加载过，不再重复加载
                return;
            }
            const script = document.createElement("script");
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("PDF.js 加载失败"));
            document.body.appendChild(script);
        });
    };

    const pdfRef = useRef(null);

    const fetchAndParsePdf = async () => {
        try {
            await loadScript();
            if(pdfRef.current){
                const pdfDoc = await window.pdfjsLib.getDocument(fileUrl).promise;
                for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                    const page = await pdfDoc.getPage(pageNum);
                    // 获取父容器的宽度来动态计算 scale
                    const containerWidth = pdfRef.current.offsetWidth;
                    const scale = containerWidth / page.getViewport({ scale: 1 }).width;
                    // 创建页面容器
                    const pageContainer = document.createElement("div");
                    pageContainer.className = "pdf-canvas";
                    // 创建 Canvas
                    const canvas = document.createElement("canvas");
                    pageContainer.appendChild(canvas);
                    pdfRef.current.appendChild(pageContainer);
                    const viewport = page.getViewport({ scale });
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const renderContext = {
                        canvasContext: canvas.getContext("2d"),
                        viewport: viewport,
                    };
                    await page.render(renderContext).promise;
                }
            }
        } catch (error) {
            let errorMsg = '加载文件失败。';
            if (error.name === 'PasswordException') {
                errorMsg = '该文件受密码保护。';
            } else if (error.name === 'InvalidPDFException') {
                errorMsg = '文件损坏，无法加载。';
            }
            setEncryption(errorMsg);
        }
    };

    useEffect(() => {
        const loadFile = async () => {
            setDocSpinning(true)
            setEncryption(null)
            try {
                switch (fileType) {
                    case 'docx':
                        await fetchAndParseDoc();
                        break;
                    case 'xlsx':
                    case 'xls':
                        await fetchAndParseExcel();
                        break;
                    case 'pdf':
                    case 'ppt':
                    case 'pptx':
                        await fetchAndParsePdf();
                        break;
                }
            } finally {
                setDocSpinning(false)
            }
        };
        if(details?.fileUrl){
            loadFile();
        }
    }, [fileType, details?.fileUrl]);

    const fileContent = () =>{
        if(!fileType){return;}
        switch (fileType) {
            case 'docx':
                return encryption ? defaultContent : (
                   <div
                       className='document-file-doc'
                       dangerouslySetInnerHTML={{ __html: docData }}
                   />
                )
            case 'pdf':
            case 'ppt':
            case 'pptx':
                return encryption ? defaultContent : (
                    <div
                        className='document-file-pdf'
                        ref={pdfRef}
                    />
                )
            case 'xlsx':
            case 'xls':
                return encryption ? defaultContent : (
                    excelData?.length > 0 && excelData.map((sheet, index) => {
                        //获取最大列数
                        const maxColumns = Math.max(...sheet.sheetData.map(row => row.length));
                        return (
                            <div key={index} className='document-file-excel'>
                                <div className='excel-title'>{sheet.sheetName}</div>
                                <table border="1" style={{ borderCollapse: 'collapse' }}>
                                    <thead>
                                    <tr>
                                        {(() => {
                                            const headers = [];
                                            // 假设表头是第一行
                                            const headerRow = sheet.sheetData[0];
                                            for (let cellIndex = 0; cellIndex < maxColumns; cellIndex++) {
                                                const cell = headerRow[cellIndex];
                                                headers.push(
                                                    <th key={cellIndex}>
                                                        {cell||''}
                                                    </th>
                                                );
                                            }
                                            return headers;
                                        })()}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {(() => {
                                        const rows = [];
                                        for (let rowIndex = 1; rowIndex < sheet.sheetData.length; rowIndex++) {
                                            const row = sheet.sheetData[rowIndex];
                                            const cells = [];
                                            // 渲染当前行的单元格
                                            for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
                                                const cell = row[cellIndex];
                                                cells.push(
                                                    <td key={cellIndex}>
                                                        {cell||''}
                                                    </td>
                                                );
                                            }
                                            // 如果当前行的单元格数不足 maxColumns，则填充空单元格
                                            while (cells.length < maxColumns) {
                                                cells.push(
                                                    <td key={cells.length}></td>
                                                );
                                            }
                                            rows.push(<tr key={rowIndex}>{cells}</tr>);
                                        }
                                        return rows;
                                    })()}
                                    </tbody>
                                </table>
                            </div>
                        )
                    })
                )
            default:
                return defaultContent
        }
    }

    const defaultContent = (
        <div className='document-file'>
            <svg className="icon-48" aria-hidden="true">
                <use xlinkHref="#icon-file"></use>
            </svg>
            <div className='document-file-name'>
                {documentTitle}
            </div>
            <Button
                type={'primary'}
                onClick={downFile}
            >
                <VerticalAlignBottomOutlined />
                &nbsp;&nbsp;下载
                {details?.fileSize ? `(${details.fileSize})` : ''}
            </Button>
        </div>
    )

    return (
        <Spin spinning={spinning} wrapperClassName='document-file-spin'>
            {
                documentData ? (
                    documentData?.node?.recycle === '0' ? (
                        <div className='document-file-examine'>
                            <div className="examine-top">
                                <div className="examine-title" id="examine-title">
                                    <div className="examine-title-top">
                                        {documentTitle}
                                    </div>
                                    <div className="examine-title-date">
                                        更新日期：{documentData.node?.updateTime || documentData.node?.createTime}
                                    </div>
                                </div>
                                <div className="document-action">
                                    {
                                        documentData.focus ?
                                            <svg className="right-icon" aria-hidden="true" onClick={() => deleteFocus()}>
                                                <use xlinkHref="#icon-collectioned"></use>
                                            </svg>
                                            :
                                            <svg className="right-icon" aria-hidden="true" onClick={() => createFocus()}>
                                                <use xlinkHref="#icon-collection"></use>
                                            </svg>
                                    }
                                    <Button className="document-action-edit" onClick={downFile}>下载</Button>
                                    <Button
                                        className="document-action-share"
                                        onClick={() => setShareVisible(true)}
                                    >分享</Button>
                                </div>
                            </div>
                            <div className="document-examine-content">
                                <Row className="document-examine-row">
                                    <Col
                                        xs={{ span: 24}}
                                        md={{ span: 20, offset: 2 }}
                                        xl={{ span: 18, offset: 3 }}
                                        lg={{ span: 18, offset: 3 }}
                                    >
                                        <Spin spinning={docSpinning}>
                                            {fileContent()}
                                        </Spin>
                                    </Col>
                                </Row>
                            </div>
                            <ShareModal
                                documentIds={[documentId]}
                                nodeIds = {[documentId]}
                                shareVisible={shareVisible}
                                setShareVisible={setShareVisible}
                                docInfo={documentData.node}
                                createShare={createShare}
                                updateShare={updateShare}
                                type={"document"}
                            />
                        </div>
                    ) : (
                        <div className="document-file-empty">
                            <Empty description="文档已被移动到回收站，请去回收站恢复再查看" />
                        </div>
                    )
                ) : (
                    <div className="document-file-empty">
                        <Empty description="文档已被删除或者不存在" />
                    </div>
                )

            }
        </Spin>
    )

}

export default observer(FileView);
