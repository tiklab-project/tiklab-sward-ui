/*
 * @Descripttion: 移动文档弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-03 15:21:13
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 16:59:51
 */
import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import "./moveLogList.scss";
import { observer, inject } from "mobx-react";
import { withRouter } from 'react-router';
import { updataTreeSort, findNodeById, appendNodeInTree } from '../../../common/utils/treeDataAction';
import BaseModal from "../../../common/components/modal/Modal";
import {getUser} from "tiklab-core-ui";

const MoveLogList = (props) => {
    const { moveLogListVisible, setMoveLogListVisible, moveItem, repositoryDetailStore,
        updateDocumentSort, updateCategorySort } = props;
    const { findNodePageTree } = repositoryDetailStore;
    const [selectKey, setSelectKey] = useState()
    const userId = getUser().userId;
    const repositoryId = props.match.params.repositoryId;
    const parentItem = moveItem?.type === "category" ? moveItem?.parentWikiCategory : moveItem?.wikiCategory
    const [categoryList, setCategoryList] = useState()
    const [requsetedCategory, setRequsetedCategory] = useState([])
    useEffect(() => {
        if (moveLogListVisible){
            findNodePageTree({
                repositoryId: repositoryId,
                dimensions: [1, 2],
                type: "category",
                approveUserId: userId,
            }).then((data) => {
                setCategoryList(data.data)
            })
        } else {
            setRequsetedCategory([])
            setExpandedTree([])
        }
    }, [moveLogListVisible])

    const onFinish = () => {
        if (!selectKey) {
            message.warning('请选择要引动到的目录');
        } else {
            const params = {
                id: moveItem.id,
                node: {
                    id: moveItem.id,
                    moveToId: selectKey.id,
                    moveToType: selectKey.type,
                    moveType: "2"
                }
            }
            if (moveItem.type === "category") {
                updateCategorySort(params)
            }
            if (moveItem.type === "document") {
                updateDocumentSort(params)
            }
        }
    }

    /**
    * 折叠菜单
    */
    const [expandedTree, setExpandedTree] = useState([])
    // 树的展开与闭合
    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }
    const setOpenOrClose = key => {
        if (isExpandedTree(key)) {
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            setExpandedTree(expandedTree.concat(key));
        }
    }


    const clickOpenMenu = (category) => {
        setOpenOrClose(category.id)
        findCategoryChildren(category.id, category.dimension)
        // findCategoryChildren(category.id, category.dimension)
    }

    // 获取下级目录
    const findCategoryChildren = (id, dimension) => {
        setSelectKey(id)
        const isRequested = requsetedCategory.some(category => category === id);
        if (!isRequested) {
            const params = {
                repositoryId: repositoryId,
                treePath: id,
                dimensions: [dimension + 1, dimension + 2],
                type: "category",
                approveUserId: userId,
            }
            findNodePageTree(params).then(data => {
                if (data.code === 0) {
                    const list = appendNodeInTree(id, categoryList, data.data, "overview")
                    setCategoryList([...list])
                    setRequsetedCategory(requsetedCategory.concat(id))
                }
            })
        }
    }


    const selectMoveParent = (category) => {
        setSelectKey(category)
    }


    const logTree = (data, levels, faid) => {
        let newLevels = 0;
        return data && data.length > 0 && data.map((category) => {
            if (category.type === "category") {
                return <div
                    className={`${isExpandedTree(faid) || 0 == faid ? "" : 'category-menu-submenu-hidden'} ${category.id === moveItem.id || category.id === parentItem?.id ? "category-disable-select" : "category-allow-select"}`}
                    key={category.id}
                >
                    <div className={`category-menu-submenu ${category.id === selectKey?.id ? "category-menu-select" : ""} `}
                        key={category.id}
                        onClick={() => selectMoveParent(category)}
                        style={{ paddingLeft: levels * 10 }}
                    >
                        {/* <div > */}
                        {
                            category.children?.length > 0 ?
                                (!isExpandedTree(category.id) ?
                                    <svg className="img-icon" aria-hidden="true" onClick={() => clickOpenMenu(category)}>
                                        <use xlinkHref="#icon-right"></use>
                                    </svg>
                                    :
                                    <svg className="img-icon" aria-hidden="true" onClick={() => clickOpenMenu(category)}>
                                        <use xlinkHref="#icon-down"></use>
                                    </svg>)
                                :
                                <span style={{ width: "21px", height: "21px" }}></span>

                        }
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-folder"></use>
                        </svg>
                        <span>{category.name} </span>
                        {/* </div> */}
                    </div>
                    {
                        category.children && category.children.length > 0 && (newLevels = levels + 1) && logTree(category.children, newLevels, category.id)
                    }
                </div>
            }

        })
    }

    return (
        <BaseModal
            title="选择移动目录"
            visible={moveLogListVisible}
            onOk={onFinish}
            onCancel={() => setMoveLogListVisible(false)}
        >
            <div className="move-menu">
                {
                    moveLogListVisible && categoryList && logTree(categoryList, 1, 0)
                }
            </div>
        </BaseModal>
    )
}
export default withRouter(inject("repositoryDetailStore")(observer(MoveLogList)));
