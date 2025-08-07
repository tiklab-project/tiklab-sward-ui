/*
 * @Descripttion: 分享链接弹窗组件
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-13 13:29:10
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:36:16
 */
import React, { useState, useEffect } from "react";
import {Input, Form, Select} from 'antd';
import "./ShareModal.scss";
import {getUser} from "tiklab-core-ui"
import BaseModal from "../../../../common/components/modal/Modal";
import Button from "../../../../common/components/button/Button";
import CommentStore from "../../document/store/CommentStore";
import {BlockOutlined, TeamOutlined} from "@ant-design/icons";
import repositoryStore from "../../../repository/store/RepositoryStore";

const ShareModal = (props) => {

    const { shareVisible, setShareVisible, docInfo } = props;

    const { createShare } = CommentStore;
    const { findUserPage } = repositoryStore;

    //用户
    const user = getUser();
    const origin = location.origin;
    const [form] = Form.useForm();

    //链接
    const [shareUrl, setShareUrl] = useState(null);
    //分享类型
    const [shareType,setShareType] = useState('out');
    //成员
    const [userList,setUserList] = useState([]);
    //成员当前页
    const [userCurrentPage,setUserCurrentPage] = useState(1)
    //成员分页
    const [userPage,setUserPage] = useState({});

    useEffect(()=>{
        findUserPage({
            pageParam:{
                pageSize: 10,
                currentPage: userCurrentPage,
            },
        }).then(res=>{
            if(res.code===0){
                setUserPage({
                    totalRecord: res.data.totalRecord,
                    totalPage: res.data.totalPage,
                })
                if(userCurrentPage===1){
                    setUserList(res.data.dataList)
                } else {
                    setUserList([...userList,...res.data.dataList])
                }
            }
        })
    },[userCurrentPage])


    /**
     * 下拉滚动加载用户
     * @param e
     */
    const scrollUserEnd = (e) => {
        e.persist();
        const { target } = e;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            if (userCurrentPage < userPage.totalPage) {
                setUserCurrentPage(userCurrentPage+1)
            }
        }
    }

    /**
     * changeShareType
     */
    const changeShareType = (type) => {
        if(shareUrl) return;
        setShareType(type)
    }

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
     * 创建链接
     */
    const onOk = () => {
        form.validateFields().then(value=>{
            if(value.userIds){
                value.userIds = value.userIds.join(',')
            }
            createShare({
                wikiRepository: {id:docInfo.wikiRepository.id},
                user:{id:user.userId},
                shareIds:docInfo.id,
                name:docInfo.name,
                type: shareType==='out' ? 1 : 2,
                ...value
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
        })
    }

    /**
     * 关闭弹出框
     */
    const onCancel = () => {
        form.resetFields();
        setShareVisible(false);
        setShareUrl(null);
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
                            生成链接
                        </Button>
                    </div>

            }
        >
            <Form
                form={form}
                autoComplete="off"
                layout={"vertical"}
                initialValues={{authType:1,password:codeRandom}}
            >
                <Form.Item label='分享类型'>
                    <div className='share-type'>
                        <div
                            className={`share-type-item ${shareType==='out'?'share-type-item-select':''}`}
                            onClick={()=>changeShareType('out')}
                        >
                            <div className='share-type-item-icon'>
                                <BlockOutlined />
                            </div>
                            <div>
                                <div>外部分享</div>
                                <div className='share-type-item-desc'>
                                    任何人可通过分享链接访问当前文档
                                </div>
                            </div>
                        </div>
                        <div
                            className={`share-type-item ${shareType==='in'?'share-type-item-select':''}`}
                            onClick={()=>changeShareType('in')}
                        >
                            <div className='share-type-item-icon'>
                                <TeamOutlined />
                            </div>
                            <div>
                                <div>知识库内分享</div>
                                <div className='share-type-item-desc'>
                                    只有被邀请的用户才能访问分享链接
                                </div>
                            </div>
                        </div>
                    </div>
                </Form.Item>
                {
                    shareType==='in' ?
                    <Form.Item label={'访问人'} name={'userIds'} rules={[{required:true,message:"请输入密码"}]}>
                        <Select
                            placeholder={"访问人"}
                            mode={'multiple'}
                            disabled={shareUrl}
                            onPopupScroll={scrollUserEnd}
                        >
                            {
                                userList && userList.map(user=> {
                                    return <Select.Option value={user?.id} key={user?.id}>
                                        {user?.nickname}
                                    </Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    :
                    <>
                        <Form.Item label='访问密码' name={'authType'}>
                            <Select disabled={shareUrl}>
                                <Select.Option value={1}>无密码</Select.Option>
                                <Select.Option value={2}>密码访问</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item shouldUpdate={(prevValues, currentValues) =>
                            prevValues.authType !== currentValues.authType}
                            noStyle
                        >
                            {({getFieldValue}) =>
                                getFieldValue("authType")===2 ?
                                    <Form.Item
                                        label="密码"
                                        name="password"
                                        rules={[{required:true,message:"请输入密码"}]}
                                    ><Input.Password placeholder={'密码'} disabled={shareUrl}/>
                                    </Form.Item>
                                    :
                                    null
                            }
                        </Form.Item>
                    </>
                }
            </Form>
            {/*<div>*/}
            {/*    <div className='share-info-item'>*/}
            {/*        <div className='share-info-item-label'>*/}
            {/*            名称*/}
            {/*        </div>*/}
            {/*        <div className='share-info-item-value'>*/}
            {/*            {docInfo?.name}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className='share-info-item'>*/}
            {/*        <div className='share-info-item-label'>*/}
            {/*            类型*/}
            {/*        </div>*/}
            {/*        <div className='share-info-item-value'>*/}
            {/*            {*/}
            {/*                docInfo?.type === "document" ? '文档' : '目录'*/}
            {/*            }*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className='share-info-item'>*/}
            {/*        <div className='share-info-item-label'>*/}
            {/*            访问权限*/}
            {/*        </div>*/}
            {/*        <div className='share-info-item-value'>*/}
            {/*            <div className='access-type'>*/}
            {/*                <div*/}
            {/*                    className={`access-type-item ${value==='publish' ? 'access-type-select' : ''}`}*/}
            {/*                    onClick={()=>changeAccessType('publish')}*/}
            {/*                >*/}
            {/*                    <GlobalOutlined className='access-type-icon'/> 公开访问*/}
            {/*                </div>*/}
            {/*                <div*/}
            {/*                    className={`access-type-item ${value==='private' ? 'access-type-select' : ''}`}*/}
            {/*                    onClick={()=>changeAccessType('private')}*/}
            {/*                >*/}
            {/*                    <LockOutlined className='access-type-icon'/> 私密访问*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*            {*/}
            {/*                value==='private' &&*/}
            {/*                <Input.Password*/}
            {/*                    prefix={<LockOutlined />}*/}
            {/*                    value={authCode}*/}
            {/*                    onChange={e=>{*/}
            {/*                        if(shareUrl){*/}
            {/*                            return*/}
            {/*                        }*/}
            {/*                        setAuthCode(e.target.value)*/}
            {/*                    }}*/}
            {/*                    maxLength={6}*/}
            {/*                    minLength={4}*/}
            {/*                />*/}
            {/*            }*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </BaseModal>
    )
}
export default ShareModal;
