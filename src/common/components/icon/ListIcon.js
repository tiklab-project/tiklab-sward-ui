/**
 * @Description: 图标
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/11
 */
import React from "react";
import "./ListIcon.scss";

const ListIcon = ({text,icon='repository1.png',isMar=true}) => {

    /**
     * 获取首字母
     * @returns {string|string|string}
     */
    const getFirstChar = () => {
        if (!text || typeof text !== "string") return "S";
        let trimmed = text.trim();
        let firstChar = trimmed[0] || "S";
        return /[a-z]/.test(firstChar) ? firstChar.toUpperCase() : firstChar;
    }

    const colors = {
        'repository1.png' : 1,
        'repository2.png' : 2,
        'repository3.png' : 3,
        'repository4.png' : 4,
    }

    const color = colors[icon];

    //背景类样式;
    const bgClass = color ? `sward-icon-${color}` : "sward-icon-1";
    //边距类样式;
    const marClass = isMar ? `sward-listname-icon-mar` : "";

    return (
        <span className={`sward-listname-icon ${bgClass} ${marClass}`}>
            {getFirstChar()}
        </span>
    )
}

export default ListIcon
