/*
 * @Author: 袁婕轩
 * @Date: 2023-12-27 20:50:07
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:43:10
 * @Description: 消息通知方案
 */
import React from "react";
import {MessageNotice} from 'tiklab-message-ui';


const SystemMessageNotice = (props) => {
    return (
        <MessageNotice {...props} bgroup={'sward'} isBase={false}/>
    )
}
export default SystemMessageNotice;