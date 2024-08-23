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
import { Row, Col, Dropdown, message, Spin } from 'antd';
import Button from "../../../common/button/button";
import { MarkdownView } from "thoughtware-markdown-ui";
import "thoughtware-markdown-ui/es/thoughtware-markdown.css";
import "./markdownView.scss"
import ShareModal from "../../share/components/ShareModal";
import { getUser } from "thoughtware-core-ui";
import Comment from "../../document/components/Comment";
import CommentStore from "../../document/store/CommentStore";
import MarkdownStore from "../store/MarkdownStore";
import RepositoryDetailStore from "../../../repository/common/store/RepositoryDetailStore";
const DocumentExamine = (props) => {
    const store = {
        markdownStore: MarkdownStore
    }
    const documentId = props.match.params.id;
    const { findDocument, createDocumentFocus, deleteDocumentFocusByCondition } = MarkdownStore;
    const { documentTitle, setDocumentTitle } = RepositoryDetailStore;
    const { createLike, createShare, updateShare, deleteLike } = CommentStore;
    const [shareVisible, setShareVisible] = useState(false)
    const [documentDate, setDocumentDate] = useState()
    const userId = getUser().userId;
    const tenant = getUser().tenant;
    const [docInfo, setDocInfo] = useState()
    const [showComment, setShowComment] = useState(false);
    const repositoryId = props.match.params.repositoryId;
    const [like, setLike] = useState(false)
    const [focus, setFocus] = useState(false)
    let [likeNum, setLikeNum] = useState()
    let [commentNum, setCommentNum] = useState()
    const [value, setValue] = useState()
    const [markdownValue, setMarkdownValue] = useState();
    const path = props.location.pathname.split("/")[3];
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setDocumentTitle()
        setValue()
        setLoading(true)
        findDocument(documentId).then((data) => {
            if (data.code === 0) {
                if (data.data.details) {
                    const value = data.data.details
                    setValue(JSON.parse(value))
                    setMarkdownValue(data.data.detailText)
                } else {
                    setValue()
                }
                const document = data.data;
                const node = document.node;
                setDocInfo(node)
                setDocumentTitle(node.name)
                setDocumentDate(node.updateTime)
                setLike(document.like)
                setFocus(document.focus)
                setLikeNum(document.likenumInt)
                setCommentNum(document.commentNumber)
                
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
    const moreMenu = (
        <div className="more-box">
            <div className="markbox-download" onClick={() => downMorkDown()}>
                下载
            </div>
        </div>
    )

    const downMorkDown = () => {
        const url = `data:,${markdownValue}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = `${documentTitle}.md`;
        a.click();
    }

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

    return (<Provider {...store}>
        <Spin wrapperClassName="document-markdown-spin" spinning={loading} tip="加载中..." >
            <div className="document-markdown-examine">
                {
                    showComment && <Comment documentId={documentId} setShowComment={setShowComment} commentNum={commentNum} setCommentNum={setCommentNum} />
                }

                <div className="examine-top">
                    <div className="examine-title" id="examine-title">

                        <div className="examine-title-top">
                            {documentTitle}
                        </div>
                        <div className="examine-title-date">
                            更新日期：{documentDate}
                        </div>
                    </div>
                    <div className="document-edit">


                        {
                            focus ? <svg className="right-icon" aria-hidden="true" onClick={() => deleteFocus()}>
                                <use xlinkHref="#icon-collectioned"></use>
                            </svg>
                                :
                                <svg className="right-icon" aria-hidden="true" onClick={() => createFocus()}>
                                    <use xlinkHref="#icon-collection"></use>
                                </svg>
                        }
                        {
                            value && <Button className="document-action-edit" onClick={() => goEdit()}>编辑</Button>
                        }
                        <Button className="document-action-share" onClick={() => setShareVisible(true)}>分享</Button>


                        {/* <Dropdown
                        overlay={moreMenu}
                        placement="bottomLeft"
                        trigger="click"
                    >
                        <svg className="right-icon" aria-hidden="true">
                            <use xlinkHref="#icon-point"></use>
                        </svg>
                    </Dropdown> */}

                    </div>
                </div>
                {
                    value ? <div className="document-examine-content">
                        <Row className="document-examine-row">
                            <Col xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }}>
                                <div className="document-previeweditor">
                                    <MarkdownView value={value} base_url={upload_url} tenant={tenant} />
                                </div>
                            </Col>
                        </Row>

                    </div>
                        :
                        <> </>
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

                <ShareModal documentIds={[documentId]} shareVisible={shareVisible} setShareVisible={setShareVisible} docInfo={docInfo} createShare={createShare} updateShare={updateShare} />
            </div>
        </Spin>

    </Provider>

    )
}

export default inject("relationWorkStore")(observer(DocumentExamine));