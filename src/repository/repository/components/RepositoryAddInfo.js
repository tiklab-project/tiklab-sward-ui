/*
 * @Author: 袁婕轩
 * @Date: 2023-01-05 14:57:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:05:41
 * @Description: 知识库添加详情
 */
import React, { useEffect,forwardRef ,useImperativeHandle, useState} from "react";
import {Form, Input, message, Spin} from 'antd';
import "./repositoryAddInfo.scss";
import { observer } from "mobx-react";
import repositoryStore from "../store/RepositoryStore";

const RepositoryAddInfo =  forwardRef((props, ref)  => {

    const { repository,changFresh,onCancel } = props;

    const [form] = Form.useForm();
    const { addRepositorylist, updateRepository } = repositoryStore;

    //加载
    const [spinning,setSpinning] = useState(false);


    useEffect(() => {
        if(repository){
            form.setFieldsValue(repository);
        }
    }, [repository]);


    const icons = ['repository1.png','repository2.png','repository3.png','repository4.png'];

    const onFinish = () => {
        form.validateFields().then((values) => {
            if(spinning){
                return
            }
            setSpinning(true);
            if(repository){
                updateRepository({
                    ...values,
                    id: repository.id
                }).then(res=>{
                    if(res.code===0){
                        message.success('修改成功');
                        changFresh();
                        onCancel();
                    } else {
                        message.error(res.msg)
                    }
                }).finally(()=>setSpinning(false))
            } else {
                addRepositorylist({
                    ...values,
                    iconUrl: icons[Math.floor(Math.random() * icons.length)]
                }).then(res => {
                    if (res.code === 40000) {
                        message.error(res.msg);
                    }
                    if (res.code === 0) {
                        message.success('添加成功');
                        onCancel()
                        props.history.push(`/repository/${res.data}/overview`)
                    }
                }).finally(()=>setSpinning(false))
            }
        })
    }

    useImperativeHandle(ref, () => ({
        onFinish,
    }));

    const checkLimit = (_, value) => {
        if (value) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Price must be greater than zero!'));
    };

    const [limtValue, setLimitValue] = useState("0");
    const LimitComponents = ({ value = {}, onChange }) => {

        const changeLimit = (id) => {
            setLimitValue(id)
            onChange(id)
        }

        return (
            <div className="repository-limit" onChange={onChange} value={value}>
                <div key="0" className={`repository-limits ${limtValue === "0" ? "limit-select" : ""}`} onClick={() => changeLimit("0")}>
                    <div className="limits-title">
                        公共
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-publish"></use>
                        </svg>
                    </div>
                    <div className="limits-desc">
                        公共知识库，全部成员可见
                    </div>
                </div>
                <div key="1" className={`repository-limits ${limtValue === "1" ? "limit-select" : ""}`} onClick={() => changeLimit("1")}>
                    <div className="limits-title">
                        私密
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-private"></use>
                        </svg>
                    </div>
                    <div className="limits-desc">
                        私密知识库，只有知识库成员可见
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Spin spinning={spinning}>
            <div className="repository-addinfo">
                <Form
                    name="basic"
                    initialValues={{
                        remember: true,
                        limits: "0"
                    }}
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label="知识库名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '使用中英文、数字、空格组合',
                            },
                        ]}
                    >
                        <Input placeholder="使用中英文、数字、空格组合" />
                    </Form.Item>

                    <Form.Item
                        label="可见范围"
                        name="limits"
                        rules={[
                            {
                                validator: checkLimit,
                            }
                        ]}
                    >
                        <LimitComponents />
                    </Form.Item>
                    <Form.Item
                        label="知识库描述"
                        name="desc"
                        rules={[
                            {
                                required: false,
                                message: '请输入知识库描述',
                            },
                        ]}
                    >
                        <Input.TextArea rows={3} placeholder="知识库描述" />
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
})

export default observer(RepositoryAddInfo);
