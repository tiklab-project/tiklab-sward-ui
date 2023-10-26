import React, { Fragment, useEffect, useState } from "react";
import { Table, Space, Row, Col, message } from 'antd';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import "./UrlData.scss";
import { Provider, observer } from "mobx-react";
import UrlAddData from "./UrlAddData";
import UrlDataStore from "../store/UrlDataStore";
import Button from "../../../common/button/button";
const UrlData = () => {
    const store = {
        urlDataStore: UrlDataStore
    } 
    const { findAllSystemUrl, deleteSystemUrl } = UrlDataStore;
    const [urlDataList, setUrlDataList] = useState([]);
    const [modalTitle, setModalTitle] = useState()
    const [urlAddvisible, setUrlAddvisible] = useState()
    const [actionType, setActionType] = useState()
    const [urlId, setUrlId] = useState()
    const editSystemUrl = (id) => {
        setActionType("edit")
        setUrlId(id)
        setUrlAddvisible(true)
        setModalTitle("编辑地址")
    }

    const deleSystemUrl = (id) => {
        const params = new FormData();
        params.append("id", id)
        deleteSystemUrl(params).then(res => {
            if(res.code === 0){
                findAllSystemUrl().then(data => {
                    if(data.code === 0){
                        setUrlDataList(data.data)
                    }
                })
                message.info("删除成功")
            }
        })
    }
    const columns = [
        {
            title: '系统',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '地址',
            dataIndex: 'systemUrl',
            key: 'systemUrl',
        },
        {
            title: '浏览器端地址',
            dataIndex: 'webUrl',
            key: 'webUrl',
            render: (text, record) => (
                <Space size="small">
                    <span>{text ? text : "无"}</span>
                </Space>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Fragment>
                    <Space size="middle">
                        <span className="systemurl-edit" onClick={() => editSystemUrl(record.id)}>编辑</span>
                        <span className="systemurl-dete" onClick={() => deleSystemUrl(record.id)}>删除</span>
                    </Space>
                    {/* <Space size="small">
                        
                    </Space> */}
                </Fragment>

            ),
        }
    ];

    useEffect(() => {
        findAllSystemUrl().then(res => {
            setUrlDataList(res.data)
        })
        return;
    }, [])

    const addUrl = () => {
        setModalTitle("添加地址")
        setUrlAddvisible(true)
        setActionType("add")
    }
    return (<Provider {...store}>
         <Fragment>
            <Row >
                <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                    <div className="url-data">
                        <Breadcumb
                            firstText="地址"
                        >
                            <div>
                                <Button type="primary" onClick={() => addUrl()}>
                                    添加地址
                                </Button>
                            </div>
                        </Breadcumb>
                        <Table columns={columns} dataSource={urlDataList} />
                    </div>
                </Col>
            </Row>
            <UrlAddData
                urlAddvisible={urlAddvisible}
                setUrlAddvisible={setUrlAddvisible}
                modalTitle={modalTitle}
                actionType={actionType}
                setUrlDataList={setUrlDataList}
                urlId={urlId}
            />
        </Fragment>

    </Provider>
       
    )
}

export default observer(UrlData);