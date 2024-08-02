import React, { Fragment, useEffect, useState, useRef } from "react";
import { SearchOutlined } from '@ant-design/icons';
import "../components/Search.scss"
import SearchStore from "../store/Search";
import { observer } from "mobx-react";
import { useDebounce, useThrottle } from "../../../common/utils/debounce";
import { getUser } from "thoughtware-core-ui";
import { Empty } from "antd";
import { withRouter } from "react-router";
const Search = (props) => {
    const { getSearch, searchDocumentList, searchWikiList, getSearchSore, setKeyWord, findDocumentRecentList, 
        findRecentRepositoryList } = SearchStore;
    const [show, setShow] = useState(false);
    const [isSeach, setIsSeach] = useState(false);
    const dropDown = useRef();
    const userId = getUser().id;
    const tenant = getUser().tenant;
    const inputRef = useRef();
    const [showLong, setShowLong] = useState(false)

    const findRecent = () => {
        const recentParams = {
            masterId: userId,
            model: "document",
            orderParams: [{
                name: "recentTime",
                orderType: "asc"
            }]
        }
        findDocumentRecentList(recentParams)
        findRecentRepositoryList({ model: "repository" })

    }
    
    // 输入中
    const changeValue = (value) => {

        search(value)
    }

    // 防抖
    const search = useDebounce((value) => {
        const keyWord = value.target.value;
        if (keyWord) {
            getSearch(value.target.value)
            setIsSeach(true)
        } else {
            findRecent()
            setIsSeach(false)
        }
        setShow(true)
    }, 500)
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [show])

    const closeModal = (e) => {
        if (!dropDown.current) {
            return;
        }
        if (!dropDown.current.contains(e.target) && dropDown.current !== e.target) {
            setShow(false)
        }
    }


    const toRepository = (repository) => {
        props.history.push(`/index/repositorydetail/${repository.id}/survey`)
        setShow(false)
    }
    const toWorkItem =  (id, repository) => {

        // localStorage.setItem("repository", repository.id)
        props.history.push(`/index/repositorydetail/${repository.id}/doc/${id}`)
        setShow(false)
    }

    const submit = (value) => {
        if (value.keyCode === 13) {
            getSearchSore(value.target.value)
            setKeyWord(value.target.value)
            props.history.push("/searchResult")
            setShow(false)
        }
    }

    const showBox = () => {
        const keyWord = inputRef.current.value;
        if (keyWord) {
            getSearch(keyWord)
            setIsSeach(true)
        } else {
            findRecent()
            setIsSeach(false)
        }
        setShow(true)
    }
    return (
        <Fragment>
            <div className="search"
                tabIndex="-1"
                onMouseEnter={() => setShowLong(true)}
                onMouseLeave={() => { setShowLong(false); setShow(false) }}
               
                ref={dropDown}
            >
                <div className={`search-box ${!showLong ? "short-box" : "long-box"}`} >
                    <input
                        className={`search-box-input ${showLong ? "show-input" : "hidden-input"}`}
                        onChange={changeValue}
                        onFocus={showBox}
                        ref={inputRef}
                        placeholder="搜索文档、知识库"

                    />
                    {
                        !showLong ? <svg className="img-25" aria-hidden="true">
                            <use xlinkHref="#icon-searchtop" ></use>
                        </svg>
                            :
                            <svg className="img-icon" aria-hidden="true">
                                <use xlinkHref="#icon-searchtop" ></use>
                            </svg>
                    }

                </div>
                <div className={`show-box ${(show === true) ? null : "hidden-box"}`}>
                    {
                        isSeach ? <>
                            {
                                (searchWikiList?.length !== 0 || searchDocumentList?.length !== 0) ? <Fragment>
                                    {
                                        searchWikiList.length > 0 && <div className="sort-box">
                                            <div className="sort-title">知识库</div>
                                            {
                                                searchWikiList.map((wikiItem) => {
                                                    return <div className="item-box" key={wikiItem.id}>
                                                        <div className="item-one" onClick={() => toRepository(wikiItem)}>
                                                            <img
                                                                src={version === "cloud" ? (upload_url + wikiItem.iconUrl + "?tenant=" + tenant) : (upload_url + wikiItem.iconUrl)}
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
                                        </div>
                                    }

                                    {
                                        searchDocumentList.length > 0 && <div className="sort-box">
                                            <div className="sort-title">文档</div>
                                            {
                                                searchDocumentList.map((documentItem) => {
                                                    return <div className="item-box" key={documentItem.id}>
                                                        <div className="item-one" onClick={() => toWorkItem(documentItem.id, documentItem.wikiRepository)}>
                                                            <svg className="img-icon" aria-hidden="true">
                                                                <use xlinkHref="#icon-file"></use>
                                                            </svg>
                                                            <span>{documentItem.name}</span>
                                                            <div className="item-desc">
                                                                {documentItem.wikiRepository.name}
                                                            </div>
                                                        </div>

                                                    </div>
                                                })
                                            }
                                        </div>
                                    }

                                </Fragment>
                                    :
                                    <Empty image="/images/nodata.png" description="暂时没有数据~" />
                            }
                        </>
                            :
                            <Fragment>
                                <div className="sort-box">
                                    <div className="sort-title">常用知识库</div>
                                    {
                                        searchWikiList.length > 0 ?
                                            <>
                                                {
                                                    searchWikiList.map((wikiItem) => {
                                                        return <div className="item-box" key={wikiItem.id}>
                                                            <div className="item-one" onClick={() => toRepository(wikiItem)}>
                                                                <img
                                                                    src={version === "cloud" ? (upload_url + wikiItem.iconUrl + "?tenant=" + tenant) : (upload_url + wikiItem.iconUrl)}
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
                                            <Empty image="/images/nodata.png" description="暂时没有数据~" />
                                    }
                                </div>
                                <div className="sort-box">
                                    <div className="sort-title">最近查看文档</div>
                                    {
                                        searchDocumentList.length > 0 ? <>
                                            {
                                                searchDocumentList.map((documentItem) => {
                                                    return <div className="item-box" key={documentItem.id}>
                                                        <div className="item-one" onClick={() => toWorkItem(documentItem.modelId, documentItem.wikiRepository)}>
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
                                            <Empty image="/images/nodata.png" description="暂时没有数据~" />
                                    }
                                </div>

                            </Fragment>


                    }

                </div>

            </div>
        </Fragment>
    )
}
export default withRouter(observer(Search));