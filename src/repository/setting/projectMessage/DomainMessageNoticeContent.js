/*
 * @Author: 袁婕轩
 * @Date: 2023-12-27 20:49:20
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:36:27
 * @Description: 项目消息通知方案
 */
import React from "react";
import {DomainMessageNotice} from "tiklab-message-ui";


const DomainMessageNoticeContent = props =>{
    const repositoryId = props.match.params.repositoryId;
    return (
        <DomainMessageNotice
            {...props}
            domainId={repositoryId}  // 项目id
            bgroup={"sward"} // 产品code
        />
    )

}

export default DomainMessageNoticeContent
