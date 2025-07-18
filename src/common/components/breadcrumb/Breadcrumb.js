/*
 * @Author: 袁婕轩
 * @Date: 2023-01-03 15:13:08
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 14:20:45
 * @Description: 页面顶部面包屑
 */
import React from "react";
import { withRouter } from "react-router";

import "./Breadcrumb.scss"

const Breadcrumb = (props) => {

    const { firstText, secondText, firstUrl, children } = props;

    const goUrl = () => {
        if (secondText){
            if (firstUrl) {
                props.history.push(firstUrl)
            } else {
                props.history.goBack()
            }
        }
    }
    return (
        <div className="page-head">
            <div className={`page-breadcrumb`}>
                <span onClick={goUrl} className={`${secondText ? "page-link" : ""}`}>
                    {
                        secondText &&
                        <svg className= {`svg-icon page-back`} aria-hidden="true">
                            <use xlinkHref="#icon-pageLeft"></use>
                        </svg>
                    }
                    <span>{firstText}</span>
                </span>
                {
                    secondText &&
                    <> &nbsp; / &nbsp; <span>{secondText}</span></>
                }
            </div>
            {children}
        </div>

    )
}
export default withRouter(Breadcrumb);
