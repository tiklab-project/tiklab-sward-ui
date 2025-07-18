/*
 * @Descripttion: 目录详情
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-31 09:03:31
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 16:57:33
 */
import React, { useState, useEffect, Fragment } from "react";
import { Form, Row, Col, Empty } from 'antd';
import "./CategoryDetail.scss"
import { observer, Provider } from "mobx-react";
import { getUser } from "tiklab-core-ui";
import RepositoryDetailStore from "../../common/store/RepositoryDetailStore";
import AddDropDown from "../../common/components/AddDropDown";
import {documentPush} from "../../../common/utils/overall";
import DocumentIcon from "../../../common/components/icon/DocumentIcon";

const CategoryDetail = (props) => {

    const store = {
        repositoryDetailStore: RepositoryDetailStore
    }
    const { findCategory, findNodeList, createRecent, setCategoryTitle, categoryTitle} = RepositoryDetailStore
    const categoryId = props.match.params.id;
    const repositoryId = props.match.params.repositoryId;
    const userId = getUser().userId;

    const [logList, setLogList] = useState();
    const [logDetail, setLogDetail] = useState();

    useEffect(() => {
        findCategory({ id: categoryId }).then(data => {
            if (data.code === 0) {
                setLogDetail(data.data?.node)
                setCategoryTitle(data.data?.node.name)
            }
        })
        findNodeList({ parentId: categoryId }).then(data => {
            setLogList(data.data)
        })
    }, [categoryId])

    const goToDocument = (item) => {
        const params = {
            name: item.name,
            model: item.documentType,
            modelId: item.id,
            master: { id: userId },
            wikiRepository: { id: repositoryId }
        }
        createRecent(params)
        if (item.type === "category") {
            localStorage.setItem("categoryId", item.id);
        }
        documentPush(props.history,repositoryId,item)
    }

    return (
        <Provider {...store}>
            <Row className="log-detail">
                <Col xs={24} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="log-detail-content">
                        {
                            logDetail &&
                            <div className="log-title">
                                <svg className="title-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-folder"></use>
                                </svg>
                                <div className="title-name">
                                    <div className="name">{categoryTitle}</div>
                                    <div className="master">{logDetail.master.nickname}</div>
                                </div>
                                <AddDropDown category={logDetail} button="text" />
                            </div>
                        }
                        <div className="log-child">
                            {
                                logList && logList.length > 0 ?
                                    logList.map(item => {
                                        return <div className="log-child-list" key={item.id} onClick={() => goToDocument(item)}>
                                            <div className="log-child-title" style={{ flex: 1 }}>
                                                <div>
                                                    <DocumentIcon
                                                        type={item.type}
                                                        documentType={item?.documentType}
                                                        documentName={item?.name}
                                                        className={"list-img"}
                                                    />
                                                </div>
                                                <div className="log-child-info">
                                                    <div className="log-child-name" title={item.name}>{item.name}</div>
                                                    <div className="log-child-master" style={{ width: "100px" }}>{item.master.nickname}</div>
                                                </div>
                                            </div>
                                            <div >{item.createTime?.slice(0, 10)}</div>
                                        </div>
                                    })
                                    :
                                    <Empty description="暂时没有内容~" />
                            }
                        </div>
                    </div>
                </Col>
            </Row>
        </Provider>
    )
}

export default observer(CategoryDetail);
