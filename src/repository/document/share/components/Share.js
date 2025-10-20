/**
 * @Description: 共享
 * @Author: gaomengyuan
 * @Date: 2025/6/30
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/6/30
 */
import React, {useEffect, useState} from "react";
import {Col, Row, Table, Spin, Space, Tooltip, Dropdown, Modal, message, Empty} from "antd";
import Breadcrumb from "../../../../common/components/breadcrumb/Breadcrumb";
import "./Share.scss";
import shareStore from "../store/ShareStore";
import {getUser} from "tiklab-core-ui";
import DocumentIcon from "../../../../common/components/icon/DocumentIcon";
import {deleteSuccessReturnCurrenPage, useDebounce} from "../../../../common/utils/overall";
import Profile from "../../../../common/components/profile/Profile";
import Page from "../../../../common/components/page/Page";
import {ShareAltOutlined} from "@ant-design/icons";
import SearchInput from "../../../../common/components/search/SearchInput";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";

const pageSize = 10;

const Share = props =>{

    const {match,type} = props;

    const { findSharePage, deleteShare } = shareStore;

    //仓库id
    const repositoryId = match.params.repositoryId;
    //用户
    const user = getUser();

    //共享数据
    const [shareData,setShareData] = useState({});
    //加载
    const [spinning,setSpinning] = useState(false);
    const pageParam = {
        pageSize:pageSize,
        currentPage: 1,
    }
    //请求数据
    const [requestParam,setRequestParam] = useState({
        pageParam,
        type: 'all'
    })


    useEffect(()=>{
        //共享
        findShare()
    },[requestParam])

    /**
     * 共享
     */
    const findShare = () => {
        setSpinning(true);
        const {type,...rest} = requestParam;
        findSharePage({
            ...rest,
            ...(type==='all'?{}:{type: type}),
            rpyId: repositoryId,
            orderParams: [{name: "createTime", orderType: "desc"}],
        }).then(res=>{
            if(res.code===0){
                setShareData(res.data)
            }
        }).finally(()=>{
            setSpinning(false)
        })
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
     * 更改类型
     */
    const changeType = (type) => {
        setRequestParam({
            ...requestParam,
            pageParam,
            type: type,
        })
    }

    /**
     * 模糊搜索
     */
    const onSearch = useDebounce(value => {
        setRequestParam({
            ...requestParam,
            pageParam,
            name:value
        })
    }, 500);

    /**
     * 跳转
     * @param record
     */
    const toShare = (record) => {
        const url = version === "cloud" ? `/#/share/${record.id}?tenant=${user.tenant}` :`/#/share/${record.id}`
        window.open(url)
    }

    /**
     * 删除
     */
    const toDelete = (record) => {
        Modal.confirm({
            title: '确定删除吗？',
            content: <span style={{color:"#f81111"}}>删除后无法恢复！</span>,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                deleteShare(record.id).then(res=>{
                    if(res.code===0){
                        const currentPage = deleteSuccessReturnCurrenPage(shareData.totalRecord,pageSize,shareData.currentPage)
                        onPageChange(currentPage)
                        message.success('删除成功');
                    } else {
                        message.error(res.msg)
                    }
                })
            },
            onCancel() {
            },
        })
    }

    const columns = [
        {
            title: "名称",
            dataIndex: "name",
            key: "name",
            align: "left",
            width: "30%",
            ellipsis:true,
            render:(text,record)=>{
                return (
                    <div className='document-share-table-name'>
                        <DocumentIcon
                            type={record.type}
                            documentType={'document'}
                            className={'icon-24'}
                        />
                        {
                            type === 'home'  ? (
                                <div className='home-name-text'>
                                    <div className='home-name-text-name'>
                                        {text}
                                    </div>
                                    <div className='home-name-text-desc'>
                                        {record?.wikiRepository?.name}
                                    </div>
                                </div>
                            ) : (
                                <div className='name-text'>
                                    {text}
                                </div>
                            )
                        }
                    </div>
                )
            }
        },
        {
            title: "类型",
            dataIndex: "type",
            key: "type",
            align: "left",
            width: "15%",
            ellipsis:true,
            render: text => text===1 ? '外部' : '知识库'
        },
        {
            title: "创建人",
            dataIndex: "user",
            key: "user",
            align: "left",
            width: "20%",
            ellipsis: true,
            render: text => (
                <Space>
                    <Profile userInfo={text}/>
                    {text?.nickname || '--'}
                </Space>
            )
        },
        {
            title: "创建时间",
            dataIndex: 'createTime',
            key: "createTime",
            align: "left",
            width: "25%",
            ellipsis:true,
        },
        {
            title: "操作",
            dataIndex: 'action',
            key: "action",
            align: "left",
            width: "10%",
            ellipsis: true,
            render:(_,record)=>{
                const { permissions={} } = record;
                return (
                    <Space size={'middle'}>
                        {
                            type === 'home' ?
                                <>
                                    {
                                        permissions?.view &&
                                        <Tooltip title={'查看分享'}>
                                            <ShareAltOutlined
                                                className='action-button'
                                                onClick={()=>toShare(record)}
                                            />
                                        </Tooltip>
                                    }
                                    {
                                        permissions?.delete &&
                                        <Dropdown
                                            overlay={
                                                <div className="sward-dropdown-more">
                                                    <div className="dropdown-more-item" onClick={()=>toDelete(record)}>
                                                        删除
                                                    </div>
                                                </div>
                                            }
                                            trigger={['click']}
                                            placement={'bottomRight'}
                                        >
                                            <Tooltip title="更多">
                                                <svg className="svg-icon" aria-hidden="true" >
                                                    <use xlinkHref="#icon-more-default"></use>
                                                </svg>
                                            </Tooltip>
                                        </Dropdown>
                                    }
                                </>
                                :
                                <>
                                    <PrivilegeProjectButton domainId={repositoryId} code={'wi_setting_doc_share_find'}>
                                        <Tooltip title={'查看分享'}>
                                            <ShareAltOutlined
                                                className='action-button'
                                                onClick={()=>toShare(record)}
                                            />
                                        </Tooltip>
                                    </PrivilegeProjectButton>
                                    <PrivilegeProjectButton domainId={repositoryId} code={'wi_setting_doc_share_delete'}>
                                        <Dropdown
                                            overlay={
                                                <div className="sward-dropdown-more">
                                                    <div className="dropdown-more-item" onClick={()=>toDelete(record)}>
                                                        删除
                                                    </div>
                                                </div>
                                            }
                                            trigger={['click']}
                                            placement={'bottomRight'}
                                        >
                                            <Tooltip title="更多">
                                                <svg className="svg-icon" aria-hidden="true" >
                                                    <use xlinkHref="#icon-more-default"></use>
                                                </svg>
                                            </Tooltip>
                                        </Dropdown>
                                    </PrivilegeProjectButton>
                                </>
                        }
                    </Space>
                )
            }
        }
    ]

    const commonHtml = (
        <div className='document-share-content'>
            <div className='document-share-search'>
                <div className='document-share-tabs'>
                    <div
                        className={`document-share-tab ${requestParam?.type==='all' ? 'share-tab-select' : ''}`}
                        onClick={()=>changeType('all')}
                    >
                        全部
                    </div>
                    <div
                        className={`document-share-tab ${requestParam?.type===1 ? 'share-tab-select' : ''}`}
                        onClick={()=>changeType(1)}
                    >
                        外部
                    </div>
                    <div
                        className={`document-share-tab ${requestParam?.type===2 ? 'share-tab-select' : ''}`}
                        onClick={()=>changeType(2)}
                    >
                        知识库
                    </div>
                </div>
                <SearchInput
                    placeholder={'搜索名称'}
                    style={{width:180}}
                    onChange={(value) => onSearch(value)}
                />
            </div>
            <Spin spinning={spinning}>
                <Table
                    columns={columns}
                    dataSource={shareData?.dataList || []}
                    rowKey={record => record.id}
                    pagination={false}
                    locale={{emptyText: <Empty description="没有查询到数据" />}}
                />
                <Page
                    currentPage={shareData.currentPage}
                    changePage={(currentPage) => onPageChange(currentPage)}
                    totalPage={shareData.totalPage}
                    total={shareData.totalRecord}
                    refresh={() => onPageChange(1)}
                    showRefresh={true}
                />
            </Spin>
        </div>
    )

    return type === 'home' ? (
        <div className='document-share-home'>
            {commonHtml}
        </div>
    ) : (
        <Row className='document-share'>
            <Col
                sm={24}
                xs={24}
                xl={{ span: "18", offset: "3" }}
                className='sward-home-limited'
            >
                <Breadcrumb
                    firstText={'共享'}
                />
                {commonHtml}
            </Col>
        </Row>
    )
}

export default Share
