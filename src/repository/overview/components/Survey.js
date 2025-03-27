/*
 * @Author: 袁婕轩
 * @Date: 2023-01-05 19:06:34
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:04:25
 * @Description: 知识库概况页面
 */
import React, { useState, useEffect, Fragment } from "react";
import { Row, Col, Form, Dropdown, Menu, Empty, Spin } from 'antd';
import { withRouter } from "react-router";
import {inject, observer} from "mobx-react";
import Button from "../../../common/button/Button";
import UserIcon from "../../../common/UserIcon/UserIcon";
import "./Survey.scss";
import { getUser } from "tiklab-core-ui";
import SurveyStore from "../store/SurveyStore";
import AddDropDown from "../../common/components/AddDropDown";
import DyncmicTimeAxis from "./DyncmicTimeAxis";
import ImgComponent from "../../../common/imgComponent/ImgComponent";

const Survey = (props) => {

    const {repositoryDetailStore} = props;

    const {repository,expandedTree, setExpandedTree} = repositoryDetailStore;
    const {findLogpage, logList, findUserList, findRecentList,
        findCategoryListTreeById, findDocumentFocusPage, opLogCondition } = SurveyStore;

    const repositoryId = props.match.params.repositoryId
    const [recentViewDocumentList, setRecentViewDocumentList] = useState([]);
    const [focusDocumentList, setFocusDocumentList] = useState([])
    const [userList, setUserList] = useState();
    const userId = getUser().userId;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        findLogpage({ data: { repositoryId: repositoryId }, pageParam: { ...opLogCondition.pageParam, pageSize: 10 } })
        const recentParams = {
            masterId: userId,
            model: "document",
            repositoryId: repositoryId,
            recycle: "0",
            status: "nomal",
            orderParams: [{
                name: "recentTime",
                orderType: "desc"
            }]
        }
        setLoading(true)
        findRecentList(recentParams).then(res => {
            if (res.code === 0) {
                setRecentViewDocumentList([...res.data])
                setLoading(false)
            }
        })
        const data = {
            masterId: userId,
            repositoryId: repositoryId
        }
        findDocumentFocusPage(data).then(res => {
            if (res.code === 0) {
                console.log(res)
                setFocusDocumentList(res.data.dataList)
            }
        })
        findUserList({ domainId: repositoryId }).then(res => {
            if (res.code === 0) {
                setUserList(res.data)
            }
        })
    }, [repositoryId])

    const goDocumentDetail = document => {
        if (document.documentType === "document") {
            props.history.push(`/repository/${document.wikiRepository.id}/doc/rich/${document.id}`)
        }
        if (document.documentType === "markdown") {
            props.history.push(`/repository/${document.wikiRepository.id}/doc/markdown/${document.id}`)
        }
        if (document.documentType === "file") {
            props.history.push(`/repository/${document.wikiRepository.id}/doc/file/${document.id}`)
        }
        if (document.type === "category") {
            props.history.push(`/repository/${document.wikiRepository.id}/doc/folder/${document.id}`)
        }
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
            <Col xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }} className="repository-col">
                <div className="repository-survey">
                    {
                        repository && <Fragment>
                            <div className="repository-top">
                                <div className="top-left">
                                    <div>
                                        <ImgComponent
                                            src={repository.iconUrl}
                                            alt=""
                                            className="repository-icon"
                                        />
                                    </div>
                                    <div className="top-name">
                                        <div className="name">{repository?.name}</div>
                                        <div className="user">
                                            {
                                                userList && userList.length > 0 && userList.map((item, index) => {
                                                    if (index < 5) {
                                                        return <div key={item.id}><UserIcon size="big" name={item.user.nickname}></UserIcon></div>
                                                    }

                                                })
                                            }
                                            <div className="user-more" onClick={() => props.history.push(`/repository/${repositoryId}/set/user`)}>
                                                <svg className="user-more-icon" aria-hidden="true">
                                                    <use xlinkHref="#icon-more-blue"></use>
                                                </svg>
                                            </div>
                                        </div>
                                        {/* <div className="desc">
                                            <span>
                                                目录 {repositoryInfo.categoryNum ? repositoryInfo.categoryNum : 0}
                                            </span>
                                            <span>
                                                文档 {repositoryInfo.documentNum ? repositoryInfo.documentNum : 0}
                                            </span>

                                        </div> */}
                                    </div>
                                </div>
                                <div className="top-right">
                                    <AddDropDown category={null} isButton={true} button="text" />
                                    <Button>分享</Button>
                                </div>
                            </div>
                        </Fragment>
                    }

                    <div className="home-document">
                        <div className="document-box-title">
                            <span className="name">常用文档</span>
                        </div>
                        <Spin wrapperClassName="document-spin" spinning={loading} tip="加载中..." >
                            {
                                recentViewDocumentList.length > 0 ? <div>
                                    {
                                        recentViewDocumentList && recentViewDocumentList.map((item, index) => {
                                            if (index < 10) {
                                                return <div className="document-list-item" key={item.id} >
                                                    <div className='document-item-left'>
                                                        <div>
                                                            {
                                                                item.node.documentType === "markdown" &&
                                                                <svg className="document-icon" aria-hidden="true">
                                                                    <use xlinkHref="#icon-minmap"></use>
                                                                </svg>
                                                            }
                                                            {
                                                                item.node.documentType === "document" &&
                                                                <svg className="document-icon" aria-hidden="true">
                                                                    <use xlinkHref="#icon-file"></use>
                                                                </svg>
                                                            }
                                                            {
                                                                item.node.documentType === "file" &&
                                                                <svg className="document-icon" aria-hidden="true">
                                                                    <use xlinkHref="#icon-file"></use>
                                                                </svg>
                                                            }
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
                                    <>
                                        {
                                            !loading && <Empty description="暂时没有查看过文档~" />
                                        }
                                    </>

                            }
                        </Spin>
                    </div>

                    <div className="home-dynamic">
                        <div className="dynamic-box-title">
                            <span className="name">最新动态</span>
                            <div className="more" onClick={() => { props.history.push(`/repository/${repositoryId}/dynamicList`) }}>
                                <svg aria-hidden="true" className="svg-icon">
                                    <use xlinkHref="#icon-rightjump"></use>
                                </svg>
                            </div>
                        </div>
                        <div className="dynamic-list">
                            {
                                logList && logList.length > 0 ? <DyncmicTimeAxis logList={logList} /> : <Empty description="暂时没有动态~" />
                            }
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default withRouter(inject('repositoryDetailStore')(observer(Survey)));
