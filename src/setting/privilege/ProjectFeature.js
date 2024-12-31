/*
 * @Author: 袁婕轩
 * @Date: 2023-01-03 13:46:33
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:11:02
 * @Description: 知识库功能管理
 */
import React from "react";
import { ProjectFeature } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";

// 知识库功能管理
const ProjectFeatureList = props => {


    return (
        <ProjectFeature
            bgroup={'teamwire'}
            {...props}
        />
    )
}

export default inject("privilegeProjectFeatureStore")(observer(ProjectFeatureList));