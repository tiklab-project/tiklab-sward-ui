/*
 * @Descripttion: 页面头部
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-08 10:44:07
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 10:16:03
 */
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Col, Row, Dropdown, Menu,  Space } from "antd";
import { withRouter } from 'react-router';

import { getVersionInfo, getUser } from 'tiklab-core-ui';
import Message from "./MessageList"
import { observer, inject } from "mobx-react";
import { AppLink } from 'tiklab-integration-ui';
import UserIcon from "../../../common/UserIcon/UserIcon"
import { useEffect } from 'react';


const Header = props => {
    const {
        logo,
        languageSelectData = [], // 切换语言包的数据
        routers,
        homeStore
    } = props;

    const menuKey = (sessionStorage.getItem("menuKey") && props.location.pathname !== "/index/home") ? sessionStorage.getItem("menuKey") : "home";

    useEffect(() => {
        
    }, [])

    const { currentLink, setCurrentLink } = homeStore;

    const { i18n } = useTranslation();

    const [lan, setLan] = useState(i18n.language);
    
    const onClickLan = ({ key }) => {
        i18n.changeLanguage(languageSelectData[key].value)
        setLan(languageSelectData[key].value)
    };

    const [showLanguage, setShowLanguage] = useState(false);

    const user = getUser();

    const changeCurrentLink = item => {
        localStorage.removeItem("sprintId")
        props.history.push(item.to)
        setCurrentLink(item.key)
        sessionStorage.setItem("menuKey", item.key)
    }

    const renderRouter = () => {
        if (routers) {
            return (
                <div className={'frame-header-link'}>
                    <div key='home' onClick={() => changeCurrentLink(routers[0])} className={`frame-header-link-item ${menuKey === "home" ? 'frame-header-link-active' : null}`}> {routers[0].title}</div>
                    <div key='repository' onClick={() => changeCurrentLink(routers[1])} className={`frame-header-link-item ${menuKey === "repository" ? 'frame-header-link-active' : null}`}> {routers[1].title}</div>
                </div>
            )
        }
    }


    const logOut = () => {
        props.history.push({
            pathname: '/logout',
            state: window.location.href
        })
    }

    const useMenu = (
        <div className="user-box">
            <div className='user-head'>
                个人资料
            </div>
            <div className='user-info'>
                <UserIcon />
                <div className='user-info-text'>
                    <div className='user-info-name'>{user.name}</div>
                    <div className='user-info-email'>{user.phone || "暂无"}</div>
                </div>
            </div>
            <div 
                className= "user-language" 
                onMouseEnter={() => setShowLanguage(true)}
                onMouseLeave={() => setShowLanguage(false)}
            >
                <div 
                    className="language-text"
                    
                >   
                <div className="language-left">
                    <svg aria-hidden="true" className="svg-icon" fill="#fff">
                        <use xlinkHref="#icon-yuyan"></use>
                    </svg>
                    语言切换  
                </div>
                    
                    <svg aria-hidden="true" className="svg-icon" fill="#fff">
                        <use xlinkHref="#icon-right">

                        </use>
                    </svg>
                </div>
                {
                    showLanguage && <div className= "language-box">
                        <div className="language-box-item language-box-select">
                            中文
                        </div>
                        <div className="language-box-item">
                            英文
                        </div>
                    </div>
                }
                
            </div>
            <div onClick={logOut} className='user-logout'>
                <svg aria-hidden="true" className="svg-icon">
                    <use xlinkHref="#icon-logout"></use>
                </svg>
                退出
            </div>
        </div>
    );


    const goSet = (url) => {
        props.history.push(url)
        setCurrentLink("set")
        sessionStorage.setItem("menuKey", "set")
    };


    const languageMenu = (
        <Menu>
            <Menu.Item key="0">
                中文
            </Menu.Item>
            <Menu.Item key="1" >
                英文
            </Menu.Item>
        </Menu>
    );

    const helpMenu = (
        <div className="help-box">
            <div className="help-head">
                帮助
            </div>
            <div className="help-item">
                <span className="help-item-left">
                    <svg aria-hidden="true" className="svg-icon">
                        <use xlinkHref="#icon-doc"></use>
                    </svg>
                    文档
                </span>

                <svg aria-hidden="true" className="svg-icon">
                    <use xlinkHref="#icon-jump"></use>
                </svg>
            </div>
            <div className="help-item">
                <span className="help-item-left">
                    <svg aria-hidden="true" className="svg-icon">
                        <use xlinkHref="#icon-cuservice"></use>
                    </svg>
                    社区支持
                </span>

                <svg aria-hidden="true" className="svg-icon">
                    <use xlinkHref="#icon-jump"></use>
                </svg>
            </div>
            <div className="help-item">
                <span className="help-item-left">
                    <svg aria-hidden="true" className="svg-icon">
                        <use xlinkHref="#icon-workorder"></use>
                    </svg>
                    在线工单
                </span>

                <svg aria-hidden="true" className="svg-icon">
                    <use xlinkHref="#icon-jump"></use>
                </svg>
            </div>
            <div className="help-item">
                <span className="help-item-left">
                    <svg aria-hidden="true" className="svg-icon">
                        <use xlinkHref="#icon-community"></use>
                    </svg>
                    在线客服
                </span>

                <svg aria-hidden="true" className="svg-icon">
                    <use xlinkHref="#icon-jump"></use>
                </svg>
            </div>
        </div>
    )

    return (
        <Row className="frame-header">
            <Col span={12}>
                <div className={'frame-header-left'}>
                    <AppLink isSSO={false} />
                    {logo && <div className={'frame-header-logo'}><img src={logo} alt={'logo'} /></div>}
                    {renderRouter()}
                </div>
            </Col>
            <Col span={12}>
                <div className={'frame-header-right'}>
                    <div className='frame-header-right-search-wrap'>
                        {props.search}
                    </div>
                    <div className={'frame-header-right-text'}>
                        <div className="frame-header-icon">
                            <div className="frame-header-set" data-title="系统设置" onClick={() => goSet("/index/setting/organ")}>
                                <Space>
                                    <svg aria-hidden="true" className="header-icon">
                                        <use xlinkHref="#icon-iconsetsys"></use>
                                    </svg>
                                </Space>
                            </div>
                        </div>
                        <Message />
                        <div className="frame-header-icon">
                            <div className="frame-header-help" data-title="帮助与支持">
                                <Dropdown overlay={helpMenu} trigger={"click"}>
                                    <Space>
                                        <svg aria-hidden="true" className="header-icon" style = {{stroke:'#fff'}} >
                                            <use xlinkHref="#icon-help"></use>
                                        </svg>
                                    </Space>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="frame-header-icon">
                            <div className="frame-header-name" data-title="个人资料与设置">
                                <Dropdown overlay={useMenu} trigger={"click"}>
                                    <Space>
                                        <UserIcon />
                                    </Space>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            
        </Row>
    )
}
export default withRouter(inject('homeStore')(observer(Header)));