
/*
 * @Descripttion: 分享的markdown文档
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:35:24
 */
import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Row, Col } from 'antd';
import { MarkdownView } from "tiklab-markdown-ui";
import "tiklab-markdown-ui/es/tiklab-markdown.css";
import "./ShareMarkdown.scss"
import CommentShare from "./ShareComment";
import { withRouter } from "react-router";
import {MessageOutlined} from "@ant-design/icons";

const initValue = [{
    type: 'code',
    children: [
        {
            type: 'paragraph',
            children: [
                {
                    text: ''
                },
            ],
        }
    ]
}]
const ShareMarkdown = (props) => {
    const { shareStore } = props;
    const { documentView, commentView } = shareStore;
    const [showComment, setShowComment] = useState(false);


    const [value, setValue] = useState(initValue)
    const [docInfo, setDocInfo] = useState({ name: "", likenumInt: "", commentNumber: "" })
    useEffect(() => {
        // 获取评论
        commentView({ documentId: props.match.params.id }).then(data => {
            console.log(data)

        })
        // 获取文档详情
        documentView({ documentId: props.match.params.id }).then((data) => {
            if (data.code === 0) {
                if (data.data?.details) {
                    const value = data.data?.details
                    setValue(JSON.parse(value))
                    console.log(JSON.parse(value))
                } else {
                    setValue(initValue)
                }
                setDocInfo(data.data?.node)
            }
        })
        return
    }, [props.match.params.id])


    return (
        <div className="markdown-share-examine">
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
                            <MarkdownView value={value} base_url = {upload_url} />
                        </div>
                    </Col>
                </Row>
                {
                    showComment &&
                    <CommentShare
                        documentId={props.match.params.id}
                        showComment={showComment}
                        setShowComment={setShowComment}
                    />
                }
            </div>
            <div className="comment-box" onClick={() => setShowComment(!showComment)}>
                <div className="comment-box-item">
                    <MessageOutlined />
                    <div className="commnet-num">{docInfo.commentNumber}</div>
                </div>
            </div>
        </div>
    )
}

export default inject("shareStore")(observer(withRouter(ShareMarkdown)));
