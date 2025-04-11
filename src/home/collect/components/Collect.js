
/*
 * @Descripttion: 收藏文档列表页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-13 13:29:10
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:39:32
 */
import React, { useEffect, useState } from "react";
import "./Collect.scss";
import { Col, Empty, Row } from "antd";
import { getUser } from "tiklab-core-ui";
import CollectStore from "../store/CollectStore";
import SearchInput from "../../../common/components/search/SearchInput";
import { useDebounce } from "../../../common/utils/debounce";
import PaginationCommon from "../../../common/components/page/Page";

const Collect = (props) => {
    const { findDocumentFocusPage, documentCondition } = CollectStore;
    const userId = getUser().userId;
    const [focusDocumentList, setFocusDocumentList] = useState([]);

    useEffect(() => {
        const data = {
            masterId: userId
        }
        // 获取收藏的文档列表
        findDocumentFocusPage(data).then(res => {
            if (res.code === 0) {
                console.log(res)
                setFocusDocumentList(res.data.dataList)
            }

        })


        return
    }, [])


    // 跳转到文档页面
    const goFocusDocumentDetail = item => {
        if (item.documentType === "document") {
            props.history.push(`/repository/${item.wikiRepository.id}/collect/doc/${item.id}`)
        }
        if (item.documentType === "markdown") {
            props.history.push(`/repository/${item.wikiRepository.id}/collect/markdown/${item.id}`)
        }
        sessionStorage.setItem("menuKey", "repository")
    }

    // 搜索文档
    const onSearch = useDebounce(value => {
        const data = {
            name: value
        }
        findDocumentFocusPage(data).then(res => {
            if (res.code === 0) {
                setFocusDocumentList(res.data.dataList)
            }

        })
    }, [500]);

    // 翻页
    const onPageChange = (currentPage) => {
        const data = {
            pageParam: {
                ...documentCondition.pageParam,
                currentPage: currentPage,

            }
        }
        findDocumentFocusPage(data).then(res => {
            if (res.code === 0) {
                setFocusDocumentList(res.data.dataList)
            }

        })
    }
    return (
        <Row className="collect-row">
            <Col xxl={{ span: 14, offset: 5 }} xl={{ span: 14, offset: 5 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }} className="home-col">
                <div className="home-document focus-document">
                    <div className="document-box-title">
                        <span className="name">收藏文档</span>
                        <div className="document-focus-search">
                            <SearchInput onChange={(value) => onSearch(value)} placeholder={"搜索文档"} />
                        </div>
                    </div>
                    <div>
                        {
                            focusDocumentList && focusDocumentList.length > 0 ? focusDocumentList.map((item) => {
                                return <div className="document-list-item" key={item.id} >
                                    <div className='document-item-left' style={{ flex: 1 }}>
                                        <div>
                                            {/* <svg className="document-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-file"></use>
                                </svg> */}
                                            {
                                                item.node.documentType === "document" && <svg className="document-icon" aria-hidden="true">
                                                    <use xlinkHref="#icon-file"></use>
                                                </svg>
                                            }
                                            {
                                                item.node.documentType === "markdown" && <svg className="document-icon" aria-hidden="true">
                                                    <use xlinkHref="#icon-minmap"></use>
                                                </svg>
                                            }
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
                    <PaginationCommon
                        currentPage={documentCondition.pageParam.currentPage}
                        changePage={(currentPage) => onPageChange(currentPage)}
                        totalPage={documentCondition.pageParam.totalPage}
                        total={documentCondition.pageParam.total}
                        refresh={() => onPageChange(1)}
                        showRefresh={true}
                    />
                </div>
            </Col>
        </Row>

    )
}
export default Collect;
