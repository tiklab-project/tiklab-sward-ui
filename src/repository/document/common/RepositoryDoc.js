/*
 * @Descripttion: 知识库内文档页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:02:52
 */
import React, { useState, useEffect } from "react";
import {Empty, Layout, Spin} from 'antd';
import { renderRoutes } from "react-router-config";
import { observer, inject, Provider } from "mobx-react";
import RepositoryDocList from "./RepositoryDocList";
import "./RepositoryDoc.scss"

const RepositoryDoc = (props) => {

    const { repositoryCatalogueList,uploadSpinning } = props.repositoryDetailStore;

    // 解析props
    const { route } = props;

    return (
        <Spin spinning={uploadSpinning} tip={'上传中'} wrapperClassName="repository-doc-spin">
            <Layout className="repository-doc">
                <RepositoryDocList
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
        </Spin>
    )
}

export default inject('repositoryDetailStore')(observer(RepositoryDoc));
