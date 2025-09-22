/*
 * @Author: 袁婕轩
 * @Date: 2023-01-03 17:12:41
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 14:21:06
 * @Description: 自定义按钮
 */
import React from "react";
import "./Button.scss";

const Button = (props) => {

	const { buttonText, children, onClick, type, style, className } = props;

	return (
		<div onClick={onClick} style={style} className={`project-botton ${type === "primary" ? "project-primary" : "project-dashed"} ${className}`}>
			{children}
			{buttonText}
		</div>

	)
}
export default Button;
