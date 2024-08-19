/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-31 09:03:31
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-22 14:04:36
 */
import React, { useState, useEffect, Fragment } from "react";
import { Row, Col, Empty } from 'antd';
import "./ShareCategoryDetail.scss"
import { observer, inject } from "mobx-react";
import { nodata } from "../../../assets/image";
const ShareCategoryDetail = (props) => {
    const { shareStore } = props;
    const { findCategory, findNodeList } = shareStore;
    const categoryId = props.match.params.id;
    const [logList, setLogList] = useState();
    const [logDetail, setLogDetail] = useState();
    // 当前知识库id
    const shareId = props.match.params.shareId;

    useEffect(() => {
        findCategory({ id: categoryId }).then(data => {
            if (data.code === 0) {
                setLogDetail(data.data?.node)
            }
        })
        findNodeList({ parentId: categoryId }).then(data => {
            setLogList(data.data)
        })
        return;
    }, [categoryId])

    // 当前选中目录id
    const [selectKey, setSelectKey] = useState();


    const goToDocument = (item) => {
        setSelectKey(item.id)
        if (item.type === "category") {
            props.history.push(`/share/${shareId}/category/${item.id}`)
        }
        if (item.documentType === "document") {
            props.history.push(`/share/${shareId}/doc/${item.id}`)
        }
    }

    return (
        <Row className="log-detail">
            <Col lg={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="log-detail-content">
                    {
                        logDetail && <Fragment>
                            <div className="log-title">

                                <div className="title-left">
                                    <svg className="title-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-folder"></use>
                                    </svg>
                                    <div className="title-name">
                                        <div className="name">{logDetail.name}</div>
                                        <div className="master">{logDetail.master.name}</div>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    }

                    <div className="log-child">
                        {
                            logList && logList.length > 0 ? logList.map(item => {
                                return <div className="log-child-list" key={item.id} onClick={() => goToDocument(item)}>
                                    <div className="log-child-title" style={{ flex: 1 }}>
                                        {
                                            item.type && item.type === "category" &&
                                            <svg className="list-img" aria-hidden="true">
                                                <use xlinkHref="#icon-folder"></use>
                                            </svg>
                                        }
                                        {
                                            item.type && item.type === "document" && item.documentType === "markdown" &&
                                            <svg className="list-img" aria-hidden="true">
                                                <use xlinkHref="#icon-minmap"></use>
                                            </svg>
                                        }
                                        {
                                            item.type && item.type === "document" && item.documentType === "document" &&
                                            <svg className="list-img" aria-hidden="true">
                                                <use xlinkHref="#icon-file"></use>
                                            </svg>
                                        }
                                        <div className="log-child-info">
                                            <div className="log-child-name" title={item.name}>{item.name}</div>
                                            <div className="log-child-master" style={{ width: "100px" }}>{item.master.nickname}</div>
                                        </div>

                                    </div>

                                    <div >{item.createTime}</div>
                                </div>
                            })
                                :
                                <Empty description="暂时没有内容~" />
                        }
                    </div>

                </div>
            </Col>
        </Row>
    )
}
export default inject("shareStore")(observer(ShareCategoryDetail));