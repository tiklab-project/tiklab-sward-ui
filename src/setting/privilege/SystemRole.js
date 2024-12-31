/*
 * @Author: 袁婕轩
 * @Date: 2023-01-03 13:46:33
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:11:13
 * @Description: 
 */
import React from "react";
import { SystemRole } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";
// 系统角色
const SystemRoleWrap = props => {


    return (
            <SystemRole
                {...props}
                bgroup={'sward'}
            />
    )
}

export default inject("systemRoleStore")(observer(SystemRoleWrap));