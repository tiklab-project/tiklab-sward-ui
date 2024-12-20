/*
 * @Descripttion: 知识库详情页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-08-30 15:06:15
 */
import React, { useState, useEffect } from "react";
import { Empty, Layout, Spin } from 'antd';
import "./CollectLayout.scss";
import { renderRoutes } from "react-router-config";
import { observer, inject, Provider } from "mobx-react";
import CollectAside from "./CollectAside";
import CollectStore from "../store/CollectStore";
import { getUser } from "tiklab-core-ui";

const CollectLayout = (props) => {
    const { route } = props;
    const [focusDocumentList, setFocusDocumentList] = useState([]);
    const [allFocusDocumentList, setAllFocusDocumentList] = useState([]);
    const { findDocumentFocusList, createRecent, documentCondition } = CollectStore;
    const [selectKey, setSelectKey] = useState(id);
    const userId = getUser().userId;
    const id = props.location.pathname.split("/")[3];
    const [loading, setLoading] = useState(true);
    const repositoryId = props.match.params.repositoryId;

    useEffect(() => {
        const data = {
            masterId: userId,
            repositoryId: repositoryId,
            name: null
        }
        setLoading(true);
        findDocumentFocusList(data).then(res => {
            if (res.code === 0) {
                setAllFocusDocumentList(res.data)
            }
        })
        findList();
        return
    }, [])

    const findList = (data) => {
        findDocumentFocusList(data).then(res => {
            if (res.code === 0) {
                console.log(res)
                setFocusDocumentList(res.data)
                if (res.data.length > 0) {
                    const document = res.data[0]?.node;
                    setSelectKey(document.id);
                    if (document.documentType === "document") {
                        props.history.push(`/repository/${repositoryId}/collect/rich/${document.id}`)
                    }
                    if (document.documentType === "markdown") {
                        props.history.push(`/repository/${repositoryId}/collect/markdown/${document.id}`)
                    }
                }

            }
            setLoading(false)
        })
    }

    return (<>
        <Spin wrapperClassName="collect-spin" spinning={loading} tip="加载中..." >
            {
                allFocusDocumentList?.length > 0 ?
                    <Layout className="collect-layout">
                        <CollectAside
                            focusDocumentList={focusDocumentList}
                            selectKey={selectKey}
                            setSelectKey={setSelectKey}
                            findList={findList}
                            {...props}
                        />
                        {
                            focusDocumentList?.length > 0 ? <Layout className="collect-layout-right">
                                {renderRoutes(route.routes)}
                            </Layout>
                            :
                            <div className="collect-empty">
                                <Empty description="暂无数据" />
                            </div>
                            
                        }

                    </Layout>
                    :
                    <div className="collect-empty">
                        {!loading && <Empty description="暂无收藏文档" />}
                    </div>

            }
        </Spin>

    </>


    )

}
export default observer(CollectLayout);