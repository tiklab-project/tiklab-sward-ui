/*
 * @Descripttion: 知识库信息页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:59:04
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:06:48
 */
import React, { useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import { Input, Form, Select, Button, Modal, Row, Col, message, Alert } from "antd";
import 'moment/locale/zh-cn';
import "../components/basicInfo.scss";
import Breadcumb from "../../../../common/components/breadcrumb/Breadcrumb";
import RepositoryIcon from "./RepositoryChangeIcon";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import { Collapse } from 'antd';
import { getVersionInfo } from "tiklab-core-ui";
import ArchivedFree from "../../../../common/components/archivedFree/ArchivedFree";
import Img from "../../../../common/components/img/Img";
import RepositoryDelete from "../../../repository/components/RepositoryDelete";

const { Panel } = Collapse;
const BasicInfo = props => {
    const layout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };
    const formTailLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 8,
            offset: 4,
        },
    };

    const [form] = Form.useForm();
    const repositoryId = props.match.params.repositoryId;
    const { repositorySetStore, repositoryDetailStore, RepositoryRecycleModal,ArchivedComponent } = props;
    const {updateRepository} = repositorySetStore;
    const { findRepository, repository, findDmUserList } = repositoryDetailStore;

    const [disable, setDisabled] = useState(true);
    const [visible, setVisible] = useState(false);

    const [userList,setUserList] = useState([]);

    //移到回收站弹出框
    const [repositoryRecycleVisable, setRepositoryRecycleVisable] = useState(false);
    const versionInfo = getVersionInfo();
    const [archivedFreeVisable, setArchivedFreeVisable] = useState(false)

    useEffect(() => {
        findDmUserList(repositoryId).then(data=>{
            setUserList(data)
        })
    }, [])

    const cancel = () => {
        form.setFieldsValue({
            name: repository.name,
            limits: repository.limits,
            desc: repository.desc,
            master: repository.master.id
        })
        setDisabled(true)
    }

    const onFinish = () => {
        form.validateFields().then((values) => {
            const data = {
                ...values,
                id: repositoryId
            }
            updateRepository(data).then(res => {
                if (res.code === 0) {
                    findRepository(repositoryId)
                    message.info('修改成功');
                }
            })
        })
    }

    const [isModalVisible, setIsModalVisible] = useState(false);

    /**
     * 删除知识库
     */
    const showModal = () => {
        // 免费版本
        setIsModalVisible(true);
    };

    /**
     * 移到回收站
     */
    const showRecycle = () => {
        if (versionInfo.expired === false) {
            setRepositoryRecycleVisable(true)
        } else {
            setArchivedFreeVisable(true)
        }
    }

    /**
     * 归档
     */
    const showArchived = () => {
        setArchivedFreeVisable(true)
    }

    const repositoryInfoDesc = () => (
        <div>
            <div className="repository-info-title">
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use xlinkHref="#icon-projectDetail"></use>
                </svg>
                知识库信息
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use></use>
                </svg>
                知识库信息图标信息，可见范围，负责人等信息，可点击修改
            </div>
        </div>
    );

    const repositoryInfoArchived = () => (
        <div>
            <div className="repository-info-title">
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use xlinkHref="#icon-systemreset"></use>
                </svg>
                归档知识库
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use></use>
                </svg>
                归档知识库
            </div>
        </div>
    )

    const repositoryDelete = () => (
        <div>
            <div className="repository-info-title">
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use xlinkHref="#icon-projectDelete"></use>
                </svg>
                删除知识库
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use></use>
                </svg>
                删除知识库
            </div>
        </div>
    );

    return (
        <Row>
            <Col xs={{ span: 24 }} xxl={{ span: "18", offset: "3" }} xl={{ span: "18", offset: "3" }}>
                <div className="repository-set-basicinfo">
                    <Breadcumb firstText="知识库信息"/>
                    <Collapse expandIconPosition={"right"}>
                        <Panel header={repositoryInfoDesc()} key="info">
                            <div className="repository-set-info">
                                <Form.Item
                                    label="知识库图标"
                                    className="repository-form-icon"
                                    {...layout}
                                    labelAlign="left"
                                >
                                    <div className="form-icon-col">
                                    <Img
                                        src={repository?.iconUrl}
                                        alt=""
                                        className="form-icon"
                                        width = "50"
                                        height = "50"
                                    />
                                        <span>知识库图标，可点击更改按钮修改icon</span>
                                    </div>
                                    <div className="change-button" onClick={() => setVisible(true)}>
                                        更改图标
                                    </div>
                                </Form.Item>
                                <Form
                                    {...layout}
                                    name="basic"
                                    initialValues={{
                                        remember: true,
                                        ...repository,
                                    }}
                                    form={form}
                                    onFinish={onFinish}
                                    onFieldsChange={() => setDisabled(false)}
                                    labelAlign={"left"}
                                >
                                    <Form.Item
                                        label="知识库名称"
                                        name="name"
                                    >
                                        <Input placeholder="知识库名称" />
                                    </Form.Item>
                                    <Form.Item
                                        label="可见人员"
                                        name="limits"
                                    >
                                        <Select
                                            allowClear
                                        >
                                            <Select.Option value="0" key="0">全部成员</Select.Option>
                                            <Select.Option value="1" key="1">知识库成员</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label="负责人"
                                        name={['master','id']}
                                        rules={[
                                            {
                                                required: false,
                                                message: '请输入知识库编码',
                                            }
                                        ]}
                                    >
                                        <Select
                                            placeholder="负责人"
                                            allowClear
                                        >
                                            {
                                                userList && userList.map(item=> {
                                                    const {user} = item;
                                                    return <Select.Option value={user?.id} key={user?.id}>
                                                        {user?.nickname}
                                                    </Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label="知识库描述"
                                        name="desc"
                                    >
                                        <Input placeholder="知识库描述" />
                                    </Form.Item>
                                    <Form.Item {...formTailLayout} >
                                        <Button onClick={() => cancel()}>
                                            取消
                                        </Button>
                                        <Button htmlType="submit" type="primary" disabled={disable}>
                                            保存
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Panel>
                        <Panel header={repositoryInfoArchived()} key="archived">
                            {
                                ArchivedComponent ? (
                                    <ArchivedComponent
                                        {...props}
                                        setArchivedFreeVisable={setArchivedFreeVisable}
                                    />
                                ) : (
                                    <div className="repository-set-info">
                                        <div className="repository-set-icon-block">
                                            可将知识库标记为归档，知识库内将不支持新建操作以及文档编辑操作。
                                        </div>
                                        <div className="button-row">
                                            <div className="change-button" onClick={() => showArchived()}>
                                                归档知识库
                                                {/*{*/}
                                                {/*    versionInfo.expired &&*/}
                                                {/*    <svg className="img-icon-16" aria-hidden="true" >*/}
                                                {/*        <use xlinkHref="#icon-member"></use>*/}
                                                {/*    </svg>*/}
                                                {/*}*/}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </Panel>
                        <Panel header={repositoryDelete()} key="recycle">
                            <div className="repository-set-delete">
                                <div className="repository-set-icon-block">
                                    删除知识库会直接把知识库，知识库内的文档，目录都删除；移入回收站此知识库及其目录将在回收站中保留
                                </div>
                                <PrivilegeProjectButton code={'RepositoryDelete'} domainId={repositoryId}  {...props}>
                                    <div className="button-row">
                                        <div className="change-button" onClick={() =>showRecycle()}>
                                            移入回收站
                                            {/*{*/}
                                            {/*    versionInfo.expired && */}
                                            {/*    <svg className="img-icon-16" aria-hidden="true" >*/}
                                            {/*        <use xlinkHref="#icon-member"></use>*/}
                                            {/*    </svg>*/}
                                            {/*}*/}
                                        </div>
                                        <div className="change-button delete-button" onClick={() => showModal()}>
                                            删除知识库
                                        </div>
                                    </div>
                                </PrivilegeProjectButton>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
                <RepositoryDelete
                    delVisible={isModalVisible}
                    setDelVisible={setIsModalVisible}
                    repository={repository}
                />
                <RepositoryIcon
                    visible={visible}
                    setVisible={setVisible}
                    repositoryId={repositoryId}
                    updateRepository={updateRepository}
                    findRepository={findRepository}
                />
                {
                    RepositoryRecycleModal &&
                    <RepositoryRecycleModal
                        repositoryRecycleVisable={repositoryRecycleVisable}
                        setRepositoryRecycleVisable={setRepositoryRecycleVisable}
                    />
                }
                <ArchivedFree
                    archivedFreeVisable={archivedFreeVisable}
                    setArchivedFreeVisable={setArchivedFreeVisable}
                />
            </Col>
        </Row >
    )
}

export default inject("repositorySetStore", "systemRoleStore","repositoryDetailStore")(observer(BasicInfo));
