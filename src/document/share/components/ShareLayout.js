/*
 * @Descripttion: 页面主题框架
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 16:14:15
 */
import React from 'react';
import "./ShareLayout.scss";
import ShareAside from "./ShareAside";
import { Layout } from "antd"
import { renderRoutes } from "react-router-config";
import CommentStore from "../../document/store/CommentStore";
import ShareStore from '../store/ShareStore';
import { Provider } from 'mobx-react';

const ShareLayout = (props) => {

    const { route } = props;

    const store = {
        commentStore: CommentStore,
        shareStore: ShareStore
    }

    return (
        <Provider {...store}>
            <Layout className="share-page repositorydetail">
                <ShareAside
                    {...props}
                />
                <Layout className="repositorydetail-content">
                    {renderRoutes(route.routes)}
                </Layout>
            </Layout>
        </Provider>
    )
}


export default ShareLayout;
