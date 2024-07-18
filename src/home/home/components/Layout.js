/*
 * @Descripttion: 入口页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 16:14:15
 */
import React, { useState } from 'react';

import { renderRoutes } from "react-router-config";
import Header from "./Header";
import "./Layout.scss";

import { Provider } from 'mobx-react';
import HomeStore from "../store/HomeStore";
import { AppLink, AvatarLink, HelpLink } from 'thoughtware-licence-ui';
import FirstMenu from './FirstMenu';
const Layout = (props) => {
    const store = {
        homeStore: HomeStore
    }
    const showFirstMenu = ["home", "repository"]
    const route = props.route.routes;
    const pathname = props.location.pathname.split("/")[1];
    console.log(pathname)
    console.log(props)

    return (
        <Provider {...store}>
            <div className="layout">
                <Header AppLink={AppLink} AvatarLink = {AvatarLink} HelpLink = {HelpLink} {...props} />
                <div className="layout-content">
                    {/* {
                        showFirstMenu.indexOf(pathname) > -1 && <FirstMenu AppLink={AppLink} {...props} />
                    } */}
                     <FirstMenu {...props} />
                    <div className="layout-page">
                        {renderRoutes(route)}
                    </div>
                </div>

            </div>
        </Provider>

    )
}

export default Layout;