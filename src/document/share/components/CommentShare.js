/*
 * @Descripttion: 分享页面的评论
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:19:57
 */
import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import {Drawer, Empty} from "antd";
import "./CommentShare.scss"
import Profile from "../../../common/components/profile/Profile";

const CommentShare = (props) => {

    const { commentStore, documentId, showComment,setShowComment, shareStore } = props;
    const { findCommentPage } = commentStore;
    const { commentView } = shareStore;
    const [commonList, setCommonList] = useState();
    const [currentPage, setCurrentPage] = useState(10);
    const [totalPage, setTotalPage] = useState(0)

    // 获取评论列表
    useEffect(() => {
        const value = {
            documentId: documentId,
            pageParam: {
                pageSize: 1,
                currentPage: currentPage,
            }
        }
        commentView(value).then(data => {
            if (data.code === 0) {
                console.log(data)
                setCommonList(data.data)
                setTotalPage(data.data.totalPage)
            }
        })
    }, [documentId])

    // 下一页
    const nextPageCommon = () => {
        const page = currentPage + 1;
        setCurrentPage(page)
        const data = {
            documentId: documentId,
            pageParam: {
                pageSize: 1,
                currentPage: page,
            }
        }

        findCommentPage(data).then(data => {
            if (data.code === 0) {
                const list = commonList.concat(data.data.dataList)
                setCommonList(list)
                setTotalPage(data.data.totalPage)
            }
        })
    }

    return (
        <Drawer
            className="share-comment"
            visible={showComment}
            closable={false}
            width={400}
            onClose={()=>setShowComment(false)}
        >
            <div className="comment-top">
                <span className="comment-title">评论</span>
                <svg className="icon-24" aria-hidden="true" onClick={() => setShowComment(false)}>
                    <use xlinkHref="#icon-close"></use>
                </svg>
            </div>
            <div className="comment-list">
                {
                    commonList && commonList.length > 0 ? <>
                        {
                            commonList && commonList.map(item => {
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
                                    {
                                        item.commentList && item.commentList.map(children => {
                                            return <div className="comment-item commnet-children-item" key={children.id}>
                                                <div className="comment-list-top">
                                                    <div className="comment-user">
                                                        <Profile userInfo={children.user}/>
                                                        <span className="user-name">{children.user.nickname}回复了：{children.aimAtUser.nickname}</span>
                                                    </div>
                                                    <div className="comment-time">
                                                        {children.createTime.slice(5, 16)}
                                                    </div>
                                                </div>
                                                <div className="comment-content">
                                                    {children.details}
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            })
                        }
                        {
                            totalPage > 1 && currentPage < totalPage &&
                            <div className="comment-more-botton" onClick={() => nextPageCommon()}>查看更多...</div>
                        }
                    </>
                        :
                        <Empty description="暂时没有评价~" />
                }
            </div>
        </Drawer>
    )
}

export default inject("commentStore", "shareStore")(observer(CommentShare));
