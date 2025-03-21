/*
 * @Author: 袁婕轩
 * @Date: 2023-01-05 14:57:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:05:41
 * @Description: 知识库列表
 */
import React, { useEffect, useState, Fragment } from "react";
import { Table, Space, Row, Col, Empty, Spin } from 'antd';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import { getUser } from "tiklab-core-ui";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import InputSearch from "../../../common/input/InputSearch";
import Button from "../../../common/button/Button";
import "./RepositoryList.scss";
import { useHistory } from 'react-router-dom';
import RepositoryStore from "../store/RepositoryStore";
import { useDebounce } from "../../../common/utils/debounce";
import UserIcon from "../../../common/UserIcon/UserIcon";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
const RepositoryList = (props) => {
    const { findRepositoryList, createRecent,
        repositoryList, findRecentRepositoryList, createRepositoryFocus,
        findFocusRepositoryList, getFocusRepositoryList, deleteRepositoryFocusByCondition,
        activeTabs, setActiveTabs, findRepositoryNum } = RepositoryStore;
    const userId = getUser().userId;
    const [focusRepositoryList, setFocusRepositoryList] = useState([])
    const [recentRepositoryDocumentList, setRecentRepositoryDocumentList] = useState([]);
    const [num, setNum] = useState();
    const [recentDocLoading, setRecentDocLoading] = useState(true);
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
    const history = useHistory()
    useEffect(() => {
        selectTabs(activeTabs)
        findFocusRepository()
        const recentRepositoryParams = {
            masterId: userId,
            model: "repository",
            orderParams: [{
                name: "recentTime",
                orderType: "desc"
            }]
        }
        setRecentDocLoading(true)
        findRecentRepositoryList(recentRepositoryParams).then(res => {
            if (res.code === 0) {
                setRecentRepositoryDocumentList(res.data)
            }
            setRecentDocLoading(false)
        })
        findRepositoryNum({ masterId: userId}).then(res=> {
            if(res.code === 0){
                setNum(res.data)
            }
        })
        return
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


    const columns = [
        {
            title: "知识库名称",
            dataIndex: "name",
            key: "name",
            align: "left",
            render: (text, record) => <div onClick={() => goRepositorydetail(record)} className="repository-title">
                <ImgComponent
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
                    <UserIcon name={text} />
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
                </Space>
            ),
        },
    ]

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
        console.log(value)
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
            case "2":
                findRecentRepositoryList({ master: userId })
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
        history.push("/repositoryAdd")
    }
    // const goRepositoryDetail = repository => {
    //     props.history.push(`/repository/${repository.id}/overview`)
    // }

    return (
        <Row className="repository-row">
            <Col xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }}>
                <div className="repository">
                    <Breadcumb
                        firstText="知识库"
                    >
                        <Button type="primary" onClick={() => goRepositoryAdd()} buttonText={"添加知识库"} >
                        </Button>
                    </Breadcumb>
                    <div className="recent-repository">
                        <div className="repository-title">常用知识库</div>
                        <Spin wrapperClassName="repository-spin" spinning={recentDocLoading} tip="加载中..." >
                        {
                            recentRepositoryDocumentList.length > 0 ?
                                <div className="repository-box">{
                                    recentRepositoryDocumentList.map(item => {
                                        return <div className="repository-item" key={item.id} onClick={() => goRepositorydetail(item)} >
                                            <div className="item-title">
                                                <ImgComponent
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
                            <InputSearch onChange={(value) => onSearch(value)} placeholder={"搜索知识库"} />
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
export default withRouter(observer(RepositoryList));
