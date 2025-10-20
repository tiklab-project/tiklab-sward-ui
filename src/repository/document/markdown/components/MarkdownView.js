/*
 * @Descripttion: markdown 查看
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:21:04
 */
import React, { useEffect, useState } from "react";
import { Provider, inject, observer } from "mobx-react";
import {Row, Col, message, Spin, Empty, Tag} from 'antd';
import Button from "../../../../common/components/button/Button";
import { MarkdownView } from "tiklab-markdown-ui";
import "tiklab-markdown-ui/es/tiklab-markdown.css";
import "./MarkdownView.scss"
import ShareModal from "../../share/components/ShareModal";
import { getUser } from "tiklab-core-ui";
import Comment from "../../document/components/Comment";
import CommentStore from "../../document/store/CommentStore";
import MarkdownStore from "../store/MarkdownStore";
import RepositoryDetailStore from "../../../common/store/RepositoryDetailStore";
import DocumentActionMenu from "../../common/DocumentActionMenu";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import {MessageOutlined} from "@ant-design/icons";

const MarkdownDocument = (props) => {

    const {DocumentVersionAdd,DocumentVersionList,DocumentReviewAdd,reviewStatus,updateNodeEntity} = props;

    const store = {
        markdownStore: MarkdownStore
    }
    const documentId = props.match.params.id;
    const { findDocument, createDocumentFocus, deleteDocumentFocusByCondition } = MarkdownStore;
    const { documentTitle, setDocumentTitle, repository,createRecent} = RepositoryDetailStore;
    const { createLike, deleteLike } = CommentStore;
    const [shareVisible, setShareVisible] = useState(false)
    const [documentDate, setDocumentDate] = useState()
    const userId = getUser().userId;
    const tenant = getUser().tenant;
    const [showComment, setShowComment] = useState(false);
    const repositoryId = props.match.params.repositoryId;
    const [like, setLike] = useState(false)
    const [focus, setFocus] = useState(false)
    let [likeNum, setLikeNum] = useState()
    let [commentNum, setCommentNum] = useState()
    const [value, setValue] = useState()

    const [document, setDocument] = useState()
    const path = props.location.pathname.split("/")[3];
    const [loading, setLoading] = useState(true);
    const [documentVersion,setDocumentVersion] = useState(null);

    //仓库归档状态
    const repositoryStatus = repository?.status === 'nomal';
    //文档评审状态
    const documentApprove = document?.node?.nodeStatus === 0 || document?.node?.nodeStatus ===1;

    useEffect(() => {
        setDocumentTitle()
        setValue()
        setLoading(true)
        findDocument(documentId).then((data) => {
            if (data.code === 0) {
                if (data.data?.details) {
                    const value = data.data.details
                    setValue(value)
                }
                const document = data.data;
                setDocument(document)
                if (document) {
                    const node = document.node;
                    setDocumentTitle(node.name)
                    setDocumentDate(node.updateTime || node.createTime)
                    setLike(document.like)
                    setFocus(document.focus)
                    setLikeNum(document.likenumInt)
                    setCommentNum(document.commentNumber)

                    createRecent({
                        name: node.name,
                        model: "document",
                        modelId: documentId,
                        master: { id: userId },
                        wikiRepository: { id: repositoryId }
                    })
                }
            }
            setLoading(false)
        })
    }, [documentId])

    // 点赞
    const addDocLike = () => {
        if (like) {
            const data = {
                toWhomId: documentId,
                likeUser: userId,
                likeType: "doc"
            }
            deleteLike(data).then(res => {
                setLike(false)
                likeNum = likeNum - 1;
                setLikeNum(likeNum)
            })
        } else {
            const data = {
                toWhomId: documentId,
                likeUser: { id: userId },
                likeType: "doc"
            }
            createLike(data).then(res => {
                if (res.code === 0) {
                    setLike(true)
                    likeNum = likeNum + 1;
                    setLikeNum(likeNum)
                }
            })
        }


    }

    /**
     * 收藏文档
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
                setFocus(true)
                message.info("收藏文档成功")
            }
        })
    }

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
                setFocus(false)
                message.info("取消收藏文档")
            }
        })
    }

    const goEdit = () => {
        if (path === "doc") {
            props.history.push(`/repository/${repositoryId}/doc/markdown/${documentId}/edit`)
        }
        if (path === "collect") {
            props.history.push(`/repository/${repositoryId}/collect/markdown/${documentId}/edit`)
        }
    }

    const isEdit = repositoryStatus && (reviewStatus ? documentApprove : true)

    const updateNode= () => {
        if(typeof updateNodeEntity === 'function'){
            updateNodeEntity({
                ...document.node,
                nodeStatus: 1,
            }).then(res=>{
                if(res.code===0){
                    message.success('下线成功');
                    setDocument(prev => ({
                        ...prev,
                        node: {
                            ...prev.node,
                            nodeStatus: 1
                        }
                    }));
                } else {
                    message.error(res.msg)
                }
            })
        }
    }

    return (<Provider {...store}>
        <Spin wrapperClassName="document-markdown-spin" spinning={loading} tip="加载中..." >
            {
                document ? <>
                    {
                        document?.node?.recycle === "0" ? <div className="document-markdown-examine">
                            {
                                showComment &&
                                <Comment
                                    documentId={documentId}
                                    showComment={showComment}
                                    setShowComment={setShowComment}
                                    commentNum={commentNum}
                                    setCommentNum={setCommentNum}
                                />
                            }
                            <div className="examine-top">
                                <div className="examine-title" id="examine-title">
                                    <div className='examine-title-desc'>
                                        <div className="examine-title-top">
                                            {documentTitle}
                                            {documentVersion?.versionName ? ` · ${documentVersion?.versionName}` :''}
                                        </div>
                                        {
                                            reviewStatus &&
                                            <div>
                                                {document?.node?.nodeStatus === 1 && <Tag color="orange">草稿</Tag>}
                                                {document?.node?.nodeStatus === 2 && <Tag color="green">评审中</Tag>}
                                                {document?.node?.nodeStatus === 3 && <Tag color="blue">已上线</Tag>}
                                            </div>
                                        }
                                    </div>
                                    <div className="examine-title-date">
                                        更新日期：{documentDate}
                                    </div>
                                </div>
                                <div className="document-edit">
                                    {
                                        documentVersion ? (
                                                <Button
                                                    className="document-action-edit"
                                                    onClick={()=>{
                                                        setValue(null);
                                                        setDocumentVersion(null);
                                                        Promise.resolve().then(() => {
                                                            setValue(document.details);
                                                        });
                                                    }}
                                                >
                                                    退出历史版本
                                                </Button>
                                            ):
                                            <>
                                                {
                                                    focus ?
                                                        <svg className="right-icon" aria-hidden="true" onClick={() => deleteFocus()}>
                                                            <use xlinkHref="#icon-collectioned"></use>
                                                        </svg>
                                                        :
                                                        <svg className="right-icon" aria-hidden="true" onClick={() => createFocus()}>
                                                            <use xlinkHref="#icon-collection"></use>
                                                        </svg>
                                                }
                                                {
                                                    isEdit &&
                                                    <PrivilegeProjectButton domainId={repositoryId} code={'wi_doc_update'}>
                                                        <Button className="document-action-edit" onClick={() => goEdit()}>
                                                            编辑
                                                        </Button>
                                                    </PrivilegeProjectButton>
                                                }
                                                <PrivilegeProjectButton domainId={repositoryId} code={'wi_doc_share'}>
                                                    <Button
                                                        className="document-action-share"
                                                        onClick={() => setShareVisible(true)}
                                                    >
                                                        分享
                                                    </Button>
                                                </PrivilegeProjectButton>
                                            </>
                                    }
                                    <DocumentActionMenu
                                        document={document}
                                        commentNum={commentNum}
                                        setShowComment={setShowComment}
                                        setValue={setValue}
                                        documentVersion={documentVersion}
                                        setDocumentVersion={setDocumentVersion}
                                        DocumentVersionAdd={DocumentVersionAdd}
                                        DocumentVersionList={DocumentVersionList}
                                        DocumentReviewAdd={DocumentReviewAdd}
                                        updateNode={updateNode}
                                    />
                                </div>
                            </div>
                            {
                                value ?
                                <div className="document-examine-content">
                                    <Row className="document-examine-row">
                                        <Col
                                            xs={{ span: 24}}
                                            md={{ span: 24 }}
                                            lg={{ span: 22, offset: 1 }}
                                            xl={{ span: 20, offset: 2 }}
                                            xxl={{ span: 18, offset: 3 }}
                                        >
                                            <div className="document-previeweditor">
                                                <MarkdownView
                                                    value={JSON.parse(value)}
                                                    base_url={upload_url}
                                                    tenant={tenant}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                :
                                <>
                                </>
                            }
                            <PrivilegeProjectButton domainId={repositoryId} code={'wi_doc_comment'}>
                                <div className="comment-box" onClick={() => setShowComment(!showComment)}>
                                    <div className="comment-box-item">
                                        <MessageOutlined />
                                        {/*<div className="commnet-num">{commentNum}</div>*/}
                                    </div>
                                </div>
                            </PrivilegeProjectButton>
                            <ShareModal
                                repositoryId={repositoryId}
                                shareVisible={shareVisible}
                                setShareVisible={setShareVisible}
                                docInfo={document?.node}
                            />
                        </div>
                        :
                        <div className="document-markdown-empty">
                            <Empty description="文档已被移动到回收站，请去回收站恢复再查看" />
                        </div>
                    }
                </>
                    :
                    <div className="document-markdown-empty">
                        <Empty description="文档已被删除或者不存在" />
                    </div>
            }
        </Spin>
    </Provider>
    )
}

export default inject("relationWorkStore")(observer(MarkdownDocument));
