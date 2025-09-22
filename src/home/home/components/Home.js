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
import Img from '../../../common/components/img/Img';
import DocumentIcon from "../../../common/components/icon/DocumentIcon";
import {documentPush} from "../../../common/utils/overall";
import Profile from "../../../common/components/profile/Profile";
import Collect from "../../../repository/document/collect/components/Collect";
import Share from "../../../repository/document/share/components/Share";
import ListIcon from "../../../common/components/icon/ListIcon";

const Home = (props) => {

    const { findDocumentRecentList, findRecentRepositoryList } = HomeStore;

    const userId = getUser().userId;

    //常用文档
    const [recentViewDocumentList, setRecentViewDocumentList] = useState([]);
    //常用知识库
    const [recentRepositoryDocumentList, setRecentRepositoryDocumentList] = useState([]);
    //常用知识库加载
    const [recentLoading, setRecentLoading] = useState(true);
    //常用文档加载
    const [recentDocLoading, setRecentDocLoading] = useState(true);
    //选中的类型
    const [active,setActive] = useState('common');

    useEffect(() => {
        // 获取最近查看的文档
        findDocumentRecentList({
            masterId: userId,
            model: "document",
            recycle: "0",
            status: "nomal",
            orderParams: [{
                name: "recentTime",
                orderType: "desc"
            }]
        }).then(res => {
            if (res.code === 0) {
                setRecentViewDocumentList([...res.data])
            }
        }).finally(()=>{
            setRecentDocLoading(false)
        })

        // 获取最近查看的知识库
        findRecentRepositoryList({
            masterId: userId,
            model: "repository",
            orderParams: [{
                name: "recentTime",
                orderType: "desc"
            }]
        }).then(res => {
            if (res.code === 0) {
                setRecentRepositoryDocumentList(res.data.slice(0, 5))
            }
        }).finally(()=>{
            setRecentLoading(false)
        })
    }, [])

    // 跳转知识库详情页面
    const goRepositoryDetail = repository => {
        props.history.push(`/repository/${repository.id}/overview`)
    }

    // 跳转文档详情
    const goDocumentDetail = item => {
        documentPush(props.history,item.wikiRepository.id,item)
    }

    return (
        <Row className="home-row">
            <Col
                xxl={{ span: 16, offset: 4 }}
                xl={{ span: 18, offset: 3 }}
                lg={{ span: 18, offset: 3 }}
                md={{ span: 20, offset: 2 }}
                xs={{ span: 24 }}
            >
                <div className='sward-home-limited'>
                    <div className='home-tabs'>
                        <div className={`home-tab ${active==='common' ? 'home-tab-active' : ''}`}
                             onClick={()=>setActive('common')}
                        >
                            常用
                        </div>
                        <div className={`home-tab ${active==='collect' ? 'home-tab-active' : ''}`}
                             onClick={()=>setActive('collect')}
                        >收藏</div>
                        <div className={`home-tab ${active==='share' ? 'home-tab-active' : ''}`}
                             onClick={()=>setActive('share')}
                        >共享</div>
                    </div>
                    {
                        active === 'common' &&
                        <>
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
                                                                <ListIcon
                                                                    icon={item.iconUrl}
                                                                    text={item.name}
                                                                />
                                                                <span className='item-title-name'>{item.name}</span>
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
                                                        <Profile
                                                            userInfo={item.master}
                                                        />
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
                        </>
                    }
                    {
                        active === 'collect' &&
                        <Collect  {...props} />
                    }
                    {
                        active === 'share' &&
                        <Share {...props} type={'home'}/>
                    }
                </div>
            </Col>
        </Row>
    );
}

export default observer(Home);
