/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/8/5
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/8/5
 */
import React, { useEffect } from "react";
import { Form,Input } from 'antd';
import BaseModal from "../../../../common/components/modal/Modal";
import serverStore from "../store/ServerStore";

const ServerKanassModal = (props) => {

    const { visible, setVisible, kanassUrl, findKanassUrl} = props;

    const { createSystemUrl, updateSystemUrl } = serverStore;

    const [form] = Form.useForm();

    useEffect(() => {
        if(visible && kanassUrl){
            form.setFieldsValue(kanassUrl)
        }
    }, [visible])

    /**
     * 确定
     */
    const onFinish = () => {
        form.validateFields().then((values) => {
            if(kanassUrl){
                updateSystemUrl({
                    ...values,
                    name: 'Kanass',
                    id: kanassUrl.id,
                }).then(res => {
                    if(res.code === 0){
                        onCancel();
                        findKanassUrl();
                    }
                })
            } else {
                createSystemUrl({
                    ...values,
                    name: 'Kanass',
                }).then(res => {
                    if(res.code === 0){
                        onCancel();
                        findKanassUrl();
                    }
                })
            }
        })
    };

    /**
     * 关闭弹出框
     */
    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };

    return (
        <BaseModal
            title={kanassUrl ? '编辑' : '添加'}
            visible={visible}
            onCancel={onCancel}
            onOk={onFinish}
        >
            <Form name="basic" form={form} layout={'vertical'}>
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

export default ServerKanassModal;
