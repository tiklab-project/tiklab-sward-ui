/*
 * @Descripttion: 搜索组件
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 16:20:39
 */
import React, { Fragment, useEffect, useState, useRef } from "react";
import "../components/Search.scss"
import SearchStore from "../store/Search";
import { observer } from "mobx-react";
import { useDebounce } from "../../../common/utils/debounce";
import { getUser } from "tiklab-core-ui";
import {Empty, Input, Spin} from "antd";
import { withRouter } from "react-router";
import Img from "../../../common/components/img/Img";
import DocumentIcon from "../../../common/components/icon/DocumentIcon";
import {documentPush} from "../../../common/utils/overall";
import BaseModal from "../../../common/components/modal/Modal";

const Search = (props) => {
    const { isShowText, theme } = props;

    const { findRepositoryListByUser, findNodeList, searchDocumentList, searchWikiList, findDocumentRecentList,
        findRecentRepositoryList ,getSearch } = SearchStore;
    const [searchModal, setSearchModal] = useState(false);
    const [isSeach, setIsSeach] = useState(false);
    const userId = getUser().id;
    const searchBox = useRef();
    const [inputValue,setInputValue] = useState('');
    const [repositoryloading, setRepositoryloading] = useState(true)
    const [docloading, setDocloading] = useState(true)
    const findRecent = () => {
        const recentParams = {
            masterId: userId,
            model: "document",
            recycle: "0",
            status: "nomal",
            orderParams: [{
                name: "recentTime",
                orderType: "asc"
            }]
        }
        setDocloading(true)
        setRepositoryloading(true)
        // 查找最近查看的文档
        findDocumentRecentList(recentParams).then(res => {
            if (res.code === 0) {
                setDocloading(false)
            }
        })

        // 查找最近查看的知识库
        findRecentRepositoryList({ model: "repository" }).then(res => {
            if (res.code === 0) {
                setRepositoryloading(false)
            }
        })
    }

    useEffect(() => {
        if (searchModal) {
            findRecent()
        }
    }, [searchModal])

    // 搜索文档
    const changeValue = (value) => {
        setInputValue(value.target.value)
        search(value)
    }

    // 节流
    const search = useDebounce((value) => {
        const keyWord = value.target.value;
        if (keyWord) {
            setDocloading(true)
            setRepositoryloading(true)
            // // 搜索知识库
            // findRepositoryListByUser({name: value.target.value}).then(res => {
            //     if (res.code === 0) {
            //         // setDocloading(false)
            //         setRepositoryloading(false)
            //     }
            // })
            //
            // // 搜索文档
            // findNodeList({name: value.target.value, type: "document"}).then(res => {
            //     if (res.code === 0) {
            //         // setDocloading(false)
            //         setDocloading(false)
            //     }
            // })
            getSearch(keyWord).then(res=>{

            }).finally(()=>{
                setRepositoryloading(false)
                setDocloading(false)
            })
            setIsSeach(true)
        } else {
            findRecent()
            setIsSeach(false)
        }
    }, 500)

    const toRepository = (repository) => {
        props.history.push(`/repository/${repository.id}/overview`)
        handelCancel()
    }

    const toWorkItem = (node) => {
        documentPush(props.history,node.wikiRepository.id,node)
        handelCancel()
    }

    /**
     * 关闭弹出框
     */
    const handelCancel = () => {
        setInputValue("");
        setSearchModal(false);
        setIsSeach(false);
    }

    return (
        <div>
            {
                isShowText ?
                    <div className="search-text first-menu-text-item" onClick={() => setSearchModal(true)}>
                        <svg className="icon-18" aria-hidden="true">
                            <use xlinkHref={`#icon-search-${theme}`} ></use>
                        </svg>
                        <div>搜索</div>
                    </div>
                    :
                    <div className="first-menu-link-item" onClick={() => setSearchModal(true)}>
                        <svg className="icon-18" aria-hidden="true">
                            <use xlinkHref={`#icon-search-${theme}`} ></use>
                        </svg>
                        <div>搜索</div>
                    </div>
            }
            <div ref={searchBox}>
                <BaseModal
                    visible={searchModal}
                    onOk={handelCancel}
                    onCancel={handelCancel}
                    width={800}
                    footer={null}
                    getContainer={() =>searchBox.current}
                    className="search-modal"
                >
                    <div className="show-box">
                        <div className="search-input-box">
                            <svg className="icon-20" aria-hidden="true">
                                <use xlinkHref="#icon-search-default" ></use>
                            </svg>
                            <Input
                                bordered={false}
                                allowClear
                                placeholder="搜索文档，知识库"
                                value={inputValue}
                                onChange={changeValue}
                                key={"search"}
                            />
                            <svg className="svg-icon close-icon" aria-hidden="true" onClick={handelCancel}>
                                <use xlinkHref="#icon-close"></use>
                            </svg>
                        </div>
                        {
                            isSeach ?
                                <div className="search-result-box">
                                <Spin spinning={repositoryloading}>
                                    {
                                        (searchWikiList?.length !== 0 || searchDocumentList?.length !== 0) ?
                                            <Fragment>
                                                {
                                                    searchWikiList.length > 0 &&
                                                    <div className="sort-box">
                                                        <div className="sort-title">知识库</div>
                                                        <div className="search-doc-spin">
                                                            {
                                                                searchWikiList.map((wikiItem) => {
                                                                    return (
                                                                        <div className="item-box" key={wikiItem.id}>
                                                                            <div className="item-one" onClick={() => toRepository(wikiItem)}>
                                                                                <Img
                                                                                    src={wikiItem.iconUrl}
                                                                                    alt=""
                                                                                />
                                                                                <span>{wikiItem?.name}</span>
                                                                                <div className="item-desc">
                                                                                    {wikiItem?.createTime}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    searchDocumentList.length > 0 &&
                                                    <div className="sort-box">
                                                        <div className="sort-title">文档</div>
                                                        {
                                                            searchDocumentList.map((documentItem) => {
                                                                const {node = {}} = documentItem;
                                                                const documentType = node?.documentType || 'document';
                                                                return (
                                                                    <div className="item-box" key={documentItem.id}>
                                                                        <div className="item-one" onClick={() => toWorkItem(node)}>
                                                                            <DocumentIcon
                                                                                documentName={node.name}
                                                                                documentType={documentType}
                                                                                className={"img-icon"}
                                                                            />
                                                                            <span>{node?.name}</span>
                                                                            <div className="item-desc">
                                                                                {node?.wikiRepository?.name}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                }
                                            </Fragment>
                                            :
                                            <Empty description="暂时没有数据~" />
                                    }
                                </Spin>
                            </div>
                            :
                            <div className="search-result-box">
                                <div className="sort-box">
                                    <div className="sort-title">常用知识库</div>
                                    <Spin wrapperClassName="search-doc-spin" spinning={repositoryloading}>
                                        {
                                            searchWikiList.length > 0 ?
                                                searchWikiList.map((wikiItem) => {
                                                    return (
                                                        <div className="item-box" key={wikiItem.id}>
                                                            <div className="item-one" onClick={() => toRepository(wikiItem)}>
                                                                <Img
                                                                    src={wikiItem.iconUrl}
                                                                    alt=""
                                                                />
                                                                <span>{wikiItem.name}</span>
                                                                <div className="item-desc">
                                                                    {wikiItem.createTime}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                :
                                                <Empty description="暂时没有数据~" />
                                        }
                                    </Spin>
                                </div>
                                <div className="sort-box">
                                    <div className="sort-title">最近查看文档</div>
                                    <Spin wrapperClassName="search-repository-spin" spinning={docloading} >
                                        {
                                            searchDocumentList.length > 0 ?
                                                searchDocumentList.map((documentItem) => {
                                                    const documentType = documentItem?.node?.documentType || 'document';
                                                    return (
                                                        <div className="item-box" key={documentItem.id}>
                                                            <div className="item-one" onClick={() => toWorkItem(documentItem.node)}>
                                                                <DocumentIcon
                                                                    documentName={documentItem.name}
                                                                    documentType={documentType}
                                                                    className={"img-icon"}
                                                                />
                                                                <span>{documentItem.name}</span>
                                                                <div className="item-desc">
                                                                    {documentItem.wikiRepository?.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                :
                                                <Empty description="暂时没有数据~" />
                                        }
                                    </Spin>
                                </div>
                            </div>
                        }
                    </div>
                </BaseModal>
            </div>
        </div>
    )
}
export default withRouter(observer(Search));
