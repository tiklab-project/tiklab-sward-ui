/*
 * @Descripttion: 搜索弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:30:32
 */
import {Empty, Input, Modal, Spin} from 'antd';
import React, { useState, useEffect } from 'react';
import "./SearchModal.scss";
import { getUser } from 'tiklab-core-ui';
import { withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { useDebounce } from '../../../common/utils/debounce';
import DocumentIcon from "../../../common/components/icon/DocumentIcon";
import {documentPush} from "../../../common/utils/overall";
import BaseModal from "../../../common/components/modal/Modal";

const SearchModal = (props) => {

    const { showSearchModal, setShowSearchModal, repositoryId, repositoryDetailStore } = props;
    const {findRecentList, searchRepositoryDocument, findNodeList} = repositoryDetailStore;
    const [recentDocumentList, setRecentDocumentList] = useState([]);
    const [searchDocumentList, setSearchDocumentList] = useState([])
    const [isSearch, setIsSeach] = useState(false);
    const [inputValue,setInputValue] = useState('');
    const [spinning,setSpinning] = useState(false);
    const userId = getUser().userId;

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
        if(showSearchModal){
            setSpinning(true);
            findRecentList(recentParams).then(res => {
                if (res.code === 0) {
                    setRecentDocumentList([...res.data])
                }
            }).finally(()=>setSpinning(false))
        }
    }, [showSearchModal])

    //搜索文档
    const changeValue = (value) => {
        setInputValue(value.target.value)
        searchDocument(value)
    }

    //节流
    const searchDocument = useDebounce((value) => {
        const keyWord = value.target.value;
        if(keyWord){
            setIsSeach(true)
            setSpinning(true);
            const param = {
                repositoryId: repositoryId,
                name: keyWord,
                userId: userId,
            }
            // findNodeList(param).then(res => {
            //     console.log(res)
            //     if(res.code === 0){
            //         setSearchDocumentList(res.data)
            //     }
            // })
            searchRepositoryDocument(param).then(res => {
                if(res.code === 0){
                    setSearchDocumentList(res.data)
                }
            }).finally(()=>setSpinning(false))
        } else {
            setIsSeach(false)
        }
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

    const toWorkItem = (item) => {
        documentPush(props.history,repositoryId,item)
        handelCancel()
    }

    /**
     * 关闭弹出框
     */
    const handelCancel = () => {
        setInputValue("");
        setShowSearchModal(false);
        setIsSeach(false)
        setSpinning(false)
    }

    return (
        <BaseModal
            visible={showSearchModal}
            onCancel={handelCancel}
            width={800}
            footer={null}
            className="repository-search-modal"
        >
            <div className="repository-search-modal-input">
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-search"></use>
                </svg>
                <Input
                    bordered={false}
                    allowClear
                    placeholder="文档名字，关键字"
                    value={inputValue}
                    onChange={changeValue}
                    key={"search"}
                />
                <svg className="svg-icon close-icon" aria-hidden="true" onClick={handelCancel}>
                    <use xlinkHref="#icon-close"></use>
                </svg>
            </div>
            {
                isSearch ?
                    <div className="search-result-box">
                        <div className="search-result-title">搜索结果</div>
                        <Spin spinning={spinning}>
                            {
                                searchDocumentList.length > 0 ?
                                    searchDocumentList.map((documentItem) => {
                                        const {node = {}} = documentItem;
                                        const documentType = node?.documentType || 'document';
                                        return (
                                            <div className="item-box" key={documentItem.id}>
                                                <div className="item-one" onClick={() => toWorkItem(node)}>
                                                    <DocumentIcon
                                                        documentName={node?.name}
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
                                    :
                                    <Empty description="暂时没有数据~" />
                            }
                        </Spin>
                    </div>
                    :
                    <div className="recent-box">
                        <div className="recent-title">最近查看文档</div>
                        <Spin spinning={spinning}>
                            {
                                recentDocumentList.length > 0 ?
                                    recentDocumentList.map((documentItem) => {
                                        const documentType = documentItem?.node?.documentType || 'document';
                                        return (
                                            <div className="item-box" key={documentItem.id}>
                                                <div className="item-one" onClick={() => toWorkItem(documentItem.node)}>
                                                    <DocumentIcon
                                                        documentName={documentItem?.name}
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
            }
        </BaseModal>
    )
}

export default withRouter(inject("repositoryDetailStore")(observer(SearchModal)));
