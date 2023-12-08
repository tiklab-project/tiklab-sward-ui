import React from "react";
import {MessageNotice} from 'tiklab-message-ui';

const ProjectMessageNotice = (props) => {
    return (
        <MessageNotice {...props} bgroup={'sward'} isBase={false}/>
    )
}
export default ProjectMessageNotice;