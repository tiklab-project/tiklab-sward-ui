/*
 * @Descripttion: 系统首页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:53:28
 */
import React, { Fragment, useEffect, useState } from 'react';
import "./home.scss";
import { Row, Col, Empty, Spin } from 'antd';
import { observer } from 'mobx-react';
import { getUser } from 'tiklab-core-ui';
import HomeStore from "../store/HomeStore";
import UserIcon from '../../../common/components/icon/UserIcon';
import Img from '../../../common/components/img/Img';
import DocumentIcon from "../../../common/components/icon/DocumentIcon";
import {documentPush} from "../../../common/utils/overall";
const Home = (props) => {
    const { findDocumentRecentList, findRecentRepositoryList } = HomeStore;
    const [recentViewDocumentList, setRecentViewDocumentList] = useState([]);
    const [recentRepositoryDocumentList, setRecentRepositoryDocumentList] = useState([]);
    const userId = getUser().userId;
    const [recentLoading, setRecentLoading] = useState(true);
    const [recentDocLoading, setRecentDocLoading] = useState(true);
    useEffect(() => {
        const recentDocumentParams = {
            masterId: userId,
            model: "document",
            recycle: "0",
            status: "nomal",
            orderParams: [{
                name: "recentTime",
                orderType: "desc"
            }]
        }
        setRecentLoading(true)
        setRecentDocLoading(true)
        // 获取最近查看的文档
        findDocumentRecentList(recentDocumentParams).then(res => {
            console.log(res)
            if (res.code === 0) {
                setRecentViewDocumentList([...res.data])
            }
            setRecentDocLoading(false)
        })


        const recentRepositoryParams = {
            masterId: userId,
            model: "repository",
            orderParams: [{
                name: "recentTime",
                orderType: "desc"
            }]
        }
        // 获取最近查看的知识库
        findRecentRepositoryList(recentRepositoryParams).then(res => {
            if (res.code === 0) {
                setRecentRepositoryDocumentList(res.data.slice(0, 5))
            }
            setRecentLoading(false)
        })
        return;
    }, [])

    // 跳转知识库详情页面
    const goRepositoryDetail = repository => {
        sessionStorage.setItem("menuKey", "repository")
        props.history.push(`/repository/${repository.id}/overview`)
    }

    // 跳转文档详情
    const goDocumentDetail = item => {
        documentPush(props.history,item.wikiRepository.id,item)
        sessionStorage.setItem("menuKey", "repository")
    }

    return (
        <div className="home">
            <Row className="home-row">
                <Col
                    xxl={{ span: 16, offset: 4 }}
                    xl={{ span: 18, offset: 3 }}
                    lg={{ span: 18, offset: 3 }}
                    md={{ span: 20, offset: 2 }}
                    xs={{ span: 24 }}
                    className="home-col"
                >
                    <div className="home-repository">
                        <div className="repository-title">常用知识库</div>
                        <Spin wrapperClassName="repository-spin" spinning={recentLoading} tip="加载中..." >
                            {
                                recentRepositoryDocumentList.length > 0 ?
                                    <div className="repository-box">
                                        {
                                            recentRepositoryDocumentList.map(item => {
                                                return <div className="repository-item" key={item.id} onClick={() => goRepositoryDetail(item)} >
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
                                    <div className="repository-box-empty">
                                        {!recentLoading && <Empty description="暂时没有查看过知识库~" />}
                                    </div>

                            }
                        </Spin>
                    </div>
                    <div className="home-document">
                        <div className="document-box-title">
                            <span className="name">常用文档</span>
                        </div>
                        <Spin wrapperClassName="document-spin" spinning={recentDocLoading} tip="加载中..." >
                            {
                                recentViewDocumentList && recentViewDocumentList.length > 0 ?
                                    recentViewDocumentList.map((item) => {
                                        return <div className="document-list-item" key={item.id} >
                                            <div className='document-item-left' style={{ flex: 1 }}>
                                                <div>
                                                    <DocumentIcon
                                                        documentType={item.node?.documentType}
                                                        documentName={item?.name}
                                                        className={"document-icon"}
                                                    />
                                                </div>
                                                <div className="document-item-text">
                                                    <div className="document-title" onClick={() => goDocumentDetail(item.node)}>{item.name}</div>
                                                    <div className="document-master" style={{ flex: 1 }}>{item.wikiRepository?.name}</div>
                                                </div>
                                            </div>
                                            <div className="document-master-name">
                                                <UserIcon name={item.master.nickname} size="big" />
                                                {item.master.nickname}
                                            </div>
                                            <div className="document-time">{item.recentTime ? item.recentTime : item.recentTime}</div>
                                        </div>
                                    })
                                    :
                                    <>
                                    {
                                        !recentDocLoading && <Empty description="暂时没有数据~" />
                                    }
                                    </>

                            }
                        </Spin>
                    </div>
                </Col>
            </Row>
        </div >
    );
}

export default observer(Home);
