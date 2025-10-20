/**
 * @Description: 知识库删除
 * @Author: gaomengyuan
 * @Date: 2025/6/23
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/6/23
 */
import React, {useState} from "react";
import {Alert, Form, Input, message} from "antd";
import repositoryStore from "../store/RepositoryStore";
import Modal  from "../../../common/components/modal/Modal";

const RepositoryDelete = (props) => {

    const {delVisible,setDelVisible,repository,changFresh} = props;
    const { delerepositoryList } = repositoryStore;

    const [confirmForm] = Form.useForm();

    const [confirmProjectName, setConfirmProjectName] = useState();
    //加载
    const [spinning,setSpinning] = useState(false);

    /**
     * 确定
     */
    const handleOk = () => {
        confirmForm.validateFields().then(() => {
            if(spinning){
                return
            }
            setSpinning(true)
            delerepositoryList(repository.id).then(response => {
                if (response.code === 0) {
                    message.success('删除成功');
                    handleCancel();
                    if(typeof changFresh === 'function'){
                        changFresh('delete')
                    } else {
                        props.history.push("/repository")
                    }
                }
            }).finally(()=>setSpinning(false))
        })
    }

    /**
     * 关闭弹出框
     */
    const handleCancel = () => {
        if(!spinning){
            confirmForm.resetFields();
            setDelVisible(false);
        }
    }

    return (
        <Modal
            title="确定删除"
            visible={delVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Alert message=" 此知识库及其目录、文档、附件和评论将被永久删除" type="error" showIcon />
            <div style={{ paddingTop: 20 }}>
                <Form
                    form={confirmForm}
                    name="dependencies"
                    autoComplete="off"
                    style={{
                        maxWidth: 600,
                    }}
                    layout="vertical"
                >
                    <Form.Item
                        label="知识库名称"
                        name="confirmProjectName"
                        rules={[
                            {
                                required: true,
                                message: `请输入知识库名称`,
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    //getFieldValue可以获得其他输入框的内容
                                    if(value){
                                        if (repository?.name !== value) {
                                            return Promise.reject(`请输入正确的知识库名字`);
                                        }
                                    }
                                    return Promise.resolve();
                                }
                            })
                        ]}
                    >
                        <Input value={confirmProjectName} onChange={(value) => setConfirmProjectName(value.target.value)} />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    )
}

export default RepositoryDelete
