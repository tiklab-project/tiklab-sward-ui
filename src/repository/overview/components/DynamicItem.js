/*
 * @Author: 袁婕轩
 * @Date: 2023-12-13 17:04:39
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:03:55
 * @Description: 动态项
 */

import React from "react";
import "./DynamicItem.scss"
import { withRouter } from "react-router";
const DynamicListItem = (props) => {
    const { content, actionType, key } = props;
    const data = JSON.parse(content)
    const repositoryId = props.match.params.repositoryId;
    const { createUserIcon, createUser, updateTime, documentId, createUserName, createTime,
        documentName, oldValue, newValue, documentType } = data;
    const goDynamicDetail = () => {
        if (documentType === "document") {
            props.history.push(`/repository/${repositoryId}/doc/rich/${documentId}`)
        }
        if (documentType === "markdown") {
            props.history.push(`/repository/${repositoryId}/doc/markdown/${documentId}`)
        }
        if (documentType === "file") {
            props.history.push(`/repository/${repositoryId}/doc/file/${documentId}`)
        }
    }
    const setDom = () => {
        let dom = null;
        switch (actionType) {
            case "SWARD_LOGTYPE_DOCUMENTADD":
                dom = (
                    <div className="dynamic-list-item" key={key}>
                        <div className="dynamic-list-item-content">
                            <div className="dynamic-content">
                                <div className="dynamic-document-action">{createUser.nickname}添加了文档</div>
                                <div className="dynamic-document-item">
                                    <div className="dynamic-document-title" onClick={() => goDynamicDetail()}>{documentName}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break;
            case "SWARD_LOGTYPE_DOCUMENTUPDATENAME":
                dom = <div className="dynamic-list-item" key={key}>
                    <div className="dynamic-list-item-content">
                        <div className="dynamic-content">
                            <div className="dynamic-document-action">{createUserName}修改了文档名称</div>
                            <div className="dynamic-document-update">
                                {/* <div
                                    className="dynamic-document-oldvalue"
                                >
                                    {oldValue}
                                </div>
                                ——— */}
                                <div
                                    className="dynamic-document-newValue"
                                    onClick={() => goDynamicDetail()}
                                >
                                    {newValue}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                break;
            default:
                break;

        }
        return dom;
    }
    return (<>
        {
            setDom()
        }
    </>

    )
}

export default withRouter(DynamicListItem);
