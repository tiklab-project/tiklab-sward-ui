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
import { Empty, Modal, Spin } from "antd";
import { withRouter } from "react-router";
import ImgComponent from "../../../common/imgComponent/ImgComponent";

const Search = (props) => {
    const { isShowText, theme } = props;

    const { findRepositoryListByUser, findNodeList, searchDocumentList, searchWikiList, findDocumentRecentList,
        findRecentRepositoryList } = SearchStore;
    const [searchModal, setSearchModal] = useState(false);
    const [isSeach, setIsSeach] = useState(false);
    const userId = getUser().id;
    const searchBox = useRef();
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
        return null;
    }, [searchModal])

    // 搜索文档
    const changeValue = (value) => {
        search(value)
    }

    // 节流
    const search = useDebounce((value) => {

        const keyWord = value.target.value;
        if (keyWord) {
            setDocloading(true)
            setRepositoryloading(true)
            // 搜索知识库
            findRepositoryListByUser({name: value.target.value}).then(res => {
                if (res.code === 0) {
                    // setDocloading(false)
                    setRepositoryloading(false)
                }
            })

            // 搜索文档
            findNodeList({name: value.target.value, type: "document"}).then(res => {
                if (res.code === 0) {
                    // setDocloading(false)
                    setDocloading(false)
                }
            })
            setIsSeach(true)
        } else {
            findRecent()
            setIsSeach(false)
        }
    }, 500)


    
    const toRepository = (repository) => {
        props.history.push(`/repository/${repository.id}/overview`)
        setSearchModal(false)
    }
    const toWorkItem = (node) => {

        // localStorage.setItem("repository", repository.id)
        if (node.documentType === "document") {
            props.history.push(`/repository/${node.wikiRepository.id}/doc/rich/${node.id}`)
        }
        if (node.documentType === "markdown") {
            props.history.push(`/repository/${node.wikiRepository.id}/doc/markdown/${node.id}`)
        }
        // props.history.push(`/repository/${repository.id}/doc/rich/${id}`)
        setSearchModal(false)
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
                <Modal
                    visible={searchModal}
                    cancelText="取消"
                    onOk={() => setSearchModal(false)}
                    onCancel={() => setSearchModal(false)}
                    okText="确定"
                    width={800}
                    footer={null}
                    className="search-modal"
                    getContainer={() => searchBox.current}
                    closable={false}
                >
                    <div className={`show-box `}>
                        <div className="search-input-box">

                            <svg className="icon-20" aria-hidden="true">
                                <use xlinkHref="#icon-search-default" ></use>
                            </svg>
                            <input
                                className={`search-input`}
                                onChange={changeValue}
                                placeholder="搜索文档，知识库"

                            />
                            <svg className="svg-icon close-icon" aria-hidden="true" onClick={() => setSearchModal(false)}>
                                <use xlinkHref="#icon-close"></use>
                            </svg>
                        </div>
                        {
                            isSeach ? <div className="search-result-box">
                                {
                                    (searchWikiList?.length !== 0 || searchDocumentList?.length !== 0) ? <Fragment>
                                        {
                                            searchWikiList.length > 0 && <div className="sort-box">
                                                <div className="sort-title">知识库</div>
                                                {
                                                    searchWikiList.map((wikiItem) => {
                                                        return <div className="item-box" key={wikiItem.id}>
                                                            <div className="item-one" onClick={() => toRepository(wikiItem)}>
                                                                <ImgComponent
                                                                    src={wikiItem.iconUrl}
                                                                    alt=""
                                                                />
                                                                <span>{wikiItem?.name}</span>
                                                                <div className="item-desc">
                                                                    {wikiItem?.createTime}
                                                                </div>
                                                            </div>


                                                        </div>
                                                    })
                                                }
                                            </div>
                                        }

                                        {
                                            searchDocumentList.length > 0 && <div className="sort-box">
                                                <div className="sort-title">文档</div>
                                                {
                                                    searchDocumentList.map((node) => {
                                                        return <div className="item-box" key={node.id}>
                                                            <div className="item-one" onClick={() => toWorkItem(node)}>
                                                                <svg className="img-icon" aria-hidden="true">
                                                                    <use xlinkHref="#icon-file"></use>
                                                                </svg>
                                                                <span>{node.name}</span>
                                                                <div className="item-desc">
                                                                    {node.wikiRepository.name}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    })
                                                }
                                            </div>
                                        }

                                    </Fragment>
                                        :
                                        <>
                                            {
                                                !docloading && <Empty description="暂时没有数据~" />
                                            }
                                        </>


                                }
                            </div>
                                :
                                <div className="search-result-box">
                                    <div className="sort-box">
                                        <div className="sort-title">常用知识库</div>
                                        <Spin wrapperClassName="search-doc-spin" spinning={repositoryloading} tip="加载中..." >
                                            {
                                                searchWikiList.length > 0 ?
                                                    <>
                                                        {
                                                            searchWikiList.map((wikiItem) => {
                                                                return <div className="item-box" key={wikiItem.id}>
                                                                    <div className="item-one" onClick={() => toRepository(wikiItem)}>
                                                                        <ImgComponent
                                                                            src={wikiItem.iconUrl}
                                                                            alt=""
                                                                        />
                                                                        <span>{wikiItem.name}</span>
                                                                        <div className="item-desc">
                                                                            {wikiItem.createTime}
                                                                        </div>
                                                                    </div>


                                                                </div>
                                                            })
                                                        }
                                                    </>

                                                    :
                                                    <>
                                                        {
                                                            !repositoryloading && <Empty description="暂时没有数据~" />
                                                        }
                                                    </>

                                            }
                                        </Spin>

                                    </div>
                                    <div className="sort-box">
                                        <div className="sort-title">最近查看文档</div>
                                        <Spin wrapperClassName="search-repository-spin" spinning={repositoryloading} tip="加载中..." >
                                            {
                                                searchDocumentList.length > 0 ? <>
                                                    {
                                                        searchDocumentList.map((documentItem) => {
                                                            return <div className="item-box" key={documentItem.id}>
                                                                <div className="item-one" onClick={() => toWorkItem(documentItem.node)}>
                                                                    <svg className="img-icon" aria-hidden="true">
                                                                        <use xlinkHref="#icon-file"></use>
                                                                    </svg>
                                                                    <span>{documentItem.name}</span>
                                                                    <div className="item-desc">
                                                                        {documentItem.wikiRepository?.name}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        })
                                                    }
                                                </>
                                                    :
                                                    <>
                                                        {
                                                            !docloading && <Empty description="暂时没有数据~" />
                                                        }
                                                    </>
                                            }
                                        </Spin>

                                    </div>

                                </div>


                        }

                    </div>
                </Modal>


            </div>
        </div>
    )
}
export default withRouter(observer(Search));