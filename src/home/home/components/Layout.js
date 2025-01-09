/*
 * @Descripttion: 系统入口页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:53:37
 */
import React from 'react';
import {AppLink,HelpLink,AvatarLink} from "tiklab-licence-ui";
import {UserVerify} from 'tiklab-eam-ui';
import FirstMenu from "./FirstMenu";

const Layout = props =>{

    return (
        <FirstMenu
            {...props}
            AppLink={AppLink}
            HelpLink={HelpLink}
            AvatarLink={AvatarLink}
        >
        </FirstMenu>
    )
}


export default UserVerify(Layout,'/noAuth')


