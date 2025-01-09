/*
 * @Descripttion: 设置入口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:08:21
 */
import React, { Fragment, useState, useEffect } from 'react';
import { Layout } from 'antd';
import SetAside from "./SetAside";
import "./Setting.scss"
import { renderRoutes } from "react-router-config";
import { SystemNav } from "tiklab-privilege-ui";
import { setDevRouter, setPrdRouter } from "./SetRouter";

const { Sider, Content } = Layout;

const Setting = (props) => {

    const route = props.route;
    const [router, setRouterMenu] = useState(setDevRouter)
    useEffect(() => {
        if (env === "local") {
            setRouterMenu(setDevRouter)
        }
        if (env !== "local") {
            setRouterMenu(setPrdRouter)
        }
        return
    }, [])


    return (
        <Fragment>
            <SystemNav
                {...props}
                applicationRouters={router}
                outerPath={"/setting"}
                noAccessPath={"/noaccess"} //没有资源访问权限页面的路由参数
            >
                <Layout className="orga">
                    <Sider width={200} className="site-layout-background">
                        <SetAside></SetAside>
                    </Sider>

                    <Content
                        className="orga-background"
                    >
                        {renderRoutes(route.routes)}
                    </Content>
                </Layout>
            </SystemNav>

        </Fragment>

    )
}

export default Setting;
