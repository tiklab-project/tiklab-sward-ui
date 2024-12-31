/*
 * @Author: 袁婕轩
 * @Date: 2024-09-25 16:45:30
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 16:56:45
 * @Description: 修改密码
 */
import React from 'react';
import {LoginRpw} from "tiklab-eam-ui";

const LoginRpwContent = props => {

    return (
        <LoginRpw
            {...props}
            loginGoRouter='/repository'
        />
    )
}

export default LoginRpwContent