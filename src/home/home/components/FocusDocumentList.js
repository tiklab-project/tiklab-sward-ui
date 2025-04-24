/*
 * @Descripttion: 首页跳转的收藏页面，暂时不用
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:49:19
 */
import React, { useEffect, useState } from "react";
import Breadcumb from "../../../common/components/breadcrumb/Breadcrumb";
import { inject, observer } from "mobx-react";
import { getUser } from "tiklab-core-ui";
import { Row, Col, Empty, Pagination } from "antd";
import "./FocusDocumentList.scss";
import HomeStore from "../store/HomeStore";
import {documentPush} from "../../../common/utils/overall";
import DocumentIcon from "../../../common/components/icon/DocumentIcon";

const FocusDocumentList = (props) => {

    const { findDocumentFocusPage, focusTotal, focusCondition } = HomeStore;
    const userId = getUser().userId;
    const [firstText, setFirstText] = useState();
    const repositoryId = props.match.params.repositoryId;
    const [focusDocumentList, setFocusDocumentList] = useState([])

    useEffect(() => {
        if (props.route.path === "/focusDocumentList") {
            setFirstText("首页")
            const data = {
                masterId: userId,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                }
            }
            findDocumentFocusPage(data).then(res => {
                if (res.code === 0) {
                    console.log(res)
                    setFocusDocumentList(res.data.dataList)
                }

            })
        }
        if (props.route.path === "/repository/:repositoryId/focusDocumentList") {
            setFirstText("知识库概况")
            const data = {
                masterId: userId,
                repositoryId: repositoryId,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                }
            }
            findDocumentFocusPage(data).then(res => {
                if (res.code === 0) {
                    console.log(res)
                    setFocusDocumentList(res.data.dataList)
                }
            })
        }
    }, [])

    const goFocusDocumentDetail = item => {
        documentPush(props.history,item.wikiRepository.id,item)
        sessionStorage.setItem("menuKey", "repository")
    }

    const onPageChange = (page) => {
        const params = {
            pageParam: {
                pageSize: 20,
                currentPage: page
            }
        }
        findDocumentFocusPage(params).then(res => {
            if (res.code === 0) {
                console.log(res)
                setFocusDocumentList(res.data.dataList)
            }
        })
    }

    return (
        <Row className="focus-row">
            <Col xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }} className="focus-col">
                <div className="focus-list-page">
                    <div className="focus-list-top">
                        <Breadcumb
                            {...props}
                            firstText={firstText}
                            secondText="收藏"
                        />
                    </div>
                    <div>
                        {
                            focusDocumentList && focusDocumentList.length > 0 ?
                                focusDocumentList.map((item) => {
                                    return <div className="document-list-item" key={item.id} >
                                        <div className='document-item-left' style={{ flex: 1 }}>
                                            <div>
                                                <DocumentIcon
                                                    documentType={item.node?.documentType}
                                                    documentName={item.node?.name}
                                                    className={"document-icon"}
                                                />
                                            </div>
                                            <div className="document-item-text">
                                                <div className="document-title" onClick={() => goFocusDocumentDetail(item.node)}>{item.node.name}</div>
                                                <div className="document-master" style={{ flex: 1 }}>{item.wikiRepository?.name}</div>
                                            </div>
                                        </div>
                                        <div className="document-repository">{item.master.nickname}</div>
                                        <div className="document-time">{item.focusTime}</div>
                                    </div>
                                })
                                :
                                <Empty description="暂时没有数据~" />
                        }
                    </div>
                    {
                        focusTotal > 0 &&
                        <div className="focus-pagination">
                            <Pagination
                                onChange={onPageChange}
                                simple
                                defaultCurrent={1}
                                total={focusTotal}
                                current={focusCondition.pageParam.currentPage}
                                // showSizeChanger={false}
                                // defaultPageSize={20}
                                pageSize={focusCondition.pageParam.pageSize}
                                hideOnSinglePage = {true}
                                showQuickJumper = {false}
                            />
                        </div>
                    }
                </div>
            </Col>
        </Row>
    )
}
export default observer(FocusDocumentList);
