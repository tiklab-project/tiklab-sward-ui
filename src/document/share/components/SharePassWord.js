/*
 * @Descripttion: 分享文档的密码校验
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-14 14:27:39
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:24:12
 */
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import {Input, Button, message} from 'antd';
import "./SharePassWord.scss"
import { withRouter } from "react-router";
import ShareStore from "../store/ShareStore";
import {productImg} from "tiklab-core-ui";

const SharePassWord = (props) => {

    const { verifyAuthCode, setTenant } = ShareStore;
    const tenant = props.location.search.split("=")[1];
    const [value,setValue] = useState();

    useEffect(()=> {
        setTenant(tenant)
    }, [])

    const change = (e) => {
        setValue(e.target.value)
    }

    /**
     * 校验密码
     */
    const jump = ()=> {
        verifyAuthCode({
            shareLink:`${props.match.params.shareId}`,
            authCode: value.trim()
        }).then((data)=> {
            if(data.code===0){
                if(version !== "cloud"){
                    props.history.push({pathname: `/share/${props.match.params.shareId}`, state: {password: data.data}})
                }
                if(version === "cloud"){
                    props.history.push({pathname: `/share/${props.match.params.shareId}`,search: `?tenant=${tenant}`, state: {password: data.data}})
                }
            } else {
                message.error(data.msg)
            }
        })
    }

    return (
        <div className="documment-password">
            <div className="password-log">
                <img src={productImg.sward} alt="" />
                <span>sward</span>
            </div>
            <div className="password-box">
                <div className="box-title">
                    <svg className="icon-svg" aria-hidden="true">
                        <use xlinkHref="#icon-user5"></use>
                    </svg>
                    <span>
                    admin
                </span>
                </div>
                <div className="box-content">
                    <div className="box-text">请填写提取码：</div>
                    <div className="box-input">
                        <Input onChange = {(e)=> change(e)}/>
                        <Button type="primary" onClick = {()=>jump()}>确定</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default withRouter(observer(withRouter(SharePassWord)));
