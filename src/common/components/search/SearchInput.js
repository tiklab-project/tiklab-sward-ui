/*
 * @Author: 袁婕轩
 * @Date: 2023-01-03 15:23:08
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 14:48:58
 * @Description: 自定义搜索框
 */

import React from "react";
import { Input } from "antd";
import "./Search.scss";

const SearchInput = (props) => {
    const {onChange, placeholder} = props;
    const handleChange = (value) => {
        onChange(value.target.value)
    }
    return (
        <div className="search-input">
            <svg className="svg-icon" aria-hidden="true">
                <use xlinkHref="#icon-search"></use>
            </svg>
            <Input bordered={false} allowClear key={"search"} placeholder = {placeholder} onChange={(value) => handleChange(value)} />
        </div>
    )
}
export default SearchInput;
