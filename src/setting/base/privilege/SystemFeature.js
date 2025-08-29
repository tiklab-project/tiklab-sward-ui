import React from "react";
import { SystemFeature } from 'tiklab-privilege-ui';

// 系统功能管理
const SystemFeatureList = props => {

    return (
        <SystemFeature
            bgroup={'sward'}
            {...props}
        />
    )
}

export default SystemFeatureList;
