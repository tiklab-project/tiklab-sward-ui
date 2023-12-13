/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-10-22 15:38:49
 */
import React, { useEffect, useState } from "react";
import { Provider, inject, observer } from "mobx-react";
import { Button, Row, Col, message } from 'antd';
import { PreviewEditor } from "thoughtware-slate-ui";
import "thoughtware-slate-ui/es/thoughtware-slate.css";
import "./documentExamine.scss"
import ShareModal from "../../share/components/ShareModal";
import { getUser } from "thoughtware-core-ui";
import Comment from "./Comment";
import DocumentAddEdit from "./DocumentAddEdit";
import CommentShare from "../store/CommentStore";
import DocumentStore from "../store/DocumentStore";
const DocumentExamine = (props) => {
    const { relationWorkStore } = props;
    const store = {
        documentStore: DocumentStore
    }
    const documentId = props.match.params.id;
    const { findDocument, createDocumentFocus, deleteDocumentFocusByCondition } = DocumentStore;

    const { createLike, createShare, updateShare, deleteLike } = CommentShare;
    const [shareVisible, setShareVisible] = useState(false)

    const userId = getUser().userId;
    const tenant = getUser().tenant;
    const [docInfo, setDocInfo] = useState({ name: "", likenumInt: "", commentNumber: "", master: { name: "" } })
    const [showComment, setShowComment] = useState(false);
    const repositoryId = props.match.params.repositoryId;
    const [like, setLike] = useState(false)
    const [focus, setFocus] = useState(false)
    let [likeNum, setLikeNum] = useState()
    let [commentNum, setCommentNum] = useState()
    const [title, seTitle] = useState()
    const [value, setValue] = useState()

    useEffect(() => {
        seTitle()
        setValue()
        findDocument(documentId).then((data) => {
            if (data.code === 0) {
                if (data.data.details) {
                    setValue(data.data.details)
                } else {
                    setValue()
                }
                setDocInfo(data.data)
                seTitle(data.data.name)
                setLike(data.data.like)
                setFocus(data.data.focus)
                setLikeNum(data.data.likenumInt)
                setCommentNum(data.data.commentNumber)
            }
        })
        return;
    }, [documentId])



    // 点赞
    const addDocLike = () => {
        const data = {
            toWhomId: documentId,
            likeUser: { id: userId },
            likeType: "doc"
        }
        if (like) {
            deleteLike(data).then(res => {
                setLike(false)
                likeNum = likeNum - 1;
                setLikeNum(likeNum)
            })
        } else {
            createLike(data).then(res => {
                if (res.code === 0) {
                    setLike(true)
                    likeNum = likeNum + 1;
                    setLikeNum(likeNum)
                }
            })
        }


    }

    const createFocus = () => {
        const params = {
            documentId: documentId,
            masterId: userId
        }
        createDocumentFocus(params).then(res => {
            if (res.code === 0) {
                setFocus(true)
                message.info("收藏文档成功")
            }
        })
    }

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
    return (<Provider {...store}>
        <div className="document-examine">
            {
                showComment && <Comment documentId={documentId} setShowComment={setShowComment} commentNum={commentNum} setCommentNum={setCommentNum} />
            }
            <div className="examine-top">
                <div className="examine-title" id="examine-title">{docInfo.name}</div>
                <div className="document-action">
                    {
                        value && <svg className="right-icon" aria-hidden="true" onClick={() => props.history.push(`/repositorydetail/${repositoryId}/docEdit/${documentId}`)}>
                            <use xlinkHref="#icon-edit"></use>
                        </svg>
                    }
                    {
                        focus ? <svg className="right-icon" aria-hidden="true" onClick={() => deleteFocus()}>
                            <use xlinkHref="#icon-collectioned"></use>
                        </svg>
                            :
                            <svg className="right-icon" aria-hidden="true" onClick={() => createFocus()}>
                                <use xlinkHref="#icon-collection"></use>
                            </svg>
                    }
                    <svg className="right-icon" aria-hidden="true" onClick={() => setShareVisible(true)}>
                        <use xlinkHref="#icon-share"></use>
                    </svg>
                    <svg className="right-icon" aria-hidden="true">
                        <use xlinkHref="#icon-point"></use>
                    </svg>
                </div>
            </div>
            {
                value ? <div className="document-examine-content">
                    <Row className="document-examine-row">
                        <Col xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }}>
                            <div className="document-previeweditor">
                                <PreviewEditor value={value} relationWorkStore={relationWorkStore} base_url={upload_url} tenant={tenant} />
                            </div>
                        </Col>
                    </Row>
                </div>
                    :
                    <DocumentAddEdit title={title} />
            }
            <div className="comment-box">
                <div className="comment-box-item top-item">
                    <svg className="midden-icon" aria-hidden="true" onClick={() => setShowComment(!showComment)}>
                        <use xlinkHref="#icon-comment"></use>
                    </svg>
                    <div className="commnet-num">{commentNum}</div>
                </div>
                <div className="comment-box-item">
                    <span className="comment-item" onClick={addDocLike}>
                        {
                            like ? <svg className="midden-icon" aria-hidden="true">
                                <use xlinkHref="#icon-zan"></use>
                            </svg> : <svg className="midden-icon" aria-hidden="true">
                                <use xlinkHref="#icon-dianzan"></use>
                            </svg>
                        }
                    </span>
                    <div className="commnet-num" style={{ top: "37px" }}>{likeNum}</div>
                </div>

            </div>

            <ShareModal
                documentIds={[documentId]}
                shareVisible={shareVisible}
                setShareVisible={setShareVisible}
                docInfo={docInfo}
                createShare={createShare}
                updateShare={updateShare}
                type={"document"}
            />
        </div>
    </Provider>

    )
}

export default inject("relationWorkStore")(observer(DocumentExamine));