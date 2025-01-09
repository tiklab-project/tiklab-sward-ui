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
    const { homeImage, firstText, secondText, firstUrl, children } = props;

    const goUrl = () => {
        if (firstUrl) {
            props.history.push(firstUrl)
        } else {
            props.history.goBack()
        }
    }
    return (
        <div className="page-head">
            <div className={`page-breadcrumb`}>
                {
                    secondText &&
                    <svg className= {`svg-icon page-back ${secondText ? "page-link" : ""}`} aria-hidden="true" onClick={() => goUrl()}>
                        <use xlinkHref="#icon-pageLeft"></use>
                    </svg>
                }
                <span>{firstText}</span>
                {
                    secondText && <>
                        {/* <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-rightBlue"></use>
                        </svg> */}
                        <> &nbsp; / &nbsp; <span>{secondText}</span>
                        </>
                    </>
                }


            </div>
            {children}
        </div>

    )
}
export default withRouter(Breadcrumb);
