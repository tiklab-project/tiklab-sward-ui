
/*
 * @Descripttion: 文档评论组件
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:18:07
 */
import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { Input, Empty, message } from "antd";
import Button from "../../../common/components/button/Button";
import "./comment.scss"
import { getUser } from "tiklab-core-ui";
import moment from "moment";
import CommentStore from "../store/CommentStore"
import Profile from "../../../common/components/profile/Profile";
const Comment = (props) => {
    const { documentId, setShowComment, commentNum, setCommentNum } = props;
    const { createComment, findCommentPage, deleteComment, deleteCommentCondition } = CommentStore;
    const [commentFirstContent, setCommentFirstContent] = useState();
    const [commentSecondContent, setCommentSecondContent] = useState();
    const [commentThirdContent, setCommentThirdContent] = useState();
    const [commentList, setCommentList] = useState([]);
    const userId = getUser().userId;
    const userName = getUser().name;
    const nickname = getUser().nickname;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0)
    const commonBox = useRef();

    /**
     * 获取评论列表
     */
    useEffect(() => {
        const value = {
            documentId: documentId,
            pageParam: {
                pageSize: 10,
                currentPage: currentPage,
            }
        }
        findCommentPage(value).then(data => {
            if (data.code === 0) {
                setCommentList(data.data.dataList)
                setTotalPage(data.data.totalPage)
            }
        })
        return;
    }, [documentId])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!commonBox.current?.contains(e.target)) {
                setShowComment(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowComment(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);


    /**
     * 发布评论
     */
    const announce = () => {
        if (commentFirstContent) {
            const value = {
                wikiDocument: {
                    id: documentId
                },
                details: commentFirstContent,
                user: { id: userId, name: userName, nickname: nickname }
            }
            createComment(value).then(data => {
                if (data.code === 0) {
                    value.id = data.data
                    value.commentList = []
                    const newCommon = { ...value, createTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), id: data.data }
                    commentList.unshift(newCommon)
                    setCommentList([...commentList])
                    setCommentFirstContent(null)
                    setCommentNum(commentNum + 1)
                }

            })
        } else {
            message.info("请输入内容")
        }

    }
    //回复评论
    const [reply, setReply] = useState()

    /**
     * 回复评论
     * @param {被回复的评论的id} id
     * @param {*} index
     * @param {*} aimAtUser
     */
    const announceReply = (id, index, aimAtUser) => {
        if (commentSecondContent) {
            const value = {
                firstOneCommentId: id,
                parentCommentId: id,
                wikiDocument: {
                    id: documentId
                },
                details: commentSecondContent,
                user: { id: userId, name: userName, nickname: nickname },
                aimAtUser: aimAtUser
            }
            createComment(value).then(data => {
                if (data.code === 0) {
                    setReply(null)
                    value.id = data.data
                    commentList[index].commentList.unshift(value)
                    setCommentList([...commentList])
                    setCommentSecondContent(null)
                    setCommentNum(commentNum + 1)
                }

            })
        } else {
            message.info("请输入内容")
        }

    }

    const [childrenReply, setChildrenReply] = useState()
    /**
     * 第三层回复
     * @param {*} firstOneCommentId
     * @param {*} parentCommentId
     * @param {*} index
     * @param {*} aimAtUser
     */
    const announceThirdReply = (firstOneCommentId, parentCommentId, index, aimAtUser) => {
        if (commentThirdContent) {
            const value = {
                firstOneCommentId: firstOneCommentId,
                parentCommentId: parentCommentId,
                wikiDocument: {
                    id: documentId
                },
                details: commentThirdContent,
                user: { id: userId, name: userName, nickname: nickname },
                aimAtUser: aimAtUser
            }
            createComment(value).then(data => {
                if (data.code === 0) {
                    value.id = data.data
                    setChildrenReply(null)
                    commentList[index].commentList.unshift(value)
                    setCommentList([...commentList])
                    setCommentThirdContent(null)
                    setCommentNum(commentNum + 1)
                }
            })
        } else {
            message.info("请输入内容")
        }

    }

    /**
     * 翻页
     */
    const nextPageCommon = () => {
        const page = currentPage + 1;
        setCurrentPage(page)
        const data = {
            documentId: documentId,
            pageParam: {
                pageSize: 2,
                currentPage: page,
            }
        }

        findCommentPage(data).then(data => {
            if (data.code === 0) {
                const list = commentList.concat(data.data.dataList)
                setCommentList(list)
                setTotalPage(data.data.totalPage)
            }
        })
    }

    const deleteFirst = (id, index) => {
        deleteCommentCondition({ firstOneCommentId: id }).then(res => {
            if (res.code === 0) {
                const list = commentList.filter((item) => item.id !== id);
                setCommentList(list)
                const num = commentList[index].commentList.length + 1
                setCommentNum(commentNum - num)
            }
        })
    }

    const deleteSecond = (fid, id) => {
        deleteComment({ id: id }).then(res => {
            if (res.code === 0) {
                const list = commentList[fid].commentList.filter((item) => item.id !== id);
                commentList[fid].commentList = list;
                setCommentList([...commentList])
                setCommentNum(commentNum - 1)
            }
        })
    }

    return (
        <div className="comment" ref={commonBox}>
            <div className="comment-top">
                <span className="comment-title">评论</span>
                <svg className="svg-icon" aria-hidden="true" onClick={() => setShowComment(false)}>
                    <use xlinkHref="#icon-close"></use>
                </svg>
            </div>
            <div className="comment-list">
                <div className="edit-comment">
                    <svg className="icon-svg" aria-hidden="true">
                        <use xlinkHref="#icon-user5"></use>
                    </svg>
                    <Input placeholder="请输入评论" value={commentFirstContent} onChange={value => setCommentFirstContent(value.target.value)} />
                    <Button type="primary" onClick={() => announce()} disable={commentSecondContent}>发布</Button>
                </div>
                {
                    commentList && commentList.length > 0 ? <>
                        {
                            commentList && commentList.map((item, index) => {
                                return <div className="comment-item" key={item.id}>
                                    <div className="comment-list-top">
                                        <div className="comment-user">
                                           <Profile userInfo={item.user}/>
                                            <span className="user-name">{item.user.nickname}</span>
                                        </div>
                                        <div className="comment-time">
                                            {item.createTime.slice(5, 16)}
                                        </div>
                                    </div>
                                    <div className="comment-content">
                                        {item.details}
                                    </div>
                                    <div className="comment-operate">
                                        <div>
                                            {/* <span className="comment-edit" onClick={() => updataFirst(item.id)}>编辑</span> */}
                                            {
                                                userId === item?.user?.id &&
                                                <span onClick={() => deleteFirst(item.id, index)} className="comment-delete">删除</span>
                                            }
                                            <span onClick={() => setReply(reply ? null : item.id)} className="comment-reply">
                                                {reply === item.id ? '收起' : '回复'}
                                            </span>
                                            <span className="comment-like">赞</span>
                                        </div>
                                    </div>
                                    <div className={`edit-comment ${reply === item.id ? "edit-comment-show" : "edit-comment-hidden"}`}>
                                        <svg className="icon-svg" aria-hidden="true">
                                            <use xlinkHref="#icon-user5"></use>
                                        </svg>
                                        <Input placeholder="请输入评论" value={commentSecondContent} onChange={value => setCommentSecondContent(value.target.value)} />
                                        <Button type="primary" onClick={() => announceReply(item.id, index, item.user)} disable={commentSecondContent}>发布</Button>
                                    </div>
                                    {
                                        item.commentList && item.commentList.map((children, childrenIndex) => {
                                            return <div className="comment-item commnet-children-item" key={children.id}>
                                                <div className="comment-list-top" >
                                                    <div className="comment-user">
                                                        <Profile userInfo={children.user}/>
                                                        <span className="user-name">{children.user.name}回复了：{children.aimAtUser.name}</span>
                                                    </div>
                                                    <div className="comment-time">
                                                        {item.createTime.slice(5, 16)}
                                                    </div>
                                                </div>
                                                <div className="comment-content">
                                                    {children.details}
                                                </div>
                                                <div className="comment-operate">
                                                    <div>
                                                        {
                                                            userId === children?.user?.id &&
                                                            <span className="comment-delete" onClick={() => deleteSecond(index, children.id)}>删除</span>
                                                        }
                                                        <span className="comment-reply" onClick={() => setChildrenReply(childrenReply ? null : children.id)}>
                                                            {childrenReply === children.id ? '收起':'回复'}
                                                        </span>
                                                        <span className="comment-like">赞</span>
                                                    </div>
                                                </div>
                                                <div className={`edit-comment ${childrenReply === children.id ? "edit-comment-show" : "edit-comment-hidden"}`}>
                                                    <svg className="icon-svg" aria-hidden="true">
                                                        <use xlinkHref="#icon-user5"></use>
                                                    </svg>
                                                    <Input placeholder="请输入评论" value={commentThirdContent} onChange={value => setCommentThirdContent(value.target.value)} />
                                                    <Button type="primary" disable={commentThirdContent} onClick={() => announceThirdReply(item.id, children.id, index, children.user)}>发布</Button>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            })
                        }
                        {
                            totalPage > 1 && currentPage < totalPage && <div className="comment-more-botton" onClick={() => nextPageCommon()}>查看更多...</div>
                        }
                    </>
                        :
                        <Empty description="暂时没有评价~" />
                }
            </div>
        </div>
    )
}

export default observer(Comment);
