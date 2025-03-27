/*
 * @Descripttion: 知识库详情页入口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-08-30 15:06:15
 */
import React, { useState,useEffect } from "react";
import { Layout} from 'antd';
import RepositorydeAside from "./RepositoryDetailAside";
import "../components/RepositoryLayout.scss";
import { renderRoutes } from "react-router-config";
import {observer, inject, Provider} from "mobx-react";
import repositoryDetailStore from "../store/RepositoryDetailStore";
import {getUser} from "tiklab-core-ui";

const RepositoryDetail = (props)=>{

    const {systemRoleStore,route} = props;

    const store = {
        repositoryDetailStore: repositoryDetailStore
    }

    const {findRepository} = repositoryDetailStore;
    const {getInitProjectPermissions} = systemRoleStore;

    const [isShowText, SetIsShowText ] = useState(false)

    const repositoryId = props.match.params.repositoryId;
    const userId = getUser().userId

    useEffect(() => {
        findRepository(repositoryId).then(res=>{
            if(res.code===0){
                const data = res.data;
                getInitProjectPermissions(userId,repositoryId,data?.projectLimits === "0")
            }
        })
    }, [repositoryId]);

    return (
        <Provider {...store}>
            <Layout className="repositorydetail">
                <RepositorydeAside
                    isShowText = {isShowText}
                    SetIsShowText = {SetIsShowText}
                    {...props}
                />
                <Layout className="repositorydetail-content">
                    {renderRoutes(route.routes)}
                </Layout>
            </Layout>
        </Provider>
    )

}
export default inject("systemRoleStore")(observer(RepositoryDetail));
