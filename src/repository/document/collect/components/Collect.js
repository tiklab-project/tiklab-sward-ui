/**
 * @Description: 收藏
 * @Author: gaomengyuan
 * @Date: 2025/6/30
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/6/30
 */
import React, {useEffect, useState} from "react";
import {Col, Row, Empty, Table, Spin, Space, Dropdown, Tooltip, message} from "antd";
import Breadcrumb from "../../../../common/components/breadcrumb/Breadcrumb";
import "./Collect.scss";
import collectStore from "../../../../home/collect/store/CollectStore";
import {getUser} from "tiklab-core-ui";
import DocumentIcon from "../../../../common/components/icon/DocumentIcon";
import {deleteSuccessReturnCurrenPage, documentPush} from "../../../../common/utils/overall";
import Profile from "../../../../common/components/profile/Profile";
import Page from "../../../../common/components/page/Page";

const pageSize = 15;

const Collect = props =>{

    const {match} = props;

    const { findDocumentFocusPage,deleteDocumentFocusByCondition } = collectStore;

    const user = getUser();
    const repositoryId = match.params.repositoryId;

    //收藏数据
    const [focusData,setFocusData] = useState({});
    //加载
    const [spinning,setSpinning] = useState(false);
    const pageParam = {
        pageSize:pageSize,
        currentPage: 1,
    }
    //请求数据
    const [requestParam,setRequestParam] = useState({
        pageParam
    })

    useEffect(()=>{
        //收藏
        findDocumentFocus()
    },[requestParam])

    /**
     * 收藏
     */
    const findDocumentFocus = () => {
        setSpinning(true)
        findDocumentFocusPage({
            ...requestParam,
            masterId: user.userId,
            repositoryId: repositoryId
        }).then(res=>{
            if(res.code===0){
                setFocusData(res.data)
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
            pageParam: {
                pageSize: pageSize,
                currentPage: page
            }
        })
    }

    /**
     * 跳转
     * @param record
     */
    const toDocument = (record) => {
        documentPush(props.history,record.wikiRepository.id,record.node);
    }

    /**
     * 取消收藏
     */
    const deleteFocus = (record) => {
        deleteDocumentFocusByCondition({
            documentId: record.documentId,
            masterId: user.userId
        }).then(res=>{
            if(res.code===0){
                const currentPage = deleteSuccessReturnCurrenPage(focusData.totalRecord,pageSize,focusData.currentPage)
                onPageChange(currentPage)
                message.success('取消收藏')
            }

        })
    }

    const columns = [
        {
            title: "文档",
            dataIndex: "node",
            key: "node",
            align: "left",
            width: "40%",
            render: (text,record) =>(
                <div className='document-collect-table-name' onClick={()=>toDocument(record)}>
                    <DocumentIcon
                        documentType={text?.documentType}
                        documentName={text?.name}
                        className={"icon-24"}
                    />
                    {
                        props.route.path === '/index' ? (
                            <div className='home-name-text'>
                                <div className='home-name-text-name'>
                                    {text?.name}
                                </div>
                                <div className='home-name-text-desc'>
                                    {record?.wikiRepository?.name}
                                </div>
                            </div>
                        ) : (
                            <div className='name-text'>
                                {text?.name}
                            </div>
                        )
                    }
                </div>
            )
        },
        {
            title: "创建人",
            dataIndex: "master",
            key: "master",
            align: "left",
            width: "20%",
            ellipsis:true,
            render:text => (
                <Space>
                    <Profile userInfo={text} />
                    {text?.nickname || '--'}
                </Space>
            )
        },
        {
            title: "创建时间",
            dataIndex: ["node","createTime"],
            key: "createTime",
            align: "left",
            width: "30%",
            ellipsis:true,
        },
        {
            title: "操作",
            dataIndex: 'action',
            key: "action",
            align: "left",
            width: "10%",
            ellipsis: true,
            render: (_,record)=>{
                return (
                    <Dropdown
                        overlay={
                            <div className="sward-dropdown-more">
                                <div className="dropdown-more-item" onClick={()=>deleteFocus(record)}>
                                    取消收藏
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
                )
            }
        }
    ]

    const tableHtml = (
        <Spin spinning={spinning}>
            <div className='document-collect-table'>
                <Table
                    columns={columns}
                    dataSource={focusData?.dataList || []}
                    rowKey={record => record.id}
                    pagination={false}
                    locale={{emptyText: <Empty description="没有查询到数据" />}}
                />
                <Page
                    currentPage={focusData.currentPage}
                    changePage={(currentPage) => onPageChange(currentPage)}
                    totalPage={focusData.totalPage}
                    total={focusData.totalRecord}
                    refresh={() => onPageChange(1)}
                    showRefresh={true}
                />
            </div>
        </Spin>
    )

    return props.route.path === '/index' ? tableHtml : (
        <Row className='document-collect'>
            <Col
                xs={24}
                xl={{ span: "18", offset: "3" }}
            >
                <Breadcrumb
                    {...props}
                    firstText="概况"
                    secondText="收藏"
                    firstUrl={`/repository/${repositoryId}/overview`}
                />
                {tableHtml}
            </Col>
        </Row>
    )
}

export default Collect
