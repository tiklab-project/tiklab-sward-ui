/**
 * @Description: 文档类型图标
 * @Author: gaomengyuan
 * @Date: 2025/4/8
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/4/8
 */
import React from "react";
import {getFileIcon} from "../../utils/overall";

const DocumentIcon = (props) => {

    const {type='document',documentType,documentName,className} = props;

    if(type==='category'){
        return (
            <svg className={className} aria-hidden="true">
                <use xlinkHref="#icon-folder"></use>
            </svg>
        )
    }
    if(documentType==='file'){
        return (
            <svg className={className} aria-hidden="true">
                <use xlinkHref={`#icon-${getFileIcon(documentName)}`}></use>
            </svg>
        )
    }
    if(documentType==='markdown'){
        return (
            <svg className={className} aria-hidden="true">
                <use xlinkHref="#icon-minmap"></use>
            </svg>
        )
    }
    return (
        <svg className={className} aria-hidden="true">
            <use xlinkHref="#icon-file"></use>
        </svg>
    )
}

export default DocumentIcon
