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
import RepositoryDetailStore from "../store/RepositoryDetailStore";

const RepositoryDetail = (props)=>{
    const {NodeRecycleModal, NodeArchivedModal} = props;
    const [isShowText, SetIsShowText ] = useState(false)
    // 解析props
    const {systemRoleStore,route} = props;
    const store = {
        repositoryDetailStore: RepositoryDetailStore
    }
    return (<Provider {...store}>
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
