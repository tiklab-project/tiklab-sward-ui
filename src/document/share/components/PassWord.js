/*
 * @Descripttion: 分享文档的密码校验
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-14 14:27:39
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:24:12
 */
import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Input, Button } from 'antd';
import "./passWord.scss"
import { withRouter } from "react-router";
import { useHistory } from 'react-router-dom';
import ShareStore from "../store/ShareStore";
const PassWord = (props) => {
    const { verifyAuthCode, setTenant } = ShareStore;
    const tenant = props.location.search.split("=")[1];
    const [value,setValue] = useState();
    const history = useHistory();
    console.log(history)
    const change = (e) => {
        setValue(e.target.value)
    }

    /**
     * 校验密码
     */
    const jump = ()=> {
        verifyAuthCode({shareLink:`${props.match.params.shareId}`,authCode:value.trim()}).then((data)=> {
            if(data.data === "true"){
                if(version !== "cloud"){
                    props.history.push({pathname: `/share/${props.match.params.shareId}`, state: {password: data.data}})
                    
                }
                if(version === "cloud"){
                    props.history.push({pathname: `/share/${props.match.params.shareId}`,search: `?tenant=${tenant}`, state: {password: data.data}})
                }
            }
        })
    }

    // sass 版本获取租户
    useEffect(()=> {
        setTenant(tenant)
        return;
    }, [])
    return <div className="documment-password">
        <div className="password-log">
            <img src={('images/logo_k5.png')} alt="" />
            <span>知识库</span>
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
}
export default withRouter(observer(withRouter(PassWord)));