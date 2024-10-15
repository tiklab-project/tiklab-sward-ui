import React from "react";
import {MessageNotice} from 'tiklab-message-ui';

const SystemMessageNotice = (props) => {
    return (
        <MessageNotice {...props} bgroup={'sward'} isBase={false}/>
    )
}
export default SystemMessageNotice;