/*
 * @Descripttion: 系统入口页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:53:37
 */
import React, { useState } from 'react';

import { renderRoutes } from "react-router-config";
import "./Layout.scss";

import { Provider } from 'mobx-react';
import HomeStore from "../store/HomeStore";
import { AppLink } from 'tiklab-licence-ui';
import FirstMenu from './FirstMenu';
const Layout = (props) => {
    const store = {
        homeStore: HomeStore
    }

    const route = props.route.routes;
    const pathname = props.location.pathname.split("/")[1];


    return (
        <Provider {...store}>
            <div className="layout">
                {
                    pathname !== "setting" && <FirstMenu AppLink={AppLink} {...props} />
                }
                <div className="layout-left">
                    {renderRoutes(route)}
                </div>

            </div>
        </Provider>

    )
}

export default Layout;