/*
 * @Descripttion: 知识库详情页入口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-08-30 15:06:15
 */
import React, { useState,useEffect } from "react";
import {observer, inject, Provider} from "mobx-react";
import repositoryDetailStore from "../store/RepositoryDetailStore";
import {getUser} from "tiklab-core-ui";
import RepositoryAside from "../../../common/components/repositoryAside/RepositoryAside";
import RepositoryChangeModal from "./RepositoryChangeModal";

const RepositoryDetail = (props)=>{

    const {systemRoleStore,route} = props;

    const store = {
        repositoryDetailStore: repositoryDetailStore
    }

    const {findRepository,findFileLimit,createRecent} = repositoryDetailStore;
    const {getInitProjectPermissions} = systemRoleStore;

    const [isShowText, SetIsShowText ] = useState(false)

    const repositoryId = props.match.params.repositoryId;
    const userId = getUser().userId
    // 当前选中菜单key
    const path = props.location.pathname.split("/")[3];
    const theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "default";

    useEffect(() => {
        findRepository(repositoryId).then(res=>{
            if(res.code===0){
                const data = res.data;
                getInitProjectPermissions(userId,repositoryId,data?.projectLimits === "0")
                createRecent({
                    name: data?.name,
                    model: "repository",
                    modelId: repositoryId,
                    master: {id:userId},
                    wikiRepository: {id:repositoryId}
                })
            }
        })
        findFileLimit().then()
    }, [repositoryId]);

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
        // {
        //     title: "共享",
        //     icon: 'share-' + theme,
        //     defaultIcon: "share-default",
        //     id: `/repository/${repositoryId}/share`,
        //     to: `/repository/${repositoryId}/share`,
        //     key: "share",
        //     encoded: "share"
        // },
        {
            title: '统计',
            icon: 'statistics-' + theme,
            defaultIcon: "statistics-default",
            id: `/repository/${repositoryId}/statistics`,
            to: `/repository/${repositoryId}/statistics`,
            key: 'statistics',
            encoded: "statistics",
            isEnhance: true,
        },
    ];

    return (
        <Provider {...store}>
            <RepositoryAside
                {...props}
                isShowText={isShowText}
                SetIsShowText={SetIsShowText}
                ChangeModal={RepositoryChangeModal}
                initRouters={router}
                backName={"返回首页"}
                path={path}
                setUrl={`/repository/${repositoryId}/set`}
                backUrl={`/repository`}
            />
        </Provider>
    )

}
export default inject("systemRoleStore")(observer(RepositoryDetail));
