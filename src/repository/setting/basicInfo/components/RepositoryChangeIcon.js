// 修改知识库图标
import React, { useState, useEffect } from "react";
import { Modal, Form, Upload, message } from 'antd';
import { withRouter } from "react-router";
import { getUser } from "tiklab-core-ui";
import RepositoryIconStore from "../store/RepositoryStore";
import ImgComponent from "../../../../common/imgComponent/ImgComponent";
const RepositoryIcon = (props) => {

    const [form] = Form.useForm();

    const { visible, setVisible, updateRepository,findRepository } = props;

    const [repositoryIconUrl, setProjectIconUrl] = useState("")

    const { findIconList, creatIcon } = RepositoryIconStore;
    const repositoryId = props.match.params.repositoryId;
    const [iconList, setIconList] = useState();

    useEffect(() => {
        getIconList()
        return;
    }, [])

    const getIconList = () => {
        findIconList({ iconType: "repository" }).then((res) => {
            setIconList(res.data)
        })
    }

    const onFinish = () => {
        const data = { id: repositoryId, iconUrl: repositoryIconUrl }
        updateRepository(data).then(res => {
            setVisible(false)
            if(res.code===0){
                findRepository(repositoryId)
            }
        })
    };

    const ticket = getUser().ticket;
    const tenant = getUser().tenant;
    const upLoadIcon = {
        name: 'uploadFile',
        action: `${upload_url}/dfs/upload`,
        showUploadList: false,
        headers: {
            ticket: ticket,
            tenant: tenant
        },
        onChange(info) {
            if (info.file.status === 'done') {
                console.log(info.file, info.fileList);
                const res = info.file.response.data;
                const params = {
                    iconName: info.file.name,
                    iconUrl: "/image/" + res,
                    iconType: "repository"
                }
                creatIcon(params).then((res) => {
                    if (res.code === 0) {
                        getIconList()
                    }
                })
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        }
    };

    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };


    return (
        <>
            <Modal
                title="更改图标"
                visible={visible}
                // footer={null}
                onCancel={onCancel}
                onOk={onFinish}
                okText={"确定"}
                cancelText={"取消"}
                className="repository-icon-modal"
                closable={false}
            >
                <Form >
                    <Form.Item
                        label="图标"
                        name="icon"
                    >
                        <div className="repository-icon-box">
                            {
                                iconList && iconList.map((item) => {
                                    return <div className={`repository-icon ${item.iconUrl === repositoryIconUrl ? "icon-select" : null}`} key={item.id} onClick={() => { setProjectIconUrl(item.iconUrl) }}>

                                        <ImgComponent
                                            src={item.iconUrl}
                                            alt=""
                                            className="midden-icon-25"
                                        />
                                    </div>
                                })
                            }
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

        </>
    );
};

export default withRouter(RepositoryIcon);
