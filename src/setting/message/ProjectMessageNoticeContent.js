import React from "react";
import {ProjectMessageNotice} from "tiklab-message-ui";

/**
 * 知识库的消息通知方案
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectMessageNoticeContent = props =>{

    return (
        <ProjectMessageNotice
            {...props}
            isBase={true}
            bgroup={"sward"} // 产品code
        />
    )

}

export default ProjectMessageNoticeContent
