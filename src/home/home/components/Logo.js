/*
 * @Author: 袁婕轩
 * @Date: 2024-07-31 19:31:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:25:35
 * @Description: 系统图标
 */
import React from "react";
import { withRouter } from "react-router";
import { productImg, productWhiteImg } from "tiklab-core-ui";
import "./Logo.scss";

// 系统图标
const Logo = (props) => {
    const { isShowText, theme } = props;
    const goHomePage = (router) => {
        props.history.push("/index")
        sessionStorage.setItem("menuKey", "home")
    }
    return <>
        {
            isShowText ? <div className='sward-logo-text' onClick={() => goHomePage()}>
                <img src={ theme === "default" ? productImg.sward :  productWhiteImg.sward} alt={'logo'} className="logo-img" />
                <div className='logo-text' >sward</div>
            </div>
                :
                <div className='sward-logo' onClick={() => goHomePage()}>
                    <img src={theme === "default" ? productImg.sward :  productWhiteImg.sward} alt={'logo'} className="logo-img" />
                </div>
        }
    </>


}

export default withRouter(Logo);