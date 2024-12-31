/*
 * @Descripttion: 成员
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-04 10:16:25
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:10:35
 */
import React from "react";
import { User } from 'tiklab-user-ui';
const OrgaUser = props => {
    return (
        <User
            bgroup = "sward"
            {...props}
        />
    )
}

export default OrgaUser;