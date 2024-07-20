/*
 * @Descripttion: 系统头部
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-08 10:44:07
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 10:16:03
 */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { getUser } from 'thoughtware-core-ui';
import { observer, inject } from "mobx-react";
import Search from "../../search/components/Search";
import MessageList from "./MessageList";
import {productImg,productWhiteImg} from "thoughtware-core-ui";
import "./Header.scss";
import ProjectFeature from '../../../setting/version/ProjectFeature';

const Header = props => {
    const { systemRoleStore, AppLink, AvatarLink, HelpLink } = props;

    // 登录者的信息
    const user = getUser();

    useEffect(() => {
        if (user && user.userId) {
            systemRoleStore.getSystemPermissions(user.userId, "sward")
        }
        return;
    }, [])

    return (
        <div className='frame-header'>
            <div className="frame-left">
            <div className="frame-applink">
                    <AppLink />
                </div>
                <div className='frame-menu-logo' onClick={() => props.history.push("/home")}>
                    <img src={productWhiteImg.sward} alt={'logo'} className="logo-img" />
                    <div className='logo-text'>sward</div>
                </div>
            </div>

            <div className='frame-header-search-wrap'>
                <Search />
            </div>
            <div className={'frame-header-right'}>
                <MessageList />
                <HelpLink />
                <ProjectFeature />
                <AvatarLink {...props} />
            </div>
        </div>
    )
}
export default withRouter(inject('homeStore', 'systemRoleStore')(observer(Header)));