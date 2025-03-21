/*
 * @Descripttion: 系统一级导航
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:46:17
 */
import React, { useEffect, useState } from "react";
import "./FirstMenu.scss";
import { Layout } from "antd";
import { withRouter } from "react-router";
import useLocalStorageListener from "../../../common/utils/useLocalStorageListener";
import Search from "../../search/components/Search";
import HomeStore from "../store/HomeStore";
import {inject, observer, Provider} from "mobx-react";
import {renderRoutes} from "react-router-config";
import SetingMenu from "./SetingMenu";
import MessageList from "./MessageList";
import UserIcon from "../../../common/UserIcon/UserIcon";
import {getUser, productImg, productWhiteImg} from "tiklab-core-ui";
const { Sider } = Layout;

const FirstMenu = (props) => {

    const {route,systemRoleStore,HelpLink,AppLink,AvatarLink,customLogo=null} = props;

    const store = {
        homeStore: HomeStore
    }

    const path = props.location.pathname;
    const nickname = getUser().nickname;

    const {getSystemPermissions} = systemRoleStore;

    const [isShowText, setIsShowText] = useState(false)

    const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "default");
    const [themeClass, setThemeClass] = useState("first-sider-gray")

    useEffect(() => {
        getSystemPermissions(getUser().userId);
        getThemeClass(theme)
        return null;
    }, [])

    /**
     * 点击菜单跳转
     * @param {菜单信息} item
     */
    const changeCurrentLink = item => {
        localStorage.removeItem("sprintId")
        props.history.push(item.to)
        sessionStorage.setItem("menuKey", item.key)
    }

    /**
     * 点击菜单跳转
     */
    const goHomePage = (router) => {
        props.history.push("/index")
        sessionStorage.setItem("menuKey", "home")
    }

    /**
     * 图标显示
     * @param {*} type
     * @returns
     */
    const setActiveIcon = (type) => {
        let activeIcon = type + theme + "-active"
        switch (theme) {
            case "default":
                activeIcon = type + theme + "-active";
                break;
            case "blue":
                activeIcon = type + theme;
                break;
            case "black":
                activeIcon = type + "blue";
                break;
            default:
                activeIcon = type + theme + "-active";
                break;
        }
        return activeIcon;
    }
    // 系统顶部菜单
    const routers = [
        {
            to: '/index',
            title: '首页',
            key: '/index',
            icon: 'home-' + theme,
            actionIcon: setActiveIcon("home-")
        },
        {
            to: '/repository',
            title: '知识库',
            key: '/repository',
            icon: 'repository-' + theme,
            actionIcon: setActiveIcon("repository-")
        }
    ]

    /**
     * 展开或者收起左侧导航
     */
    const toggleCollapsed = () => {
        setIsShowText(!isShowText)
    }

    /**
     * 切换系统主题色
     * @param {主题色} theme
     * @returns
     */
    const getThemeClass = (theme) => {
        let name = "default"
        switch (theme) {
            case "black":
                name = "first-sider-black";
                break;
            case "default":
                name = "first-sider-gray";
                break;
            case "blue":
                name = "first-sider-blue";
                break;
            default:
                name = "first-sider-gray";
                break;

        }
        setThemeClass(name)
        setTheme(theme)
        return name;
    }

    useLocalStorageListener("theme", (updatedTraceInfo) => {
        console.log("data最新值：", updatedTraceInfo)
        getThemeClass(updatedTraceInfo)
    })

    const changeTheme = (color) => {
        console.log(color)
        localStorage.setItem("theme", color)
    }

    //设置图标
    const logoHtml = () => {
        const isDefaultTheme = theme === 'default';
        const image = isDefaultTheme ? productImg.sward : productWhiteImg.sward;
        return {
            image: customLogo?.image ? customLogo.image : image,
            name: customLogo?.name ? customLogo.name :  theme.sward
        };
    };

    //侧边导航
    const asideHtml = () =>{
        if(path.startsWith('/setting')){
            return null
        }
        if(path !=='/repository/' && path.startsWith('/repository/')){
            return null
        }
        const logoData = logoHtml();
        return (
            <Sider
                className={`first-sider ${themeClass}`}
                trigger={null}
                collapsible
                collapsed={!isShowText}
                collapsedWidth="75"
                width="200"
            >
                <div className="first-menu">
                    <div className="first-menu-top">
                        {
                            isShowText ?
                                <div className='sward-logo-text' onClick={() => goHomePage()}>
                                    <img src={logoData.image} alt={'logo'} className="logo-img" />
                                    <div className='logo-text' >{logoData.name}</div>
                                </div>
                                :
                                <div className='sward-logo' onClick={() => goHomePage()}>
                                    <img src={logoData.image} alt={'logo'} className="logo-img" />
                                </div>
                        }
                        <div className={'first-menu-link'}>
                            {
                                routers.map(item => {
                                    return isShowText ?
                                        <div key={item.key}
                                             onClick={() => changeCurrentLink(item)}
                                             className={`first-menu-text-item ${path.indexOf(item.key)===0 ? 'first-menu-link-active' : null}`}
                                        >
                                            {
                                                path.indexOf(item.key)===0 ?
                                                    <svg className="svg-icon" aria-hidden="true">
                                                        <use xlinkHref={`#icon-${item.actionIcon}`}></use>
                                                    </svg>
                                                    :
                                                    <svg className="svg-icon" aria-hidden="true">
                                                        <use xlinkHref={`#icon-${item.icon}`}></use>
                                                    </svg>
                                            }
                                            <span>{item.title}</span>
                                        </div>
                                        :
                                        <div key={item.key}
                                             onClick={() => changeCurrentLink(item)}
                                             className={`first-menu-link-item ${path.indexOf(item.key)===0 ? 'first-menu-link-active' : null}`}
                                        >
                                            {
                                                path.indexOf(item.key)===0 ?
                                                    <svg className="svg-icon" aria-hidden="true">
                                                        <use xlinkHref={`#icon-${item.actionIcon}`}></use>
                                                    </svg>
                                                    :
                                                    <svg className="svg-icon" aria-hidden="true">
                                                        <use xlinkHref={`#icon-${item.icon}`}></use>
                                                    </svg>
                                            }
                                            <span>{item.title}</span>
                                        </div>
                                })
                            }
                            <Search isShowText={isShowText} theme={theme} />
                        </div>
                    </div>
                    {
                        isShowText ?
                            <div className="first-menu-bottom-text ">
                                <SetingMenu isShowText={isShowText} theme={theme} />
                                <MessageList isShowText={isShowText} theme={theme} />
                                <HelpLink
                                    bgroup={"sward"}
                                    iconComponent={
                                        <div className="first-menu-text-item">
                                            <svg className="icon-18" aria-hidden="true">
                                                <use xlinkHref={`#icon-help-${theme}`} ></use>
                                            </svg>
                                            <div>帮助</div>
                                        </div>

                                    }
                                />
                                <AppLink
                                    translateX={isShowText ? 200 : 75}
                                    iconComponent={
                                        <div className="first-menu-text-item">
                                            <svg className="icon-18" aria-hidden="true">
                                                <use xlinkHref={`#icon-application-${theme}`} ></use>
                                            </svg>
                                            <div>切换应用</div>
                                        </div>

                                    }
                                />
                                <AvatarLink
                                    changeTheme={changeTheme}
                                    iconComponent={
                                        <div className="first-menu-text-item">
                                            <UserIcon name={nickname} />
                                            <div>{nickname}</div>
                                        </div>
                                    }
                                    {...props}
                                />
                            </div>
                            :
                            <div className="first-menu-bottom-icon">
                                <SetingMenu isShowText={isShowText} theme={theme} />
                                <MessageList isShowText={isShowText} theme={theme} />
                                <HelpLink
                                    bgroup={"sward"}
                                    iconComponent={
                                        <div className="first-menu-link-item" data-title-right="帮助">
                                            <svg className="icon-18 " aria-hidden="true">
                                                <use xlinkHref={`#icon-help-${theme}`} ></use>
                                            </svg>
                                        </div>

                                    }
                                />
                                <AppLink
                                    translateX={isShowText ? 200 : 75}
                                    iconComponent={
                                        <div className="first-menu-link-item" data-title-right="应用导航">
                                            <svg className="icon-18" aria-hidden="true">
                                                <use xlinkHref={`#icon-application-${theme}`} ></use>
                                            </svg>
                                        </div>

                                    }
                                />
                                <AvatarLink
                                    changeTheme={changeTheme}
                                    iconComponent={
                                        <div className="first-menu-link-item" data-title-right={nickname}>
                                            <UserIcon name={nickname} />
                                        </div>
                                    }
                                    {...props}
                                />
                            </div>
                    }
                    <div className={"menu-box-right-border"}>
                        <div className={"menu-box-isexpanded"} onClick={toggleCollapsed}>
                            {
                                isShowText ? <svg className="first-menu-expend-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-leftcircle"></use>
                                    </svg>
                                    :
                                    <svg className="first-menu-expend-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-rightcircle"></use>
                                    </svg>
                            }
                        </div>
                    </div>

                </div>
            </Sider>
        )
    }

    return (
        <Provider {...store}>
            <div className="layout">
                {asideHtml()}
                <div className="layout-left">
                    {renderRoutes(route.routes)}
                </div>
            </div>
        </Provider>
    )
}
export default withRouter(inject("systemRoleStore")(observer(FirstMenu)));
