/*
 * @Descripttion: 知识库设置入口页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:07:27
 */
import React, { useState,useEffect } from "react";
import RepositorySetAside from "../components/RepositorySetAside";
import RepositorySetStore from "../store/RepositorySetStore";
import { Provider } from "mobx-react";

const RepositorySetDetail = (props)=>{

    const store = {
        repositorySetStore: RepositorySetStore
    }

    // 获取当前项目id
    const repositoryId = props.match.params.repositoryId;

    useEffect(() => {
        // 从信息页面跳入项目详情页面时，获取项目id
        let search = props.location.search;
        if(search !== "") {
            search = search.split("=")
            localStorage.setItem("repositoryId", search[1]);
        }
    }, [repositoryId])

    // 路由
    const repositoryRouters = [
        {
            title: '知识库信息',
            icon: 'survey',
            key: `/repository/${repositoryId}/set/basicInfo`,
            encoded: "Survey",
            iseEnhance: false
        },
        {
            title: '成员',
            icon: 'survey',
            key: `/repository/${repositoryId}/set/user`,
            encoded: "User",
            iseEnhance: false
        },
        {
            title: '权限',
            icon: 'survey',
            key: `/repository/${repositoryId}/set/domainRole`,
            encoded: "Privilege",
            iseEnhance: false
        },
        {
            title: '消息',
            icon: 'survey',
            key: `/repository/${repositoryId}/set/messagenotice`,
            encoded: "message",
            iseEnhance: false
        },
        {
            title: '共享',
            icon: 'survey',
            key: `/repository/${repositoryId}/set/share`,
            iseEnhance: false
        },
        {
            title: '评审',
            icon: 'review',
            key: `/repository/${repositoryId}/set/review`,
            encoded: "review",
            iseEnhance: true
        },
        {
            title: '回收站',
            icon: 'recycleBin',
            key: `/repository/${repositoryId}/set/recycleBin`,
            encoded: "recycleBin",
            iseEnhance: true,
        },
    ];

    return (
         <Provider {...store}>
             <RepositorySetAside
                 {...props}
                 repositoryRouters={repositoryRouters}
                 outerPath={`/repository/${repositoryId}/set`}
                 AsideTitle={`设置`}
             />
         </Provider>
    )

}
export default RepositorySetDetail;
