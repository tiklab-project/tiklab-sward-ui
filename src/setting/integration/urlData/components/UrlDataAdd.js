import React, { Fragment,useEffect,useState } from "react";
import { Modal, Form,Input } from 'antd';
import { observer, inject } from "mobx-react";
import BaseModal from "../../../../common/components/modal/Modal";

const UrlDataAdd = (props) => {
    const [form] = Form.useForm();
    const {urlAddvisible, setUrlAddvisible, urlDataStore, modalTitle, setUrlDataList, actionType, urlId} = props;
    const { createSystemUrl, findAllSystemUrl, findSystemUrl, updateSystemUrl } = urlDataStore;

    useEffect(() => {
        if(actionType === "edit"){
            const params = new FormData();
            params.append("id", urlId);
            findSystemUrl(params).then(res => {
                if(res.code === 0){
                    console.log(res.data)
                    const data = res.data;
                    form.setFieldsValue({
                        name: data.name,
                        systemUrl: data.systemUrl,
                        webUrl: data.webUrl
                    })
                }
            })
        }
    }, [urlId])

    const onFinish = () => {
        form.validateFields().then((values) => {
            if(actionType ==="add"){
                createSystemUrl(values).then(res => {
                    if(res.code === 0){
                        findAllSystemUrl().then(data => {
                            if(data.code === 0){
                                setUrlDataList(data.data)
                            }
                        })
                    }
                })

            }
            if(actionType ==="edit"){
                values.id = urlId;
                updateSystemUrl(values).then(res => {
                    if(res.code === 0){
                        findAllSystemUrl().then(data => {
                            if(data.code === 0){
                                setUrlDataList(data.data)
                            }
                        })
                    }
                })

            }
            setUrlAddvisible(false);
        })

    };

    /**
     * 关闭弹出框
     */
    const onCancel = () => {
        form.resetFields();
        setUrlAddvisible(false);
    };

    return (
        <BaseModal
            title={modalTitle}
            visible={urlAddvisible}
            onCancel={onCancel}
            onOk={onFinish}
        >
            <Form name="basic" form={form} layout={'vertical'}>
                <Form.Item
                    label={"系统名称"}
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: '请输入系统名称',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={"系统地址"}
                    name="systemUrl"
                    rules={[
                        {
                            required: true,
                            message: '请输入系统地址',
                        },
                        {
                            pattern: new RegExp(/^(https:\/\/|http:\/\/)/, "g") ,
                            message: '请输入正确网址'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={"浏览器端地址"}
                    name="webUrl"
                    rules={[
                        {
                            pattern: new RegExp(/^(https:\/\/|http:\/\/)/, "g") ,
                            message: '请输入正确网址'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </BaseModal>
    );
};

export default inject("urlDataStore")(observer(UrlDataAdd));
