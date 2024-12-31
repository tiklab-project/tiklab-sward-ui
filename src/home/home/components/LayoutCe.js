/*
 * @Author: 袁婕轩
 * @Date: 2024-08-26 20:24:47
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:53:50
 * @Description: 入口页面，ce、ee使用
 */

import React from "react";
import {UserVerify} from "tiklab-user-extension-ui";
import Layout from "./Layout";

const LayoutPro = props => {
    return (
        <Layout
            {...props}
        />
    )
}


export default UserVerify(LayoutPro,"/noAuth", "sward")