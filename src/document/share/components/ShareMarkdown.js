/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-14 11:20:08
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-09-16 09:14:44
 */
/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-09-13 13:56:29
 */
import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Row, Col } from 'antd';
import { MarkdownView } from "thoughtware-markdown-ui";
import "thoughtware-markdown-ui/es/thoughtware-markdown.css";
import "./shareMarkdown.scss"
import Comment from "./CommentShare";
import { withRouter } from "react-router";
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
    const { documentView, commentView, judgeAuthCode } = shareStore;
    const [showComment, setShowComment] = useState(false);
   
    
    const [value, setValue] = useState(initValue)
    const [docInfo, setDocInfo] = useState({ name: "", likenumInt: "", commentNumber: "" })
    useEffect(() => {
        commentView({ documentId: props.match.params.id }).then(data => {
            console.log(data)
            
        })
        documentView({ documentId: props.match.params.id }).then((data) => {
            if (data.code === 0) {
                if (data.data.details) {
                    const value = data.data.details
                    setValue(JSON.parse(value))
                    console.log(JSON.parse(value))
                } else {
                    setValue(initValue)
                }
                setDocInfo(data.data)
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
                    <Col className="repositorydetail-content-col" xl={{ span: 18, offset: 3 }} lg={{ span: 20, offset: 2 }}>
                        <div style={{paddingTop: "10px"}}>
                            <MarkdownView value={value} base_url = {upload_url} />
                        </div>

                    </Col>
                </Row>
                {
                    showComment && <Comment documentId={props.match.params.id} setShowComment={setShowComment} />
                }
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

export default inject("shareStore")(observer(withRouter(ShareMarkdown)));