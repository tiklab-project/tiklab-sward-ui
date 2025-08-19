/*
 * @Author: 袁婕轩
 * @Date: 2023-01-05 19:06:34
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:04:25
 * @Description: 知识库概况页面
 */
import React, { useState, useEffect, Fragment } from "react";
import { Row, Col, Empty, Spin } from 'antd';
import { withRouter } from "react-router";
import {inject, observer} from "mobx-react";
import Button from "../../../common/components/button/Button";
import "./Survey.scss";
import { getUser } from "tiklab-core-ui";
import SurveyStore from "../store/SurveyStore";
import AddDropDown from "../../common/components/AddDropDown";
import DyncmicTimeAxis from "./DyncmicTimeAxis";
import Img from "../../../common/components/img/Img";
import DocumentIcon from "../../../common/components/icon/DocumentIcon";
import {documentPush} from "../../../common/utils/overall";
import Profile from "../../../common/components/profile/Profile";
import {RightOutlined} from "@ant-design/icons";
import ListIcon from "../../../common/components/icon/ListIcon";

const Survey = (props) => {

    const {repositoryDetailStore} = props;

    const {repository,expandedTree, setExpandedTree} = repositoryDetailStore;
    const {findLogpage, logList, findUserList, findRecentList,
        findCategoryListTreeById, findDocumentFocusPage, opLogCondition } = SurveyStore;

    const repositoryId = props.match.params.repositoryId;
    const userId = getUser().userId;
    //常用
    const [recentViewDocumentList, setRecentViewDocumentList] = useState([]);
    //收藏
    const [focusDocumentList, setFocusDocumentList] = useState([])
    //用户
    const [userList, setUserList] = useState();
    //加载
    const [spinning,setSpinning] = useState({
        logSpinning:true,
        recentSpinning:true,
        collectSpinning:true,
    })

    useEffect(() => {
        //动态
        findLogpage({
            data: { repositoryId: repositoryId },
            pageParam: { ...opLogCondition.pageParam, pageSize: 10 }
        }).finally(()=>{
            setSpinning(pev=>({...pev, logSpinning: false}));
        })
        //常用
        findRecentList({
            masterId: userId,
            model: "document",
            repositoryId: repositoryId,
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
            setSpinning(pev=>({...pev, recentSpinning: false}));
        })
        //收藏
        findDocumentFocusPage({
            masterId: userId,
            repositoryId: repositoryId
        }).then(res => {
            if (res.code === 0) {
                setFocusDocumentList(res.data.dataList)
            }
        }).finally(()=>{
            setSpinning(pev=>({...pev, collectSpinning: false}));
        })
        //用户
        findUserList({ domainId: repositoryId }).then(res => {
            if (res.code === 0) {
                setUserList(res.data)
            }
        })
    }, [repositoryId])

    /**
     * 去文档
     */
    const goDocumentDetail = document => {
        documentPush(props.history,document.wikiRepository.id,document)
        const params = {
            id: document.id,
            treePath: document.treePath
        }
        findCategoryListTreeById(params).then(res => {
            if (res.code === 0) {
                // replaceTree(repositoryCatalogueList, res.data[0])
                if (document.treePath) {
                    const list = document.treePath.split(";")
                    list.pop();
                    let newExpandedTree = [...expandedTree, ...list]
                    // 去重
                    newExpandedTree = Array.from(new Set(newExpandedTree))
                    setExpandedTree(newExpandedTree)
                }
            }
        })
    }

    return (
        <Row className="repository-survey-row">
            <Col
                xl={{ span: 18, offset: 3 }}
                lg={{ span: 18, offset: 3 }}
                md={{ span: 20, offset: 2 }}
                xs={{ span: 24 }}
                className="repository-col"
            >
                <div className="repository-survey">
                    {
                        repository &&
                        <div className="repository-top">
                            <div className="top-left">
                                <ListIcon
                                    icon={repository?.iconUrl}
                                    text={repository?.name}
                                />
                                <div className="top-name">
                                    <div className="name">{repository?.name}</div>
                                    <div className="user">
                                        {
                                            userList && userList.length > 0 && userList.map((item, index) => {
                                                if (index < 5) {
                                                    return <div key={item.id}>
                                                        <Profile userInfo={item.user}/>
                                                    </div>
                                                }
                                            })
                                        }
                                        <div className="user-more" onClick={() => props.history.push(`/repository/${repositoryId}/set/user`)}>
                                            <svg className="user-more-icon" aria-hidden="true">
                                                <use xlinkHref="#icon-more-blue"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="top-right">
                                <AddDropDown category={null} button="text" />
                                <Button>分享</Button>
                            </div>
                        </div>
                    }

                    <div className="home-document">
                        <div className="document-box-title">
                            <span className="name">常用文档</span>
                        </div>
                        <Spin wrapperClassName="document-spin" spinning={spinning.recentSpinning}>
                            {
                                recentViewDocumentList.length > 0 ?
                                    <div>
                                        {
                                            recentViewDocumentList && recentViewDocumentList.map((item, index) => {
                                                if (index < 10) {
                                                    return <div className="document-list-item" key={item.id} >
                                                        <div className='document-item-left'>
                                                            <div>
                                                                <DocumentIcon
                                                                    documentType={item.node?.documentType}
                                                                    documentName={item?.name}
                                                                    className={"document-icon"}
                                                                />
                                                            </div>
                                                            <div className='document-item-text'>
                                                                <div className='document-title' onClick={() => goDocumentDetail(item.node)}>{item.name}</div>
                                                                <div className='document-master'>{item.master.nickname}</div>
                                                            </div>
                                                        </div>
                                                        <div >{item?.recentTime?.slice(0, 10)}</div>
                                                    </div>
                                                }

                                            })
                                        }
                                    </div>
                                    :
                                    <Empty description="暂时没有查看过文档~" />
                            }
                        </Spin>
                    </div>
                    <div className="home-collect">
                        <div className="collect-box-title">
                            <span className="name">收藏</span>
                            <div className="more" onClick={() => { props.history.push(`/repository/${repositoryId}/collect`) }}>
                                <RightOutlined />
                            </div>
                        </div>
                        <Spin spinning={spinning.collectSpinning}>
                            <div className="collect-list">
                                {
                                    focusDocumentList && focusDocumentList.length > 0 ?
                                        focusDocumentList.map(item=>{
                                            return (
                                                <div className="collect-list-item" key={item.id} >
                                                    <div className='collect-list-left'>
                                                        <div>
                                                            <DocumentIcon
                                                                documentType={item.node?.documentType}
                                                                documentName={item?.name}
                                                                className={"collect-icon"}
                                                            />
                                                        </div>
                                                        <div className='collect-item-text'>
                                                            <div className='collect-title' onClick={() => goDocumentDetail(item.node)}>
                                                                {item?.node?.name}
                                                            </div>
                                                            <div className='collect-master'>
                                                                {item.master.nickname}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div >{item?.focusTime?.slice(0, 10)}</div>
                                                </div>
                                            )
                                        })
                                        :
                                        <Empty description="暂时没有收藏~" />
                                }
                            </div>
                        </Spin>
                    </div>
                    <div className="home-dynamic">
                        <div className="dynamic-box-title">
                            <span className="name">动态</span>
                            <div
                                className="more"
                                 onClick={() => {
                                    props.history.push(`/repository/${repositoryId}/dynamicList`) }
                                }
                            >
                                <RightOutlined />
                            </div>
                        </div>
                        <Spin spinning={spinning.logSpinning}>
                            <div className="dynamic-list">
                                {
                                    logList && logList.length > 0 ?
                                        <DyncmicTimeAxis logList={logList} />
                                        :
                                        <Empty description="暂时没有动态~" />
                                }
                            </div>
                        </Spin>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default withRouter(inject('repositoryDetailStore')(observer(Survey)));
