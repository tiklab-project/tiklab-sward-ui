import React from "react";
import {MessageNotice} from 'tiklab-message-ui';

const SystemMessageNotice = (props) => {
    return (
        <MessageNotice {...props} bgroup={'sward'} isBase={true}/>
    )
}
export default SystemMessageNotice;