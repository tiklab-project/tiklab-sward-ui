/*
 * @Descripttion: 文档的展示页面，或者没选择模版时候的展示模版页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:12:03
 */
import React, { useEffect, useState } from "react";
import { Provider, inject, observer } from "mobx-react";
import {Row, Col, message, Empty, Spin} from 'antd';
import { PreviewEditor, EditorCategory } from "tiklab-slate-ui";
import "tiklab-slate-ui/es/tiklab-slate.css";
import "./documentExamine.scss"
import ShareModal from "../../share/components/ShareModal";
import { getUser } from "tiklab-core-ui";
import Comment from "./Comment";
import CommentShare from "../store/CommentStore";
import DocumentStore from "../store/DocumentStore";
import RepositoryDetailStore from "../../../repository/common/store/RepositoryDetailStore";
import Button from "../../../common/components/button/Button";
import DocumentActionMenu from "../../../repository/common/components/DocumentActionMenu";
import {DoubleLeftOutlined, DoubleRightOutlined} from "@ant-design/icons";

const DocumentExamine = (props) => {

    const { relationWorkStore, DocumentVersionList, DocumentVersionAdd ,DocumentReviewAdd,exportsWord } = props;

    const { repository, documentTitle, setDocumentTitle } = RepositoryDetailStore;
    const [documentDate, setDocumentDate] = useState();
    const path = props.location.pathname.split("/")[3];
    const store = {
        documentStore: DocumentStore
    }
    const documentId = props.match.params.id;
    const repositoryId = props.match.params.repositoryId;
    const { findDocument, createDocumentFocus, deleteDocumentFocusByCondition } = DocumentStore;

    const { createLike, createShare, updateShare, deleteLike } = CommentShare;
    const [shareVisible, setShareVisible] = useState(false)
    const userId = getUser().userId;
    const tenant = getUser().tenant;
    const [docInfo, setDocInfo] = useState()
    const [showComment, setShowComment] = useState(false);

    const [like, setLike] = useState(false)
    const [focus, setFocus] = useState(false)
    let [likeNum, setLikeNum] = useState()
    let [commentNum, setCommentNum] = useState()
    const [value, setValue] = useState()
    const [loading, setLoading] = useState(true);
    const [document, setDocument] = useState()
    const repositoryStatus = repository?.status === 'nomal';
    const [documentVersion,setDocumentVersion] = useState(null);
    const [showCatagory,setShowCatagory] = useState(true);

    // 获取文档详情
    useEffect(() => {
        setDocumentTitle()
        setValue()
        setLoading(true)
        findDocument(documentId).then((data) => {
            if (data.code === 0) {
                const document = data.data;
                setDocument(document)
                if (document) {
                    if (data.data?.details) {
                        setValue(data.data.details)
                    } else {
                        setValue()
                        if(repositoryStatus){
                            if (path === "doc") {
                                props.history.push(`/repository/${repositoryId}/doc/rich/${documentId}/edit`)
                            }
                            if (path === "collect") {
                                props.history.push(`/repository/${repositoryId}/collect/rich/${documentId}/edit`)
                            }
                        }
                    }
                    const node = document.node;
                    setDocInfo(node)
                    setDocumentTitle(node.name)
                    setDocumentDate(node.updateTime || node.createTime)
                    setLike(document.like)
                    setFocus(document.focus)
                    setLikeNum(document.likenumInt)
                    setCommentNum(document.commentNumber)
                }
            }
            setLoading(false)
        })
        return;
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

    /**
     * 跳转到编辑模式
     */
    const goEdit = () => {
        // 目录界面
        if (path === "doc") {
            props.history.push(`/repository/${repositoryId}/doc/rich/${documentId}/edit`)
        }
        // 收藏界面
        if (path === "collect") {
            props.history.push(`/repository/${repositoryId}/collect/rich/${documentId}/edit`)
        }
    }

    return (<Provider {...store}>
        <Spin wrapperClassName="document-examine-spin" spinning={loading} tip="加载中..." >
            {
                document ?
                    docInfo?.recycle === "0" ?
                        <div className="document-examine">
                            {
                                showComment &&
                                <Comment
                                    documentId={documentId}
                                    setShowComment={setShowComment}
                                    commentNum={commentNum}
                                    setCommentNum={setCommentNum}
                                />
                            }
                            <div className="examine-top">
                                <div className="examine-title" id="examine-title">
                                    <div className="examine-title-top">
                                        {documentTitle}
                                        {documentVersion?.versionName ? ` · ${documentVersion?.versionName}` :''}
                                    </div>
                                    <div className="examine-title-date">
                                        更新日期：{documentDate}
                                    </div>
                                </div>
                                <div className="document-action">
                                    {
                                        documentVersion ?
                                            <Button
                                                className="document-action-edit"
                                                onClick={()=>{
                                                    setValue(null);
                                                    setDocumentVersion(null);
                                                    Promise.resolve().then(() => {
                                                        setValue(document.details);
                                                    });
                                                }}
                                            >  退出历史版本
                                            </Button>
                                            :
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
                                                    value && repositoryStatus &&
                                                    <Button className="document-action-edit" onClick={() => goEdit()}>
                                                        编辑
                                                    </Button>
                                                }
                                                <Button
                                                    className="document-action-share"
                                                    onClick={() => setShareVisible(true)}
                                                >
                                                    分享
                                                </Button>
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
                                        exportsWord={exportsWord}
                                    />
                                </div>
                            </div>
                            {
                                value ?
                                    <div className="document-examine-content">
                                        <div className="document-previeweditor">
                                            <Row>
                                                <Col
                                                    xs={{ span: 24}}
                                                    xl={{ span: 20, offset: 2 }}
                                                    xxl={{ span: 18, offset: 3 }}
                                                >
                                                    <PreviewEditor
                                                        value={value}
                                                        relationWorkStore={relationWorkStore}
                                                        base_url={upload_url}
                                                        img_url={upload_url}
                                                        viewImageUrl="/image"
                                                        tenant={tenant}
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="category-editor-box">
                                            <div className="category-editor">
                                                <div className="category-editor-top">
                                                    {
                                                        showCatagory &&
                                                        <div className='category-editor-title'>本页目录</div>
                                                    }
                                                    <div
                                                        className={`category-editor-action ${showCatagory ? 'category-hidden':'category-narrow'}`}
                                                        onClick={()=>setShowCatagory(!showCatagory)}
                                                    >
                                                        {
                                                            showCatagory ?  <DoubleRightOutlined /> : <DoubleLeftOutlined />
                                                        }
                                                    </div>
                                                </div>
                                                {
                                                    showCatagory &&
                                                    <div className="category-editor-content">
                                                        <EditorCategory
                                                            newValue={JSON.parse(value)}
                                                            type="simple"
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div> : <></>
                            }
                            {/*<div className="comment-box">*/}
                            {/*    <div className="comment-box-item top-item">*/}
                            {/*        <svg className="midden-icon" aria-hidden="true" onClick={() => setShowComment(!showComment)}>*/}
                            {/*            <use xlinkHref="#icon-comment"></use>*/}
                            {/*        </svg>*/}
                            {/*        <div className="commnet-num">{commentNum}</div>*/}
                            {/*    </div>*/}
                            {/*    <div className="comment-box-item">*/}
                            {/*        <span className="comment-item" onClick={addDocLike}>*/}
                            {/*            {*/}
                            {/*                like ?*/}
                            {/*                    <svg className="midden-icon" aria-hidden="true">*/}
                            {/*                        <use xlinkHref="#icon-zan"></use>*/}
                            {/*                    </svg>*/}
                            {/*                    :*/}
                            {/*                    <svg className="midden-icon" aria-hidden="true">*/}
                            {/*                        <use xlinkHref="#icon-dianzan"></use>*/}
                            {/*                    </svg>*/}
                            {/*            }*/}
                            {/*        </span>*/}
                            {/*        <div className="commnet-num" style={{ top: "37px" }}>{likeNum}</div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <ShareModal
                                documentIds={[documentId]}
                                nodeIds={[documentId]}
                                shareVisible={shareVisible}
                                setShareVisible={setShareVisible}
                                docInfo={docInfo}
                                createShare={createShare}
                                updateShare={updateShare}
                                type={"document"}
                            />
                        </div>
                        :
                        <div className="document-empty">
                            {!loading && <Empty description="文档已被移动到回收站，请去回收站恢复再查看" />}
                        </div>
                    :
                    <div className="document-empty">
                        {!loading && <Empty description="文档不存在或者已被删除~" />}
                    </div>

            }
        </Spin>


    </Provider>

    )
}

export default inject("relationWorkStore")(observer(DocumentExamine));
