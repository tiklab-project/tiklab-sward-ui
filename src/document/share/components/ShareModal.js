/*
 * @Descripttion: 分享链接弹窗组件
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-13 13:29:10
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:36:16
 */
import React, { useState, useEffect, useRef } from "react";
import { Modal, Radio , Button } from 'antd';
import "./shareModal.scss";
import {getUser} from "tiklab-core-ui"
const ShareModal = (props) => {
    const origin = location.origin;
    const { shareVisible, setShareVisible,createShare,updateShare, nodeIds, type } = props;

    const [value, setValue] = React.useState("publish");
    const [shareLink,setShareLink] = useState()
    const [shareUrl, setShareUrl] = useState()
    const [authCode,setAuthCode] = useState()
    const link = useRef(null)
    const user = getUser()
    const onChange = e => {
        setValue(e.target.value);
        // 更新分享文档信息
        updateShare({id: shareLink,limits: e.target.value}).then(data=> {
            console.log(data)
            if(data.code === 0) {
                if(e.target.value === true){
                    setAuthCode(data.data.authCode)
                }else {
                    setAuthCode(null)
                }
                setAuthCode(data.data.authCode)
                setShareLink(data.data.id)
                if(version !== "cloud"){
                    setShareUrl(`${origin}/#/share/${data.data.id}`)
                }
                if(version === "cloud"){
                    setShareUrl(`${origin}/#/share/${data.data.id}?tenant=${user.tenant}`)
                }

            }
        })
    };

    // 创建分享
    useEffect(()=> {
        if(shareVisible === true) {
            console.log(nodeIds)
            createShare({nodeIds: nodeIds,limits: value, type: type}).then(data=> {
                console.log(data)
                if(data.code === 0) {
                    setShareLink(data.data.id)
                    setAuthCode(data.data.authCode)
                    if(version !== "cloud"){
                        setShareUrl(`${origin}/#/share/${data.data.id}`)
                    }
                    if(version === "cloud"){
                        setShareUrl(`${origin}/#/share/${data.data.id}?tenant=${user.tenant}`)
                    }
                }
            })
        }
        return;
    },[shareVisible,nodeIds])


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


    return (
        <Modal
            title="分享"
            visible={shareVisible}
            onOk={() => setShareVisible(false)}
            onCancel={() => setShareVisible(false)}
            destroyOnClose={true}
            cancelText = "取消"
            okText = "确认"
        >
            <Radio.Group onChange={onChange} value={value}>
                <Radio value="publish">公开链接</Radio>
                <Radio value= "private">私密链接</Radio>
            </Radio.Group>
            {
                value === "public" ?
                    <div className="share-link link-box" ref={link} id="link">
                        <div className="share-text">链接地址:</div><div className="share-content">{shareUrl}</div>
                    </div> :
                    <div ref={link}  className = "link-box">
                        <div className="share-link" >
                            <div className="share-text">链接地址：</div>
                            <div className="share-content" id="link">{shareUrl}</div>
                        </div>
                        {
                            authCode && <div className="share-link"><div className="share-text">密码：</div><div className="share-content">{authCode}</div></div>
                        }
                    </div>
            }
            <div style={{textAlign: "right"}}>
                <Button onClick={()=>copy()} >复制</Button>
            </div>

        </Modal>
    )
}
export default ShareModal;
