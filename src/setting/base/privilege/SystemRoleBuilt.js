/*
 * @Author: 袁婕轩
 * @Date: 2023-01-03 13:46:33
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:11:30
 * @Description:
 */
import React from "react";
import { SystemRole } from 'tiklab-privilege-ui';

// 系统功能管理
const SystemRoleBuilt = props => {


    return (
        <SystemRole
            bgroup={'sward'}
            isBase = {true}
            {...props}
        />
    )
}

export default SystemRoleBuilt;
