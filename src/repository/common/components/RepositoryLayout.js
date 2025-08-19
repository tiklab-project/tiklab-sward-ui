/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/8/8
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/8/8
 */
import React from "react";
import RepositoryDetail from "./RepositoryDetail";

const RepositoryLayout = (props) => {

    const repositoryId = props.match.params.repositoryId;
    const theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "default";

    // 路由
    const router = [
        {
            title: "概况",
            icon: 'survey-' + theme,
            defaultIcon: "survey-default",
            id: `/repository/${repositoryId}/overview`,
            to: `/repository/${repositoryId}/overview`,
            key: "overview",
            encoded: "Survey"
        },
        {
            title: "文档",
            icon: 'doc-' + theme,
            defaultIcon: "doc-default",
            id: `/repository/${repositoryId}/doc`,
            to: `/repository/${repositoryId}/doc`,
            key: "doc",
            encoded: "doc"
        },
    ];

    return (
        <RepositoryDetail
            {...props}
            router={router}
        />
    )
}

export default RepositoryLayout
