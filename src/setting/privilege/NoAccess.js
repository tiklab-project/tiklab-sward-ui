import React from "react";
import {NoAccess} from "tiklab-privilege-ui";

/**
 * 没有资源访问权限
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const NoAccessPage = props =>{
    return (
        <NoAccess
            {...props}
            homePath={'/index'} //传返回的页面路由参数
        />
    )
}

export default NoAccessPage;
