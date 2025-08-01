/**
 * @Description: 文件
 * @Author: gaomengyuan
 * @Date: 2025/3/14
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/14
 */
import React, {useState, useEffect} from "react";
import DocumentStore from "../../document/store/DocumentStore";
import {Col, Empty, message, Row, Spin} from "antd";
import "./FileView.scss";
import Button from "../../../common/components/button/Button";
import ShareModal from "../../share/components/ShareModal";
import {VerticalAlignBottomOutlined} from "@ant-design/icons";
import {getUser} from "tiklab-core-ui";
import RepositoryDetailStore from "../../../repository/common/store/RepositoryDetailStore";
import {observer} from "mobx-react";
import {disableFunction} from "tiklab-core-ui";
import ArchivedFree from "../../../common/components/archivedFree/ArchivedFree";

const FileView =  ({ ExtendFileView, ...props })=> {


    const { findDocument, createDocumentFocus, deleteDocumentFocusByCondition } = DocumentStore;

    const disable = disableFunction();
    const documentId = props.match.params.id;
    const repositoryId = props.match.params.repositoryId;
    const userId = getUser().userId;

    const { documentTitle, setDocumentTitle, createRecent } = RepositoryDetailStore;

    //文档
    const [documentData, setDocumentData] = useState(null);
    //加载状态
    const [spinning, setSpinning] = useState(true);
    //分享弹出框
    const [shareVisible, setShareVisible] = useState(false);
    //增强功能弹出框
    const [archivedFreeVisable, setArchivedFreeVisable] = useState(false)

    useEffect(() => {
        setDocumentTitle()
        setSpinning(true)
        //获取文档
        findDocument(documentId).then(res=>{
            if(res.code===0){
                setDocumentData(res.data)
                setDocumentTitle(res.data?.node?.name)
                createRecent({
                    name: res.data?.node?.name,
                    model: "document",
                    modelId: documentId,
                    master: { id: userId },
                    wikiRepository: { id: repositoryId }
                })
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
                message.info("收藏文档成功");
            }
        });
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
                                        lg={{ span: 18, offset: 3 }}
                                        xl={{ span: 18, offset: 3 }}
                                        xxl={{ span: 16, offset: 4 }}
                                    >
                                        {
                                            (!disable && ExtendFileView) ?
                                                <ExtendFileView
                                                    defaultContent={defaultContent}
                                                    documentTitle={documentTitle}
                                                    documentData={documentData}
                                                />
                                                :
                                                <div className='document-file-defalut'>
                                                    {defaultContent}
                                                    <div className='file-defalut-view'>
                                                        <span
                                                            className='file-defalut-view-text'
                                                            onClick={()=>setArchivedFreeVisable(true)}
                                                        >
                                                            预览
                                                        </span>
                                                    </div>
                                                </div>
                                        }
                                        <ArchivedFree
                                            type={'documentFile'}
                                            archivedFreeVisable={archivedFreeVisable}
                                            setArchivedFreeVisable={setArchivedFreeVisable}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <ShareModal
                                documentIds={[documentId]}
                                shareVisible={shareVisible}
                                setShareVisible={setShareVisible}
                                docInfo={documentData.node}
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
