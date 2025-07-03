/*
 * @Descripttion: 知识库内文档页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:02:52
 */
import React, {useState} from "react";
import {Empty, Layout, Spin} from 'antd';
import { renderRoutes } from "react-router-config";
import { observer, inject } from "mobx-react";
import RepositoryDocList from "./RepositoryDocList";
import "./RepositoryDoc.scss"

const RepositoryDoc = (props) => {

    const { route, repositoryDetailStore } = props;

    const { uploadSpinning } = repositoryDetailStore;

    //侧边栏折叠
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Spin spinning={uploadSpinning} tip={'上传中'} wrapperClassName="repository-doc-spin">
            <Layout className="repository-doc">
                <RepositoryDocList
                    {...props}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
                <Layout className="repository-doc-content">
                    {
                        renderRoutes(route.routes, { collapsed })
                    }
                </Layout>
            </Layout>
        </Spin>
    )
}

export default inject('repositoryDetailStore')(observer(RepositoryDoc));
