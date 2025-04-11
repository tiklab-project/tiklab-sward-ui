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
import Button from "../../../common/components/button/Button";
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
    const tenant = getUser().tenant;

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

    //tenant
    const tenantParam = version==='cloud' ? `?tenant=${tenant}` : '';
    //文件类型
    const fileType = documentTitle ? getFileExtension(documentTitle) : null;
    //文件地址
    const getFileUrl = {
        doc: `${upload_url}/document/download/file/${details?.fileUrl}${tenantParam}`,
        ppt: `${upload_url}/document/download/file/${details?.fileUrl}${tenantParam}`,
        pptx: `${upload_url}/document/download/file/${details?.fileUrl}${tenantParam}`,
        default: `${upload_url}/file/${details?.fileUrl}${tenantParam}`
    }
    //文件地址
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
            const processedSheets = workbook.SheetNames.map((sheetName) => {
                const worksheet = workbook.Sheets[sheetName];
                const merges = worksheet['!merges'] || [];
                // 转换为二维数组
                const sheetData = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                    raw: true,
                    defval: ""
                });
                // 处理合并单元格
                for (const merge of merges) {
                    const { s: start, e: end } = merge;
                    const value = sheetData[start.r] ? (sheetData[start.r][start.c] || "") : "";
                    for (let row = start.r; row <= end.r; row++) {
                        if (!sheetData[row]) sheetData[row] = [];
                        for (let col = start.c; col <= end.c; col++) {
                            sheetData[row][col] = value;
                        }
                    }
                }
                return { sheetName, sheetData, merges };
            });
            setExcelData(processedSheets);
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
            setDocSpinning(true);
            setEncryption(null);
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
                setDocSpinning(false);
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
                        const hasHeader = sheet.sheetData.length > 0;
                        const headerRow = hasHeader ? sheet.sheetData[0] : [];
                        const dataRows = hasHeader ? sheet.sheetData.slice(1) : sheet.sheetData;
                        return (
                            <div key={index} className='document-file-excel'>
                                <div className='excel-title'>{sheet.sheetName}</div>
                                <table border="1" style={{ borderCollapse: 'collapse' }}>
                                    {hasHeader && (
                                        <thead>
                                        <tr>
                                            {headerRow.map((cell, colIndex) => {
                                                const isMerged = sheet.merges.some(merge =>
                                                    0 >= merge.s.r &&
                                                    0 <= merge.e.r &&
                                                    colIndex >= merge.s.c &&
                                                    colIndex <= merge.e.c &&
                                                    (0 !== merge.s.r || colIndex !== merge.s.c)
                                                );
                                                if (isMerged) return null;
                                                // 计算合并属性
                                                let rowSpan = 1;
                                                let colSpan = 1;
                                                const merge = sheet.merges.find(m =>
                                                    m.s.r === 0 && m.s.c === colIndex
                                                );
                                                if (merge) {
                                                    rowSpan = merge.e.r - merge.s.r + 1;
                                                    colSpan = merge.e.c - merge.s.c + 1;
                                                }
                                                return (
                                                    <th
                                                        key={`${sheet.sheetName}-header-${colIndex}`}
                                                        rowSpan={rowSpan > 1 ? rowSpan : undefined}
                                                        colSpan={colSpan > 1 ? colSpan : undefined}
                                                    >
                                                        {cell === null || cell === undefined ? '' : String(cell)}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                        </thead>
                                    )}
                                    <tbody>
                                    {dataRows.map((row, rowIndex) => (
                                        <tr key={`${sheet.sheetName}-row-${rowIndex + 1}`}>
                                            {row.map((cell, colIndex) => {
                                                // 实际行号需要+1，因为去掉了表头行
                                                const actualRowIndex = rowIndex + 1;
                                                // 检查是否是合并单元格的非起始位置
                                                const isMerged = sheet.merges.some(merge =>
                                                    actualRowIndex >= merge.s.r &&
                                                    actualRowIndex <= merge.e.r &&
                                                    colIndex >= merge.s.c &&
                                                    colIndex <= merge.e.c &&
                                                    (actualRowIndex !== merge.s.r || colIndex !== merge.s.c)
                                                );
                                                if (isMerged) return null;
                                                // 计算合并属性
                                                let rowSpan = 1;
                                                let colSpan = 1;
                                                const merge = sheet.merges.find(m =>
                                                    m.s.r === actualRowIndex && m.s.c === colIndex
                                                );
                                                if (merge) {
                                                    rowSpan = merge.e.r - merge.s.r + 1;
                                                    colSpan = merge.e.c - merge.s.c + 1;
                                                }
                                                return (
                                                    <td
                                                        key={`${sheet.sheetName}-cell-${actualRowIndex}-${colIndex}`}
                                                        rowSpan={rowSpan > 1 ? rowSpan : undefined}
                                                        colSpan={colSpan > 1 ? colSpan : undefined}
                                                    >
                                                        {cell === null || cell === undefined ? '' : String(cell)}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
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
            <Button type={'primary'} onClick={downFile}>
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
