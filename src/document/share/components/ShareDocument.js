
/*
 * @Descripttion: 分享的文档页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:32:37
 */
import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Row, Col } from 'antd';
import { PreviewEditor } from "tiklab-slate-ui";
import "tiklab-slate-ui/es/tiklab-slate.css";
import "./shareDocument.scss"
import CommentShare from "./CommentShare";
import { withRouter } from "react-router";
import { getUser } from "tiklab-core-ui";
const ShareDocument = (props) => {
    const { shareStore, relationWorkStore } = props;
    const { documentView, commentView } = shareStore;
    const [showComment, setShowComment] = useState(false);
    const [value, setValue] = useState()
    const [docInfo, setDocInfo] = useState({ name: "", likenumInt: "", commentNumber: "" })
    const tenant = getUser().tenant;
    useEffect(() => {
        // 获取评论列表
        commentView({ documentId: props.match.params.id }).then(data => {
            console.log(data)

        })

        // 获取文档内容
        documentView({ documentId: props.match.params.id }).then((data) => {
            if (data.code === 0) {
                setValue()
                if (data.data?.details) {
                    setValue(data.data?.details)
                } else {
                    setValue()
                }
                setDocInfo(data.data?.node)
            }
        })
        return;
    }, [props.match.params.id])
    return (
        <div className="document-share-examine">
            {
                    showComment && <CommentShare documentId={props.match.params.id} setShowComment={setShowComment} />
                }
            <div className="examine-title">
                <span className="examine-name">{docInfo.name}</span>
            </div>
            <div className="examine-content">
                <Row style={{ flex: 1, overflow: "auto" }}>
                    <Col
                        className="repositorydetail-content-col"
                        xs={{ span: 22, offset: 1 }}
                        lg={{ span: 18, offset: 3 }}
                        xl={{ span: 16, offset: 4 }}
                    >
                        <div style={{paddingTop: "10px"}}>
                            {
                                value && <PreviewEditor value={value}
                                    relationWorkStore = {relationWorkStore}
                                    base_url = {upload_url}
                                    img_url = {upload_url}
                                    viewImageUrl = "/image"
                                    tenant = {tenant}
                                />

                            }
                            </div>

                    </Col>
                </Row>

            </div>


            <div className="comment-box">
                <div className="comment-box-item">
                    <svg className="midden-icon" aria-hidden="true" onClick={() => setShowComment(!showComment)}>
                        <use xlinkHref="#icon-comment"></use>
                    </svg>
                    <div className="commnet-num">{docInfo.commentNumber}</div>
                </div>
            </div>
        </div>


    )
}

export default inject("shareStore", "relationWorkStore")(observer(withRouter(ShareDocument)));
