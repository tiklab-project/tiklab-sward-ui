/*
 * @Descripttion: 敏捷开发项目详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-16 10:58:01
 */
import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import MoreMenuModel from "./MoreMenuModal";
import "./RepositoryAside.scss";
import {renderRoutes} from "react-router-config";
import {MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined} from "@ant-design/icons";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";

const { Sider } = Layout;

const RepositoryAside = (props) => {

    const { route, ChangeModal, initRouters, setUrl, backUrl, backName, domainId } = props;

    const [projectRouter, setProjectRouter] = useState([]);

    const path = props.location.pathname;
    //更多路由
    const [moreMenu, setMoreMenu] = useState([]);
    //是否折叠
    const [isShowText,SetIsShowText] = useState(()=>{
        const expand = localStorage.getItem('menuExpand');
        return expand==='true'
    });
    //主题
    const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "default");
    //主题样式
    const [themeClass, setThemeClass] = useState("project-sider-gray")

    useEffect(() => {
        getThemeClass(theme)
    }, [])

    useEffect(() => {
        setProjectRouter(initRouters)
    }, [domainId]);

    /**
     * 点击左侧菜单
     */
    const selectMenu = (menu) => {
        props.history.push(menu.to)
    }

    /**
     * 点击折叠或展开菜单
     */
    const toggleCollapsed = () => {
        SetIsShowText(!isShowText)
        localStorage.setItem('menuExpand',String(!isShowText))
    }

    const backProject = () => {
        props.history.push(backUrl)
    }

    const getThemeClass = (theme) => {
        let name = ""
        switch (theme) {
            case "black":
                name = "project-sider-black";
                break;
            case "default":
                name = "project-sider-gray";
                break;
            case "blue":
                name = "project-sider-blue";
                break;
            default:
                name = "first-sider-gray";

        }
        setThemeClass(name)
        setTheme(theme)
        return name;
    }

    return (
        <Layout className="repositorydetail">
            <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth="75" width="200"
                className={`project-detail-side ${themeClass}`}
            >
                <div className={`project-aside ${isShowText ? "" : "project-icon"}`}>
                    <ChangeModal isShowText={isShowText} theme={theme} />
                    <div className="project-menu" >
                        <div className="project-back-project">
                            {
                                isShowText ?
                                    <div className={`project-menu-submenu`}
                                        onClick={() => backProject()}
                                    >
                                        <svg className="icon-18" aria-hidden="true">
                                            <use xlinkHref={`#icon-backhome-${theme}`}></use>
                                        </svg>
                                        <span>
                                            {backName}
                                        </span>
                                    </div>
                                    :
                                    <div className={`project-menu-submenu-icon`}
                                        onClick={() => backProject()}
                                        data-title-right={backName}
                                    >
                                        <svg className="icon-24" aria-hidden="true">
                                            <use xlinkHref={`#icon-backhome-${theme}`}></use>
                                        </svg>
                                    </div>
                            }
                        </div>
                        {
                            projectRouter && projectRouter.map((item, index) => {
                                return (
                                    <PrivilegeProjectButton code={item.purviewCode} domainId={domainId} key={item.id}>
                                        {
                                            isShowText ?
                                                <div className={`project-menu-submenu ${path.indexOf(item.id) === 0? "project-menu-select" : ""}`}
                                                     key={item.id}
                                                     onClick={() => selectMenu(item)}
                                                >
                                                    <svg className="icon-18" aria-hidden="true">
                                                        <use xlinkHref={`#icon-${item.icon}`}></use>
                                                    </svg>
                                                    <span>
                                                        {item.title}
                                                    </span>
                                                </div>
                                                :
                                                <div className={`project-menu-submenu-icon ${path.indexOf(item.id) === 0 ? "project-menu-select" : ""}`}
                                                     key={item.id}
                                                     onClick={() => selectMenu(item)}
                                                >
                                                    <svg className="svg-icon" aria-hidden="true">
                                                        <use xlinkHref={`#icon-${item.icon}`}></use>
                                                    </svg>
                                                    <span>
                                                        {item.title}
                                                    </span>
                                                </div>
                                        }
                                    </PrivilegeProjectButton>
                                )
                            })
                        }
                    </div>
                    <div className="project-setting" onClick={() =>props.history.push(setUrl)}>
                        {
                            isShowText ?
                                <div className="project-setting-title setting">
                                    <div className='project-aside-bottom-icon'>
                                        <SettingOutlined />
                                    </div>
                                    <div>
                                        设置
                                    </div>
                                </div>
                                :
                                <div className="project-setting-icon setting" data-title-right={"设置"}>
                                    <div className='project-aside-bottom-icon'>
                                        <SettingOutlined />
                                    </div>
                                </div>
                        }
                    </div>
                    <div className="project-setting project-menu-fold" onClick={toggleCollapsed}>
                        {
                            isShowText ?
                                <div className="project-setting-title setting">
                                    <div className='project-aside-bottom-icon'>
                                        <MenuFoldOutlined />
                                    </div>
                                    <div>
                                        折叠
                                    </div>
                                </div>
                                :
                                <div className="project-setting-icon setting" data-title-right={"展开"}>
                                    <div className='project-aside-bottom-icon'>
                                        <MenuUnfoldOutlined />
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </Sider>
            <Layout className="repositorydetail-content">
                {renderRoutes(route.routes)}
            </Layout>
        </Layout>
    )

}
export default withRouter(RepositoryAside);
