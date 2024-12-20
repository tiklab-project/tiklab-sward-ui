import React from "react";
import {NoAccess} from "tiklab-privilege-ui";

/**
 * 没有资源访问权限
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectNoAccessPage = props =>{
    const repository = JSON.parse(localStorage.getItem('repository'));
    const repositoryId = repository?.id;
    return (
        <NoAccess
            {...props}
            homePath={repositoryId ? `/repository/${repositoryId}/overview` : '/index'} //传返回的页面路由参数
        />
    )
}

export default ProjectNoAccessPage;