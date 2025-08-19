/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/8/14
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/8/14
 */
import React, {useEffect, useState} from "react";
import Modal from "../../../common/components/modal/Modal";
import {Form, Input, message, Select, Upload} from "antd";
import templateStore from "../store/TemplateStore";

export const templateType = [
    'meeting',
    'week',
    'design',
    'technology',
    'test',
    'project',
];

export const templateTypeName = {
    meeting: '会议记录',
    week: '周报日志',
    design: '产品设计',
    technology: '技术研发',
    test: '测试',
    project: '项目管理',
}

const TemplateModal = (props) => {

    const {visible,setVisible,formValue,setFormValue,findDocumentTemplate} = props;

    const {createDocumentTemplate,updateDocumentTemplate} = templateStore;

    const [form] = Form.useForm();

    //本地上传二进制包
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if(visible){
            if(formValue){
                //缩略图
                const list = formValue?.iconUrl ? [
                    {uid: "-1", status: 'done', name: '', thumbUrl: formValue.iconUrl}
                ] : []
                form.setFieldsValue({...formValue, iconUrl: list})
                setFileList(list)
            }
        }
    }, [visible]);

    /**
     * 确定
     */
    const onOk = () =>{
        form.validateFields().then(value=>{
            const iconUrl = fileList?.[0]?.thumbUrl || null;
            if(formValue){
                updateDocumentTemplate({
                    ...value,
                    iconUrl:iconUrl,
                    id: formValue.id
                }).then(res=>{
                    if(res.code===0){
                        findDocumentTemplate();
                        message.success('修改成功');
                        onCancel()
                    }
                })
            } else {
                createDocumentTemplate({
                    ...value,
                    iconUrl:iconUrl
                }).then(res=>{
                    if(res.code===0){
                        message.success('添加成功')
                        props.history.push(`/setting/templateAdd/${res.data}`)
                    }
                })
            }
        })
    }

    /**
     * 关闭弹出框
     */
    const onCancel = () => {
        form.resetFields();
        setVisible(false);
        setFormValue(null);
        setFileList([])
    }

    return (
        <Modal
            visible={visible}
            title={'添加模版'}
            onCancel={onCancel}
            onOk={onOk}
        >
            <Form
                form={form}
                layout={'vertical'}
                initialValues={{type:'meeting'}}
            >
                <Form.Item
                    label={'类型'}
                    name={'type'}
                >
                    <Select>
                        {
                            templateType.map(type=>(
                                <Select.Option value={type} key={type}>
                                    {templateTypeName[type]}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label={'名称'}
                    name={'name'}
                    rules={[
                        {required: true, message: `名称不能为空` },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={"缩略图"}
                    name="iconUrl"
                    valuePropName="fileList"
                    getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
                    rules={[
                        { required: false, message: `请上传缩略图` },
                    ]}
                >
                    <Upload
                        name="uploadFile"
                        listType="picture-card"
                        maxCount={1}
                        fileList={fileList}
                        onChange={({ fileList }) => {
                            setFileList(fileList);
                        }}
                        beforeUpload={file=>{
                            return false;
                        }}
                    >
                        {
                            fileList.length < 1 && '上传'
                        }
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default TemplateModal;
