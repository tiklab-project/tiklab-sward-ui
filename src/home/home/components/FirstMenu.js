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
import Search from "../../search/components/Search";
import HomeStore from "../store/HomeStore";
import {inject, observer, Provider} from "mobx-react";
import {renderRoutes} from "react-router-config";
import MessageList from "./MessageList";
import {getUser, productImg, productTitle, productWhiteImg} from "tiklab-core-ui";
import Profile from "../../../common/components/profile/Profile";

const { Sider } = Layout;

const FirstMenu = (props) => {

    const {route,systemRoleStore,HelpLink,AppLink,AvatarLink,customLogo=null} = props;

    const store = {
        homeStore: HomeStore
    }

    const path = props.location.pathname;
    const nickname = getUser().nickname;

    const {getSystemPermissions} = systemRoleStore;

    //菜单折叠状态
    const [isShowText, setIsShowText] = useState(false);
    //主题
    const [theme,setTheme] = useState(() => {
        const themeType = localStorage.getItem('theme');
        return themeType  ? themeType : 'default'; // 默认 false
    });

    useEffect(() => {
        getSystemPermissions(getUser().userId);
    }, [])

    /**
     * 点击菜单跳转
     */
    const changeCurrentLink = item => {
        localStorage.removeItem("sprintId")
        props.history.push(item.to)
    }

    /**
     * 点击菜单跳转
     */
    const goHomePage = (router) => {
        props.history.push("/index")
    }

    const goSet = () => {
        props.history.push('/setting/home')
    }

    // 系统顶部菜单
    const routers = [
        {
            to: '/index',
            title: '首页',
            key: '/index',
            icon: 'home-' + theme,
        },
        {
            to: '/repository',
            title: '知识库',
            key: '/repository',
            icon: 'repository-' + theme,
        },
    ]

    /**
     * 切换主题
     */
    const changeTheme = (color) => {
        localStorage.setItem("theme", color);
        setTheme(color)
    }

    //设置图标
    const logoHtml = () => {
        const isDefaultTheme = theme === 'default';
        const image = isDefaultTheme ? productImg.sward : productWhiteImg.sward;
        return {
            image: customLogo?.image ? customLogo.image : image,
            name: customLogo?.name ? customLogo.name :  productTitle.sward
        };
    };

    //侧边导航
    const asideHtml = () =>{
        if(path.startsWith('/setting') || (path !=='/repository/' && path.startsWith('/repository/'))){
            return null
        }
        const logoData = logoHtml();
        return (
            <Sider
                className={`first-sider first-sider-${theme}`}
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
                        <div className="first-menu-link">
                            {
                                routers.map(item => {
                                    return isShowText ?
                                        <div key={item.key}
                                             onClick={() => changeCurrentLink(item)}
                                             className={`first-menu-text-item ${path.indexOf(item.key)===0 ? 'first-menu-link-active' : null}`}
                                        >
                                            <svg className="svg-icon" aria-hidden="true">
                                                <use xlinkHref={`#icon-${item.icon}`}></use>
                                            </svg>
                                            <span>{item.title}</span>
                                        </div>
                                        :
                                        <div key={item.key}
                                             onClick={() => changeCurrentLink(item)}
                                             className={`first-menu-link-item ${path.indexOf(item.key)===0 ? 'first-menu-link-active' : null}`}
                                        >
                                            <svg className="svg-icon" aria-hidden="true">
                                                <use xlinkHref={`#icon-${item.icon}`}></use>
                                            </svg>
                                            <span>{item.title}</span>
                                        </div>
                                })
                            }
                            <Search isShowText={isShowText} theme={theme} />
                            {
                                isShowText ?
                                    <div onClick={goSet} className={`first-menu-text-item`}>
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref={`#icon-set-${theme}`}></use>
                                        </svg>
                                        <span>设置</span>
                                    </div>
                                    :
                                    <div onClick={goSet} className={`first-menu-link-item`}>
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref={`#icon-set-${theme}`}></use>
                                        </svg>
                                        <span>设置</span>
                                    </div>

                            }
                        </div>
                    </div>
                    <div className={isShowText ? 'first-menu-bottom-text' : 'first-menu-bottom-icon'}>
                        <MessageList
                            isShowText={isShowText}
                            theme={theme}
                            history={props.history}
                        />
                        <HelpLink
                            bgroup={"sward"}
                            iconComponent={
                                isShowText ?
                                <div className="first-menu-text-item">
                                    <svg className="icon-18" aria-hidden="true">
                                        <use xlinkHref={`#icon-help-${theme}`} ></use>
                                    </svg>
                                    <div>帮助</div>
                                </div>
                                :
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
                                isShowText ?
                                <div className="first-menu-text-item">
                                    <svg className="icon-18" aria-hidden="true">
                                        <use xlinkHref={`#icon-application-${theme}`} ></use>
                                    </svg>
                                    <div>切换应用</div>
                                </div>
                                :
                                <div className="first-menu-link-item" data-title-right="应用导航">
                                    <svg className="icon-18" aria-hidden="true">
                                        <use xlinkHref={`#icon-application-${theme}`} ></use>
                                    </svg>
                                </div>
                            }
                        />
                        <AvatarLink
                            {...props}
                            changeTheme={changeTheme}
                            iconComponent={
                                isShowText ?
                                <div className="first-menu-text-item">
                                    <Profile />
                                    <div>{nickname}</div>
                                </div>
                                :
                                <div className="first-menu-link-item" data-title-right={nickname}>
                                    <Profile />
                                </div>
                            }
                        />
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
