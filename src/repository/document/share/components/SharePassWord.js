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
import shareStore from "../store/ShareStore";
import {productImg,urlQuery} from "tiklab-core-ui";


const SharePassWord = (props) => {

    const { findShare, setTenant } = shareStore;

    const query = urlQuery(window.location.search || window.location.href);
    const tenant = query?.tenant;
    const shareId = props.match.params.shareId;

    //验证码
    const [value,setValue] = useState('');
    //分享
    const [shareData,setShareData] = useState(null);

    useEffect(()=> {
        setTenant(tenant);
        findShare(shareId).then(res=>{
            if(res.code===0){
                setShareData(res.data)
            }
        })
    }, [])

    /**
     * 校验密码
     */
    const jump = ()=> {
        const authCode = value.trim();
        if(authCode===shareData?.password){
            if(version==="cloud"){
                props.history.push(`/share/${props.match.params.shareId}?tenant=${tenant}`)
            } else {
                props.history.push(`/share/${props.match.params.shareId}`)
            }
            sessionStorage.setItem('password','true')
        } else {
            message.error('密码错误！')
        }
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
                        {shareData?.user?.nickname || 'admin'}
                    </span>
                </div>
                <div className="box-content">
                    <div className="box-text">请填写提取码：</div>
                    <div className="box-input">
                        <Input
                            onChange = {(e)=>setValue(e.target.value)}
                            value={value}
                        />
                        <Button
                            type="primary"
                            onClick={jump}
                        >
                            确定
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default withRouter(observer(withRouter(SharePassWord)));
