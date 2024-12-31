/*
 * @Author: 袁婕轩
 * @Date: 2023-01-03 13:46:33
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:12:25
 * @Description: 
 */
import React from "react";
import {Task} from "tiklab-message-ui";

// 待办，不用
const TaskListContent = props =>{
    return <Task {...props} bgroup={"sward"}/>
}

export default TaskListContent;