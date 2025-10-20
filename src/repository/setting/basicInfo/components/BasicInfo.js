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
import { Input, Form, Select, Button, Row, Col, message } from "antd";
import 'moment/locale/zh-cn';
import "../components/basicInfo.scss";
import Breadcumb from "../../../../common/components/breadcrumb/Breadcrumb";
import RepositoryIcon from "./RepositoryChangeIcon";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import { disableFunction } from "tiklab-core-ui";
import RepositoryDelete from "../../../repository/components/RepositoryDelete";
import EnhanceEntranceModal from "../../../../common/components/modal/EnhanceEntranceModal";
import {DownOutlined, RightOutlined} from "@ant-design/icons";

const BasicInfo = props => {

    const { repositorySetStore, repositoryDetailStore,ArchivedComponent,RecycleComponent } = props;
    const {updateRepository} = repositorySetStore;
    const { findRepository, repository, findDmUserList } = repositoryDetailStore;

    const [form] = Form.useForm();
    const repositoryId = props.match.params.repositoryId;
    const isVersion = disableFunction();

    //是否能修改知识库
    const [disable, setDisabled] = useState(true);
    //图表弹出框
    const [visible, setVisible] = useState(false);
    //知识库成员
    const [userList,setUserList] = useState([]);
    //订阅引导
    const [archivedFreeVisable, setArchivedFreeVisable] = useState(false)
    //增强弹出框类型
    const [archivedFree,setArchivedFree] = useState('recycle')
    //树的展开与闭合
    const [expandedTree,setExpandedTree] = useState([]);

    useEffect(() => {
        findDmUserList(repositoryId).then(data=>{
            setUserList(data)
        })
    }, [])

    /**
     * 是否符合要求
     * @param key
     * @returns {boolean}
     */
    const isExpandedTree = key => {
        return expandedTree.some(item => item ===key)
    }

    /**
     * 展开和闭合
     * @param key
     */
    const setOpenOrClose = key => {
        if (isExpandedTree(key)) {
            // false--闭合
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            // ture--展开
            setExpandedTree(expandedTree.concat(key))
        }
    }

    /**
     * 关闭知识库信息
     */
    const cancel = () => {
        form.setFieldsValue({
            name: repository.name,
            limits: repository.limits,
            desc: repository.desc,
            master: {id: repository.master.id}
        })
        setDisabled(true)
    }

    /**
     * 更新知识库
     */
    const onFinish = () => {
        form.validateFields().then((values) => {
            const {name,limits,master:{id}} = values;
            const data = {
                name: name || repository.name,
                limits: limits || repository.limits,
                master: {id: id || repository.master.id},
                id: repositoryId
            }
            updateRepository(data).then(res => {
                if (res.code === 0) {
                    findRepository(repositoryId)
                    message.info('修改成功');
                } else {
                    message.error(res.msg)
                }
            })
        })
    }

    const [isModalVisible, setIsModalVisible] = useState(false);

    /**
     * 删除知识库
     */
    const showModal = () => {
        setIsModalVisible(true);
    };

    /**
     * 移到回收站
     */
    const showRecycle = () => {
        setArchivedFree('recycle')
        setArchivedFreeVisable(true)
    }

    /**
     * 归档
     */
    const showArchived = () => {
        setArchivedFree('archived')
        setArchivedFreeVisable(true)
    }

    const configEnhance = {
        'archived':{
            title:'归档',
            desc: '长期存储不常用但需保留的文档'
        },
        'recycle':{
            title:'回收站',
            desc: '防止误删重要文件，提供灵活的数据恢复机制'
        },
    }

    const lis = [
        {
            key: 'info',
            title:"知识库信息",
            desc: "知识库信息，可见范围，负责人等信息，可点击修改",
            icon: (
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use xlinkHref="#icon-projectDetail"></use>
                </svg>
            ),
            content: (
                <div className="repository-set-info">
                    <Form
                        name="basic"
                        initialValues={{
                            remember: true,
                            ...repository,
                        }}
                        form={form}
                        onFinish={onFinish}
                        onFieldsChange={() => setDisabled(false)}
                        layout={"vertical"}
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
                        <Form.Item >
                            <Button onClick={() => cancel()}>
                                取消
                            </Button>
                            <PrivilegeProjectButton code={'wi_setting_wiki_update'} domainId={repositoryId}>
                                <Button htmlType="submit" type="primary" disabled={disable}>
                                    保存
                                </Button>
                            </PrivilegeProjectButton>
                        </Form.Item>
                    </Form>
                </div>
            )
        },
        {
            key: 'archive',
            title:"知识库归档",
            desc: "归档知识库",
            icon: (
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use xlinkHref="#icon-systemreset"></use>
                </svg>
            ),
            content: (
                (ArchivedComponent && !isVersion) ?
                    <PrivilegeProjectButton code={'wi_setting_wiki_archive'} domainId={repositoryId}>
                        <ArchivedComponent
                            {...props}
                            repositoryId={repositoryId}
                            setArchivedFree={setArchivedFree}
                            setArchivedFreeVisable={setArchivedFreeVisable}
                        />
                    </PrivilegeProjectButton>
                    :
                    <div className="repository-set-info">
                        <div className="repository-set-icon-block">
                            可将知识库标记为归档，知识库内将不支持新建操作以及文档编辑操作。
                        </div>
                        <div className="button-row">
                            <div className="change-button" onClick={() => showArchived()}>
                                归档知识库
                            </div>
                        </div>
                    </div>
            )
        },
        {
            key:'delete',
            title:"知识库删除",
            desc: "删除知识库",
            icon: (
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use xlinkHref="#icon-projectDelete"></use>
                </svg>
            ),
            content: (
                <div className="repository-set-delete">
                    <div className="repository-set-icon-block">
                        删除知识库会直接把知识库，知识库内的文档，目录都删除；移入回收站此知识库及其目录将在回收站中保留
                    </div>
                    <div className="button-row">
                        <PrivilegeProjectButton code={isVersion ? null : 'wi_setting_wiki_mv_recycle'} domainId={repositoryId}>
                            {
                                (RecycleComponent && !isVersion) ?
                                    <RecycleComponent
                                        {...props}
                                        repositoryId={repositoryId}
                                    />
                                    :
                                    <div className="change-button" onClick={() =>showRecycle()}>
                                        移入回收站
                                    </div>
                            }
                        </PrivilegeProjectButton>
                        <PrivilegeProjectButton code={'wi_setting_wiki_delete'} domainId={repositoryId}>
                            <div className="change-button delete-button" onClick={() => showModal()}>
                                删除知识库
                            </div>
                        </PrivilegeProjectButton>
                    </div>
                </div>
            )
        },
    ]

    return (
        <Row className='repository-set-basicinfo'>
            <EnhanceEntranceModal
                config={configEnhance[archivedFree]}
                visible={archivedFreeVisable}
                setVisible={setArchivedFreeVisable}
            />
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "24" }}
                xl={{ span: "16", offset: "4" }}
                xxl={{ span: "14", offset: "5" }}
                className='sward-home-limited'
            >
                <Breadcumb firstText="知识库信息"/>
                <div className="repositoryReDel-ul">
                    {
                        lis.map(item=> (
                            <div key={item.key} className="repositoryReDel-li">
                                <div className={`repositoryReDel-li-top ${isExpandedTree(item.key) ?"repositoryReDel-li-select":"repositoryReDel-li-unSelect"}`}
                                     onClick={()=>setOpenOrClose(item.key)}
                                >
                                    <div className="repositoryReDel-li-icon">{item.icon}</div>
                                    <div className="repositoryReDel-li-center">
                                        <div className="repositoryReDel-li-title">{item.title}</div>
                                        {
                                            !isExpandedTree(item.key) &&
                                            <div className="repositoryReDel-li-desc">{item.desc}</div>
                                        }
                                    </div>
                                    <div className="repositoryReDel-li-down">
                                        { isExpandedTree(item.key)? <DownOutlined />:<RightOutlined /> }
                                    </div>
                                </div>
                                <div className={`${isExpandedTree(item.key)? "repositoryReDel-li-bottom":"repositoryReDel-li-none"}`}>
                                    { isExpandedTree(item.key) && item.content }
                                </div>
                            </div>
                        ))
                    }
                </div>
                <RepositoryDelete
                    {...props}
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
            </Col>
        </Row >
    )
}

export default inject("repositorySetStore","repositoryDetailStore")(observer(BasicInfo));
