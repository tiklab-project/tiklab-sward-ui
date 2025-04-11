/*
 * @Author: 袁婕轩
 * @Date: 2023-05-18 13:10:57
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 14:50:44
 * @Description: 用户icon
 */

import React from "react";
import "./UserIcon.scss"
const UserIcon = (props) => {
    const {name, size} = props;
    const showName = name? name.charAt(0) : "A";
    return (
        <div className={size === "big" ? "user-big-icon" : "user-icon"} >
            {showName}
        </div>
    )
    
}

export default UserIcon;