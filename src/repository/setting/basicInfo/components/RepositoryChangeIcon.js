// 修改知识库图标
import React, { useState, useEffect } from "react";
import {Form} from 'antd';
import { withRouter } from "react-router";
import RepositoryIconStore from "../store/RepositoryStore";
import Img from "../../../../common/components/img/Img";
import BaseModal from "../../../../common/components/modal/Modal";
const RepositoryIcon = (props) => {

    const [form] = Form.useForm();

    const { visible, setVisible, repositoryId, updateRepository,findRepository } = props;

    const [repositoryIconUrl, setProjectIconUrl] = useState("")

    const { findIconList, creatIcon } = RepositoryIconStore;
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

    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };


    return (
        <BaseModal
            title="更改图标"
            visible={visible}
            onCancel={onCancel}
            onOk={onFinish}
            className="repository-icon-modal"
        >
            <Form layout={'vertical'}>
                <Form.Item label="图标" name="icon">
                    <div className="repository-icon-box">
                        {
                            iconList && iconList.map((item) => {
                                return <div className={`repository-icon ${item.iconUrl === repositoryIconUrl ? "icon-select" : null}`} key={item.id} onClick={() => { setProjectIconUrl(item.iconUrl) }}>
                                    <Img
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
        </BaseModal>
    );
};

export default withRouter(RepositoryIcon);
