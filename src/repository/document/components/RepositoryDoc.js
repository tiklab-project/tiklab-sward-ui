/*
 * @Descripttion: 知识库内文档页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:02:52
 */
import React, { useState, useEffect } from "react";
import { Empty, Layout } from 'antd';
import { renderRoutes } from "react-router-config";
import { observer, inject, Provider } from "mobx-react";
import RepositoryDetailStore from "../../common/store/RepositoryDetailStore";
import RepositoryDocList from "./RepositoryDocList";
import "./RepositoryDoc.scss"
const RepositoryDoc = (props) => {
    const { repositoryCatalogueList, NodeRecycleModal, NodeArchivedModal } = RepositoryDetailStore;
    // 解析props
    const { route } = props;
    const store = {
        repositoryDetailStore: RepositoryDetailStore
    }
    return (<Provider {...store}>
        <Layout className="repository-doc">
            <RepositoryDocList
                NodeRecycleModal={NodeRecycleModal}
                NodeArchivedModal={NodeArchivedModal}
                {...props}
            />
            <Layout className="repository-doc-content">
                {
                    repositoryCatalogueList.length > 0 ?
                        renderRoutes(route.routes)
                        :
                        <div className="repository-doc-empty">
                            <Empty description="暂无文档" />
                        </div>

                }
            </Layout>

        </Layout>
    </Provider>

    )

}
export default observer(RepositoryDoc);