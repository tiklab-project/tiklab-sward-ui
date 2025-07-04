/*
 * @Author: 袁婕轩
 * @Date: 2023-01-05 14:57:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:05:41
 * @Description: 知识库列表
 */
import React, { useEffect, useState, Fragment } from "react";
import {Table, Space, Row, Col, Empty, Spin, Tooltip, Dropdown} from 'antd';
import { observer, inject } from "mobx-react";
import { getUser } from "tiklab-core-ui";
import Breadcumb from "../../../common/components/breadcrumb/Breadcrumb";
import SearchInput from "../../../common/components/search/SearchInput";
import Button from "../../../common/components/button/Button";
import "./RepositoryList.scss";
import RepositoryStore from "../store/RepositoryStore";
import { useDebounce } from "../../../common/utils/debounce";
import Img from "../../../common/components/img/Img";
import {DeleteOutlined, EditOutlined, SettingOutlined} from "@ant-design/icons";
import RepositoryAdd from "./RepositoryAdd";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import RepositoryDelete from "./RepositoryDelete";
import Profile from "../../../common/components/profile/Profile";

const RepositoryList = (props) => {

    const {systemRoleStore} = props;

    const { findRepositoryList, createRecent,
        repositoryList, findRecentRepositoryList, createRepositoryFocus,
        findFocusRepositoryList, getFocusRepositoryList, deleteRepositoryFocusByCondition,
        activeTabs, setActiveTabs, findRepositoryNum } = RepositoryStore;
    const {getInitProjectPermissions} = systemRoleStore;


    const userId = getUser().userId;
    const [focusRepositoryList, setFocusRepositoryList] = useState([])
    const [recentRepositoryDocumentList, setRecentRepositoryDocumentList] = useState([]);
    const [num, setNum] = useState();
    const [recentDocLoading, setRecentDocLoading] = useState(true);
    //添加弹出框
    const [addVisible,setAddVisible] = useState(false);
    //知识库
    const [repository,setRepository] = useState(null);
    //下拉框
    const [dropVisible,setDropVisible] = useState(null);
    //删除弹出框
    const [delVisible,setDelVisible] = useState(false);

    useEffect(() => {
        if(dropVisible){
            getInitProjectPermissions(userId,repository.id,repository?.limits==="0");
        }
    }, [dropVisible]);

    const repositoryTab = [
        {
            title: '所有知识库',
            key: '1',
            tabName: "all",
            icon: "project"
        },

        {
            title: '我收藏的',
            key: '3',
            tabName: "focus",
            icon: "programconcern"
        },
        {
            title: '我创建的',
            key: '4',
            tabName: "create",
            icon: "programbuild"
        }
    ]


    useEffect(() => {
        selectTabs(activeTabs)
        findFocusRepository()
        //常用知识库
        setRecentDocLoading(true)
        findRecentRepositoryList({
            masterId: userId,
            model: "repository",
            orderParams: [{
                name: "recentTime",
                orderType: "desc"
            }]
        }).then(res => {
            if (res.code === 0) {
                setRecentRepositoryDocumentList(res.data)
            }
        }).finally(()=>{
            setRecentDocLoading(false)
        })
        //知识库统计
        findRepositoryNum({ masterId: userId}).then(res=> {
            if(res.code === 0){
                setNum(res.data)
            }
        })
    }, [])

    const findFocusRepository = (id) => {
        getFocusRepositoryList({ masterId: id }).then(res => {
            if (res.code === 0) {
                const focusList = res.data;
                focusList.map(item => {
                    focusRepositoryList.push(item.id)
                })
                setFocusRepositoryList(focusRepositoryList)
            }
        })
    }

    /**
     * 编辑
     */
    const toEdit = (record) => {
        setDropVisible(null);
        setAddVisible(true);
    }

    /**
     * 删除
     */
    const toDelete = (record) => {
        setDropVisible(null);
        setDelVisible(true);
    }

    /**
     * 删除后重新获取列表
     */
    const changFresh = (type) => {
        selectTabs(activeTabs);
        if(type==='delete'){
            findRepositoryNum({ masterId: userId}).then(res=> {
                if(res.code === 0){
                    setNum(res.data)
                }
            })
        }
    }

    /**
     * 设置
     */
    const toSetting = (record) =>{
        setDropVisible(null);
        props.history.push(`/repository/${record.id}/set/basicInfo`)
    }

    const goRepositorydetail = (repository) => {
        const params = {
            name: repository.name,
            model: "repository",
            modelId: repository.id,
            master: { id: userId },
            wikiRepository: { id: repository.id }
        }
        createRecent(params)
        props.history.push({ pathname: `/repository/${repository.id}/overview` })
    }

    const handleTableChange = (pagination) => {
        findRepositoryList({ current: pagination.current })
    }

    const onSearch = useDebounce(value => {
        switch (activeTabs) {
            case "1":
                findRepositoryList({ name: value })
                break;
            case "3":
                findFocusRepositoryList({ masterId: userId, name: value })
                break;
            case "4":
                findRepositoryList({ masterId: userId, name: value });
                break
            default:
                break;
        }
        findRepositoryNum({ masterId: userId, name: value}).then(res=> {
            if(res.code === 0){
                setNum(res.data)
            }
        })
    }, [500]);

    const selectTabs = (key) => {
        setActiveTabs(key)
        switch (key) {
            case "1":
                findRepositoryList({})
                break;
            case "3":
                findFocusRepositoryList({ masterId: userId })
                break;
            case "4":
                findRepositoryList({ masterId: userId });
                break
            default:
                break;
        }
    }

    const addFocusRepository = (id) => {
        createRepositoryFocus({ repositoryId: id }).then(res => {
            if (res.code === 0) {
                focusRepositoryList.push(id)
                setFocusRepositoryList([...focusRepositoryList])
                num.focus = num.focus + 1;
                setNum({...num})
            }
        })
    }

    const deleteFocusRepository = (id) => {
        const params = {
            masterId: userId,
            repositoryId: id
        }
        deleteRepositoryFocusByCondition(params).then(res => {
            if (res.code === 0) {
                const index = focusRepositoryList.indexOf(id);
                if (index > -1) {
                    focusRepositoryList.splice(index, 1);
                }
                setFocusRepositoryList([...focusRepositoryList])
                num.focus = num.focus - 1;
                setNum({...num})
            }
        })
    }

    const goRepositoryAdd = () => {
        setRepository(null);
        setAddVisible(true);
    }

    const columns = [
        {
            title: "知识库名称",
            dataIndex: "name",
            key: "name",
            align: "left",
            render: (text, record) => <div onClick={() => goRepositorydetail(record)} className="repository-title">
                <Img
                    src={record.iconUrl}
                    alt=""
                    className="list-img"
                />
                <div className="repository-info">
                    <div className="repository-name">{text}</div>
                    <div className="repository-master">{record.master.nickname}</div>
                </div>
            </div>,
        },
        {
            title: "负责人",
            dataIndex: ["master", "nickname"],
            key: "master",
            align: "left",
            render: (text, record) => (
                <Space>
                    <Profile userInfo={record.master}/>
                    {text}
                </Space>
            )

        },
        {
            title: "可见范围",
            dataIndex: "limits",
            key: "limits",
            align: "left",
            render: (text, record) => <div>
                {text === "0" ? "公开" : "私有"}
            </div>,

        },
        {
            title: "创建时间",
            dataIndex: "createTime",
            key: "createTime",
            align: "left",
            width: "20%"
        },
        {
            title: "操作",
            dataIndex: "action",
            key: "action",
            align: "left",
            width: "15%",
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="收藏">
                        {
                            focusRepositoryList.indexOf(record.id) !== -1 ?
                                <svg className="svg-icon" aria-hidden="true" onClick={() => deleteFocusRepository(record.id)}>
                                    <use xlinkHref="#icon-focus"></use>
                                </svg>
                                :
                                <svg className="svg-icon" aria-hidden="true" onClick={() => addFocusRepository(record.id)}>
                                    <use xlinkHref="#icon-nofocus"></use>
                                </svg>
                        }
                    </Tooltip>
                    <Dropdown
                        overlay={
                            <div className="sward-dropdown-more">
                                <div className="dropdown-more-item" onClick={()=>toEdit(record)}>
                                    <EditOutlined /> 编辑
                                </div>
                                <PrivilegeProjectButton code={"RepositoryDelete"} domainId={record.id}>
                                    <div className="dropdown-more-item" onClick={()=>toDelete(record)}>
                                        <DeleteOutlined /> 删除
                                    </div>
                                </PrivilegeProjectButton>
                                <div className="dropdown-more-item" onClick={()=>toSetting(record)}>
                                    <SettingOutlined /> 设置
                                </div>
                            </div>
                        }
                        trigger={['click']}
                        placement={"bottomRight"}
                        visible={dropVisible === record.id}
                        onVisibleChange={visible => {
                            if(visible){
                                setRepository(record)
                            }
                            setDropVisible(visible ? record.id : null);
                        }}
                    >
                        <Tooltip title="更多">
                            <svg className="svg-icon" aria-hidden="true" >
                                <use xlinkHref="#icon-more-default"></use>
                            </svg>
                        </Tooltip>
                    </Dropdown>
                </Space>
            ),
        },
    ]

    return (
        <Row className="repository-row">
            <Col xs={{span:24}} xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }}>
                <div className="repository">
                    <Breadcumb
                        firstText="知识库"
                    >
                        <Button type="primary" onClick={goRepositoryAdd} buttonText={"添加知识库"} >
                        </Button>
                    </Breadcumb>
                    <RepositoryAdd
                        {...props}
                        addVisible={addVisible}
                        setAddVisible={setAddVisible}
                        repository={repository}
                        setRepository={setRepository}
                        changFresh={changFresh}
                    />
                    <RepositoryDelete
                        repository={repository}
                        delVisible={delVisible}
                        setDelVisible={setDelVisible}
                        changFresh={changFresh}
                    />
                    <div className="recent-repository">
                        <div className="repository-title">常用知识库</div>
                        <Spin wrapperClassName="repository-spin" spinning={recentDocLoading} tip="加载中..." >
                        {
                            recentRepositoryDocumentList.length > 0 ?
                                <div className="repository-box">{
                                    recentRepositoryDocumentList.map(item => {
                                        return <div className="repository-item" key={item.id} onClick={() => goRepositorydetail(item)} >
                                            <div className="item-title">
                                                <Img
                                                    src={item.iconUrl}
                                                    alt=""
                                                    className="list-img"
                                                />
                                                <span>{item.name}</span>
                                            </div>
                                            <div className="item-work">
                                                <div className="process-work"><span style={{ color: "#999" }}>文档</span><span>{item.documentNum}篇</span></div>
                                                <div className="end-work"><span style={{ color: "#999" }}>目录</span><span>{item.categoryNum}个</span></div>
                                            </div>
                                        </div>
                                    })
                                }
                                </div>
                                :
                                <>
                                {!recentDocLoading &&  <Empty description="暂时没有查看过知识库~" />}
                                </>
                        }
                        </Spin>
                    </div>
                    <div className="repository-tabs-search">
                        <div className="repository-filter">
                            <div className="repository-tabs">
                                {
                                    repositoryTab.map(item => {
                                        return <div
                                            className={`repository-tab ${activeTabs === item.key ? "active-tabs" : ""}`}
                                            key={item.key}
                                            onClick={() => selectTabs(item.key)}
                                        >
                                            {item.title}
                                            <span className="repository-tab-num">{num && num[item.tabName]}</span>
                                        </div>
                                    })
                                }
                            </div>
                            <SearchInput onChange={(value) => onSearch(value)} placeholder={"搜索知识库"} />
                        </div>
                    </div>
                    <div className="repository-table-box">
                        <Table
                            columns={columns}
                            dataSource={repositoryList}
                            rowKey={record => record.id}
                            onChange={handleTableChange}
                            pagination={false}
                            scroll={{
                                x: "100%"
                            }}
                        />
                    </div>
                </div>
            </Col>
        </Row >

    )
}
export default inject("systemRoleStore")(observer(RepositoryList))
