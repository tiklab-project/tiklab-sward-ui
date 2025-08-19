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
import Breadcrumb from "../../../common/components/breadcrumb/Breadcrumb";
import SearchInput from "../../../common/components/search/SearchInput";
import Button from "../../../common/components/button/Button";
import "./Repository.scss";
import RepositoryStore from "../store/RepositoryStore";
import { useDebounce } from "../../../common/utils/debounce";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import RepositoryAdd from "./RepositoryAdd";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import RepositoryDelete from "./RepositoryDelete";
import Profile from "../../../common/components/profile/Profile";
import {deleteSuccessReturnCurrenPage} from "../../../common/utils/overall";
import PaginationCommon from "../../../common/components/page/Page";
import ListIcon from "../../../common/components/icon/ListIcon";

const pageSize = 10;

const Repository = (props) => {

    const {systemRoleStore} = props;

    const {
        findFocusRepositoryList,
        findRepositoryPage,
        findRecentRepositoryList,
        createRepositoryFocus,
        deleteRepositoryFocusByCondition,
        findRepositoryNum
    } = RepositoryStore;
    const {getInitProjectPermissions} = systemRoleStore;

    const userId = getUser().userId;
    const [focusRepositoryList, setFocusRepositoryList] = useState([])
    //常用知识库
    const [recentRepositoryDocumentList, setRecentRepositoryDocumentList] = useState([]);
    //知识库统计
    const [num, setNum] = useState();
    //常用加载
    const [recentDocLoading, setRecentDocLoading] = useState(true);
    //添加弹出框
    const [addVisible,setAddVisible] = useState(false);
    //知识库
    const [repository,setRepository] = useState(null);
    //下拉框
    const [dropVisible,setDropVisible] = useState(null);
    //删除弹出框
    const [delVisible,setDelVisible] = useState(false);
    //选中的tab
    const [activeTabs,setActiveTabs] = useState('all');
    const pageParam = {
        pageSize:pageSize,
        currentPage: 1,
    }
    //请求数据
    const [requestParam,setRequestParam] = useState({
        pageParam
    })
    //知识库数据
    const [repositoryData,setRepositoryData] = useState({});
    //加载
    const [spinning,setSpinning] = useState(false);

    useEffect(() => {
        if(dropVisible){
            getInitProjectPermissions(userId,repository.id,repository?.limits==="0");
        }
    }, [dropVisible]);

    useEffect(() => {
        //所有收藏
        findFocusRepositoryList({ masterId: userId }).then(res => {
            if (res.code === 0) {
                const focusList = res.data;
                focusList.map(item => {
                    focusRepositoryList.push(item.id)
                })
                setFocusRepositoryList(focusRepositoryList)
            }
        })
        //常用知识库
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
    }, [])

    /**
     * 知识库统计
     */
    const findRepositoryCount = (value) => {
        findRepositoryNum({ masterId: userId,...value}).then(res=> {
            if(res.code === 0){
                setNum(res.data)
            }
        })
    }

    useEffect(()=>{
        //知识库统计
        findRepositoryCount()
    },[])

    useEffect(()=>{
        //知识库
        findRepository()
    },[requestParam])

    /**
     * 获取知识库
     */
    const findRepository = () => {
        setSpinning(true);
        let param = {...requestParam};
        if(activeTabs==='focus'){
            param.collect = userId;
        }
        if(activeTabs==='create'){
            param.masterId = userId;
        }
        findRepositoryPage({
            userId:userId,
            ...param
        }).then(res=>{
            if(res.code===0){
                setRepositoryData(res.data)
            }
        }).finally(()=>{
            setSpinning(false)
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
        if(type==='delete'){
            const page = deleteSuccessReturnCurrenPage(repositoryData?.totalRecord,pageSize,repositoryData.currentPage);
            onPageChange(page)
        } else {
            findRepository()
        }
        findRepositoryCount()
    }

    /**
     * 换页
     */
    const onPageChange = (page) => {
        setRequestParam({
            ...requestParam,
            pageParam: {
                pageSize: pageSize,
                currentPage: page
            }
        })
    }

    /**
     * 设置
     */
    const toSetting = (record) =>{
        setDropVisible(null);
        props.history.push(`/repository/${record.id}/set/basicInfo`)
    }

    const goRepositorydetail = (repository) => {
        props.history.push(`/repository/${repository.id}/overview`)
    }

    /**
     * 模糊搜索
     */
    const onSearch = useDebounce(value => {
        setRequestParam({
            ...requestParam,
            pageParam,
            name: value
        })
        findRepositoryCount({
            name:value
        })
    }, [500]);

    /**
     * 切换状态
     */
    const selectTabs = (key) => {
        setActiveTabs(key)
        setRequestParam({
            ...requestParam,
            pageParam,
        })
    }

    /**
     * 添加收藏
     * @param id
     */
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

    /**
     * 取消收藏
     * @param id
     */
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
                if(activeTabs==='focus'){
                    changFresh('delete')
                } else {
                    num.focus = num.focus - 1;
                    setNum({...num})
                }
            }
        })
    }

    /**
     * 添加知识库
     */
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
            width:"45%",
            ellipsis:true,
            render: (text, record) => <div onClick={() => goRepositorydetail(record)} className="repository-title">
                <ListIcon
                    icon={record.iconUrl}
                    text={text}
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
            width:"20%",
            ellipsis:true,
            render: (text, record) => (
                <Space>
                    <Profile userInfo={record.master}/>
                    {text}
                </Space>
            )
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
                                    <use xlinkHref="#icon-xingxing_kong"></use>
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
                                <div className="dropdown-more-item dropdown-more-item-last" onClick={()=>toSetting(record)}>
                                    <svg className="icon-16" aria-hidden="true">
                                        <use xlinkHref="#icon-setting"></use>
                                    </svg>
                                    <span>设置</span>
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

    const repositoryTab = [
        {title: '所有', key: 'all',},
        {title: '我收藏的', key: 'focus',},
        {title: '我创建的', key: 'create',}
    ]

    return (
        <Row className="repository-row">
            <Col xs={{span:24}} xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }}>
                <div className="repository">
                    <Breadcrumb firstText="知识库">
                        <Button type="primary" onClick={goRepositoryAdd} buttonText={"添加知识库"}>
                        </Button>
                    </Breadcrumb>
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
                        <div className="repository-title">常用</div>
                        <Spin wrapperClassName="repository-spin" spinning={recentDocLoading} tip="加载中..." >
                            {
                                recentRepositoryDocumentList.length > 0 ?
                                    <div className="repository-box">{
                                        recentRepositoryDocumentList.map(item => {
                                            return (
                                                <div className="repository-item" key={item.id} onClick={() => goRepositorydetail(item)} >
                                                    <div className="item-title">
                                                        <ListIcon
                                                            icon={item.iconUrl}
                                                            text={item.name}
                                                        />
                                                        <span className='item-title-name'>{item.name}</span>
                                                    </div>
                                                    <div className="item-work">
                                                        <div className="process-work">
                                                            <span style={{ color: "#999" }}>文档</span>
                                                            <span>{item.documentNum}篇</span>
                                                        </div>
                                                        <div className="end-work">
                                                            <span style={{ color: "#999" }}>目录</span>
                                                            <span>{item.categoryNum}个</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                                    :
                                    <Empty description="暂时没有查看过知识库~" />
                            }
                            </Spin>
                    </div>
                    <div className="repository-tabs-search">
                        <div className="repository-filter">
                            <div className="repository-tabs">
                                {
                                    repositoryTab.map(item => {
                                        return (
                                            <div
                                                className={`repository-tab ${activeTabs === item.key ? "active-tabs" : ""}`}
                                                key={item.key}
                                                onClick={() => selectTabs(item.key)}
                                            >
                                                {item.title}
                                                <span className="repository-tab-num">{num ? num[item.key] : 0}</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <SearchInput onChange={(value) => onSearch(value)} placeholder={"搜索知识库"} />
                        </div>
                    </div>
                    <div className="repository-table-box">
                        <Spin spinning={spinning}>
                            <Table
                                columns={columns}
                                dataSource={repositoryData?.dataList || []}
                                rowKey={record => record.id}
                                pagination={false}
                            />
                            <PaginationCommon
                                currentPage={repositoryData?.currentPage}
                                changePage={(currentPage) => onPageChange(currentPage)}
                                totalPage={repositoryData?.totalPage}
                                total={repositoryData?.totalRecord}
                                refresh={() => onPageChange(1)}
                                showRefresh={true}
                            />
                        </Spin>
                    </div>
                </div>
            </Col>
        </Row >

    )
}

export default inject("systemRoleStore")(observer(Repository))
