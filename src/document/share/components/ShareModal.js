/*
 * @Descripttion: 分享链接弹窗组件
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-13 13:29:10
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:36:16
 */
import React, { useState, useEffect, useRef } from "react";
import {Radio, Input} from 'antd';
import "./shareModal.scss";
import {getUser} from "tiklab-core-ui"
import BaseModal from "../../../common/components/modal/Modal";
import Button from "../../../common/components/button/Button";
import CommentStore from "../../document/store/CommentStore";
import {GlobalOutlined, LockOutlined} from "@ant-design/icons";

const ShareModal = (props) => {

    const { shareVisible, setShareVisible, docInfo } = props;

    const { createShare } = CommentStore;

    //用户
    const user = getUser();
    const origin = location.origin;

    //访问权限
    const [value, setValue] = React.useState("publish");
    //链接
    const [shareUrl, setShareUrl] = useState(null);
    //密码
    const [authCode,setAuthCode] = useState('');

    // 复制
    const copy = () => {
        const link = document.getElementById("link")
        if (document.body.createTextRange) {
            let range = document.body.createTextRange();
            range.moveToElementText(link);
            range.select();
        } else if (window.getSelection) {
            let selection = window.getSelection();
            let range = document.createRange();
            range.selectNodeContents(link);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        document.execCommand("Copy"); // 执行浏览器复制命令
    }

    const codeRandom = Math.floor(Math.random() * 9000) + 1000;

    /**
     * 访问权限
     */
    const changeAccessType = (accessType) => {
        if(shareUrl){
            return;
        }
        setValue(accessType)
        if(accessType==='private'){
            setAuthCode(codeRandom)
        }
    }

    /**
     * 创建链接
     */
    const onOk = () => {
        createShare({
            nodeIds: [docInfo.id],
            limits: value,
            wikiRepository: {id:docInfo.wikiRepository.id},
            user:{id:user.userId},
            name:docInfo.name,
            type:docInfo.type,
            ...(value==='private'?{authCode:authCode}:{})
        }).then(data=> {
            if(data.code === 0) {
                if(version !== "cloud"){
                    setShareUrl(`${origin}/#/share/${data.data.id}`)
                }
                if(version === "cloud"){
                    setShareUrl(`${origin}/#/share/${data.data.id}?tenant=${user.tenant}`)
                }
            }
        })
    }

    /**
     * 关闭弹出框
     */
    const onCancel = () => {
        setShareVisible(false);
        setShareUrl(null);
        setAuthCode(null);
    }

    return (
        <BaseModal
            title="分享"
            className={'share-modal'}
            visible={shareVisible}
            onCancel={onCancel}
            footer={
                shareUrl ?
                    <div className='share-info-item'>
                        <div className='share-info-item-label'>
                            分享链接
                        </div>
                        <div className='share-info-item-value share-url' id="link">
                            {shareUrl}
                        </div>
                        <Button onClick={copy} type={"primary"}>复制</Button>
                    </div>
                    :
                    <div className='share-create-button'>
                        <Button onClick={onCancel} className="cancel-text-button">
                            取消
                        </Button>
                        <Button onClick={onOk} type={"primary"}>
                            创建链接
                        </Button>
                    </div>

            }
        >
            <div>
                <div className='share-info-item'>
                    <div className='share-info-item-label'>
                        名称
                    </div>
                    <div className='share-info-item-value'>
                        {docInfo?.name}
                    </div>
                </div>
                <div className='share-info-item'>
                    <div className='share-info-item-label'>
                        类型
                    </div>
                    <div className='share-info-item-value'>
                        {
                            docInfo?.type === "document" ? '文档' : '目录'
                        }
                    </div>
                </div>
                <div className='share-info-item'>
                    <div className='share-info-item-label'>
                        访问权限
                    </div>
                    <div className='share-info-item-value'>
                        <div className='access-type'>
                            <div
                                className={`access-type-item ${value==='publish' ? 'access-type-select' : ''}`}
                                onClick={()=>changeAccessType('publish')}
                            >
                                <GlobalOutlined className='access-type-icon'/> 公开访问
                            </div>
                            <div
                                className={`access-type-item ${value==='private' ? 'access-type-select' : ''}`}
                                onClick={()=>changeAccessType('private')}
                            >
                                <LockOutlined className='access-type-icon'/> 私密访问
                            </div>
                        </div>
                        {
                            value==='private' &&
                            <Input.Password
                                prefix={<LockOutlined />}
                                value={authCode}
                                onChange={e=>{
                                    if(shareUrl){
                                        return
                                    }
                                    setAuthCode(e.target.value)
                                }}
                                maxLength={6}
                                minLength={4}
                            />
                        }
                    </div>
                </div>
            </div>
        </BaseModal>
    )
}
export default ShareModal;
