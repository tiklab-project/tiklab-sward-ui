/*
 * @Descripttion: 搜索弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:30:32
 */
import { Empty, Input, Modal } from 'antd';
import React, { Fragment, useState, useEffect, useId, useRef } from 'react';
import "./SearchModal.scss";
import { getUser } from 'tiklab-core-ui';
import { withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { useDebounce } from '../../../common/utils/debounce';
const SearchModal = (props) => {
    const { showSearchModal, setShowSearchModal, repositoryId, repositoryDetailStore } = props;
    const {findRecentList, searchRepositoryDocument, findNodeList} = repositoryDetailStore;
    const [recentDocumentList, setRecentDocumentList] = useState([]);
    const [searchDocumentList, setSearchDocumentList] = useState([])
    const [isSearch, setIsSeach] = useState(false)
    const userId = getUser().userId;
    
    const toWorkItem = (item) => {
        if (item.documentType === "document") {
            props.history.push(`/repository/${repositoryId}/doc/rich/${item.id}`)
        }
        if (item.documentType === "markdown") {
            props.history.push(`/repository/${repositoryId}/doc/markdown/${item.id}`)
        }
        setShowSearchModal(false)

    }

    useEffect(()=> {
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
        findRecentList(recentParams).then(res => {
            if (res.code === 0) {
                setRecentDocumentList([...res.data])
            }

        })
        return null;
    }, [])

    const searchDocument = useDebounce((value) => {
        const keyWord = value.target.value;
        if(keyWord){
            setIsSeach(true)
            const param = {
                repositoryId: repositoryId,
                name: keyWord
            }
            findNodeList(param).then(res => {
                console.log(res)
                if(res.code === 0){
                    setSearchDocumentList(res.data)
                }
            })
            // searchRepositoryDocument(param).then(res => {
            //     console.log(res)
            //     if(res.code === 0){
            //         setSearchDocumentList(res.data)
            //     }
            // })
        }else {
            setIsSeach(false)
        }
        return null
    }, [])

    // const search = useDebounce((value) => {
    //     const keyWord = value.target.value;
    //     if (keyWord) {
    //         getSearch(value.target.value)
    //         setIsSeach(true)
    //     } else {
    //         findRecent()
    //         setIsSeach(false)
    //     }
    //     setShow(true)
    // }, 500)

    return (
        <Modal
            visible={showSearchModal}
            onCancel={() => setShowSearchModal(false)}
            width={800}
            footer={null}
            className="repository-search-modal"
            closable={false}
            style={{
                top: "50px",

            }}
        >
            <div className="repository-search-modal-input">
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-search"></use>
                </svg>
                <Input bordered={false} allowClear
                    placeholder="文档名字，关键字"
                    onChange={(value) => searchDocument(value)}
                    key={"search"}
                />
                <svg className="svg-icon close-icon" aria-hidden="true" onClick={() => setShowSearchModal(false)}>
                    <use xlinkHref="#icon-close"></use>
                </svg>
            </div>
            {
                !isSearch ? <div className="recent-box">
                <div className="recent-title">最近查看文档</div>
                {
                    recentDocumentList.length > 0 ? <>
                        {
                            recentDocumentList.map((documentItem) => {
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
                        <Empty description="暂时没有数据~" />
                }
            </div>
            :
            <div className="search-result-box">
                <div className="search-result-title">搜索结果</div>
                {
                    searchDocumentList.length > 0 ? <>
                    
                        {
                            searchDocumentList.map((node) => {
                                return <div className="item-box" key={node.id}>
                                    <div className="item-one" onClick={() => toWorkItem(node)}>
                                        <svg className="img-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-file"></use>
                                        </svg>
                                        <span>{node.name}</span>
                                        <div className="item-desc">
                                            {node.wikiRepository?.name}
                                        </div>
                                    </div>

                                </div>
                            })
                        }
                    </>
                        :
                        <Empty description="暂时没有数据~" />
                }
            </div>
            }
            
        </Modal>
    )
}

export default withRouter(inject("repositoryDetailStore")(observer(SearchModal)));