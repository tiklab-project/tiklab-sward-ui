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
import {Row, Col, message, Empty, Spin, Tag} from 'antd';
import { PreviewEditor, EditorCategory } from "tiklab-slate-ui";
import "tiklab-slate-ui/es/tiklab-slate.css";
import "./DocumentExamine.scss"
import ShareModal from "../../share/components/ShareModal";
import { getUser } from "tiklab-core-ui";
import Comment from "./Comment";
import CommentShare from "../store/CommentStore";
import DocumentStore from "../store/DocumentStore";
import RepositoryDetailStore from "../../../common/store/RepositoryDetailStore";
import Button from "../../../../common/components/button/Button";
import DocumentActionMenu from "../../common/DocumentActionMenu";
import {
    MessageOutlined,
    ProfileOutlined,
    VerticalLeftOutlined
} from "@ant-design/icons";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";

const DocumentExamine = (props) => {

    const { relationWorkStore, DocumentVersionList, DocumentVersionAdd ,DocumentReviewAdd, updateNodeEntity, reviewStatus } = props;

    const { repository, documentTitle, setDocumentTitle, createRecent } = RepositoryDetailStore;
    const [documentDate, setDocumentDate] = useState();
    const path = props.location.pathname.split("/")[3];
    const store = {
        documentStore: DocumentStore
    }
    const documentId = props.match.params.id;
    const repositoryId = props.match.params.repositoryId;
    const { findDocument, createDocumentFocus, deleteDocumentFocusByCondition } = DocumentStore;

    const { createLike, deleteLike } = CommentShare;
    const [shareVisible, setShareVisible] = useState(false)
    const user = getUser();

    const [showComment, setShowComment] = useState(false);

    const [like, setLike] = useState(false)
    const [focus, setFocus] = useState(false)
    let [likeNum, setLikeNum] = useState()
    let [commentNum, setCommentNum] = useState()
    const [value, setValue] = useState()
    const [loading, setLoading] = useState(true);
    const [documents, setDocument] = useState()
    const [documentVersion,setDocumentVersion] = useState(null);
    const [showCatagory,setShowCatagory] = useState(true);
    //仓库归档状态
    const repositoryStatus = repository?.status === 'nomal';
    //文档评审状态
    const documentApprove = documents?.node?.nodeStatus === 0 || documents?.node?.nodeStatus ===1;

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
                    }
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
                        master: { id: user.userId },
                        wikiRepository: { id: repositoryId }
                    })
                }
            }
        }).finally(()=>{
            setLoading(false)
        })
    }, [documentId])

    // 点赞
    const addDocLike = () => {
        if (like) {
            const data = {
                toWhomId: documentId,
                likeUser: user.userId,
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
                likeUser: { id: user.userId },
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
            masterId: user.userId,
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
            masterId: user.userId
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

    /**
     * 导出worid
     */
    const exportsWord = async () => {
        try {
            setLoading(true);
            const url = `${upload_url}/documentExport/exportWord?docId=${documentId}&ticket=${user.ticket}${user.tenant ? `&tenant=${user.tenant}` : ''}`;
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } finally {
            setLoading(false)
        }

    };

    /**
     * 下线
     */
    const updateNode= () => {
        if(typeof updateNodeEntity === 'function'){
            updateNodeEntity({
                ...documents.node,
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

    const isEdit = repositoryStatus && (reviewStatus ? documentApprove : true)

    return (<Provider {...store}>
        <Spin wrapperClassName="document-examine-spin" spinning={loading} >
            {
                documents ?
                    documents?.node?.recycle === "0" ?
                        <div className="document-examine">
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
                                                {documents?.node?.nodeStatus === 1 && <Tag color="orange">草稿</Tag>}
                                                {documents?.node?.nodeStatus === 2 && <Tag color="green">评审中</Tag>}
                                                {documents?.node?.nodeStatus === 3 && <Tag color="blue">已上线</Tag>}
                                            </div>
                                        }
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
                                                        setValue(documents.details);
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
                                        document={documents}
                                        commentNum={commentNum}
                                        setShowComment={setShowComment}
                                        setValue={setValue}
                                        documentVersion={documentVersion}
                                        setDocumentVersion={setDocumentVersion}
                                        DocumentVersionAdd={DocumentVersionAdd}
                                        DocumentVersionList={DocumentVersionList}
                                        DocumentReviewAdd={DocumentReviewAdd}
                                        exportsWord={exportsWord}
                                        updateNode={updateNode}
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
                                                    md={{ span: 24 }}
                                                    lg={{ span: 22, offset: 1 }}
                                                    xl={{ span: 20, offset: 2 }}
                                                    xxl={{ span: 18, offset: 3 }}
                                                >
                                                    <PreviewEditor
                                                        value={value}
                                                        relationWorkStore={relationWorkStore}
                                                        base_url={upload_url}
                                                        img_url={upload_url}
                                                        viewImageUrl="/image"
                                                        tenant={user.tenant}
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="category-editor-box">
                                            {
                                                showCatagory ?
                                                    <div className="category-editor">
                                                        <div className="category-editor-top">
                                                            <div className='category-editor-title'>本页目录</div>
                                                            <div
                                                                className="category-hidden"
                                                                onClick={()=>setShowCatagory(!showCatagory)}
                                                            >
                                                                <VerticalLeftOutlined />
                                                            </div>
                                                        </div>
                                                        <div className="category-editor-content">
                                                            <EditorCategory
                                                                newValue={JSON.parse(value)}
                                                                type="simple"
                                                            />
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className='category-editor'>
                                                        <div className='category-narrow'
                                                             onClick={()=>setShowCatagory(!showCatagory)}
                                                             data-title-left={'目录'}
                                                        >
                                                            <ProfileOutlined />
                                                        </div>
                                                    </div>
                                            }
                                        </div>
                                    </div> : <></>
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
                                docInfo={documents?.node}
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
