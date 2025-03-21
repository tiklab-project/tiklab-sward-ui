/*
 * @Author: 袁婕轩
 * @Date: 2023-04-11 20:49:42
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:39:45
 * @Description: 页面找不到
 */
import React from "react";
import {NotFound} from "tiklab-eam-ui";


const NotFoundContent = props =>{
    return <NotFound
              {...props}
              homePath={""} // 返回首页路由，如果首页路由重定向为 '/', 可不用传入
           />
}

export default NotFoundContent
