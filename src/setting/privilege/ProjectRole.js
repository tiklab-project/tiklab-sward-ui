/*
 * @Author: 袁婕轩
 * @Date: 2023-01-03 13:46:33
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:45:41
 * @Description: 项目权限
 */
import React, { Fragment, useEffect,useState } from "react";
import { ProjectRole } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";

// 项目角色
const ProjectRoleList = props => {
    

    return (
            <ProjectRole
                bgroup={'teamwire'}
                isBase = {true}
                {...props}
            />
    )
}

export default inject("privilegeDomainRoleStore")(observer(ProjectRoleList));