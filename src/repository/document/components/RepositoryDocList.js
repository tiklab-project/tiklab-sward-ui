/*
 * @Descripttion: 知识库目录页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:03:48
 */

import React, { Fragment, useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { Menu, Dropdown, Layout, Tree, message, Modal, Empty, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import ShareListModal from "../../../document/share/components/ShareListModal"
import MoveLogList from "../../common/components/MoveLogList"
import { getUser, getVersionInfo } from 'tiklab-core-ui';
import "./RepositoryDocList.scss"
import {
    appendNodeInTree, removeNodeAndSort,
    updataTreeSort, findNodeById, updateNodeName, removeNodeInTree
} from '../../../common/utils/treeDataAction';
import AddDropDown from '../../common/components/AddDropDown';
import { DownOutlined } from '@ant-design/icons';
import ArchivedFree from '../../../common/components/archivedFree/ArchivedFree';
import SearchModal from '../../common/components/SearchModal';
import {documentPush, getFileExtensionWithDot, removeFileExtension} from "../../../common/utils/overall";
import DocumentIcon from "../../../common/components/icon/DocumentIcon";
const { Sider } = Layout;

const RepositoryDocList = (props) => {
    // 解析props
    const { repositoryDetailStore, NodeRecycleModal, NodeArchivedModal } = props;
    const [loading, setLoading] = useState(false)
    //语言包
    const { t } = useTranslation();
    const { findNodePageTree, updateRepositoryCatalogue, deleteNode, updateDocument,
        repositoryCatalogueList, setRepositoryCatalogueList, createRecent,
        expandedTree, setExpandedTree, setDocumentTitle, setCategoryTitle, findCategory, repository } = repositoryDetailStore;

    // 当前选中目录id
    const id = props.location.pathname.split("/")[5];
    const [selectKey, setSelectKey] = useState(id);
    const repositoryId = props.match.params.repositoryId;
    const [isHover, setIsHover] = useState(false)
    const [requsetedCategory, setRequsetedCategory] = useState([])

    const userId = getUser().userId;
    const tenant = getUser().tenant;

    const [shareListVisible, setShareListVisible] = useState(false)
    const inputRef = React.useRef(null);
    const [isRename, setIsRename] = useState()
    const [archivedNode, setArchivedNode] = useState()
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [nodeArchivedVisable, setNodeArchivedVisable] = useState(false)
    const [nodeRecycleVisable, setNodeRecycleVisable] = useState(false)
    const versionInfo = getVersionInfo();
    const [archivedFreeVisable, setArchivedFreeVisable] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false)
    const repositoryStatus = repository?.status === 'nomal';

    useEffect(() => {
        setLoading(true)
        const data = {
            repositoryId: repositoryId,
            dimensions: [1, 2]
        }
        findNodePageTree(data).then((data) => {
            setRepositoryCatalogueList([...data.data])
            if (data.data.length > 0 && !id) {
                const item = data.data[0];
                console.log("repositoryCatalogueList",repositoryCatalogueList)
                goDetail(item)
            }
            setLoading(false)
        })
        return () => {
            setExpandedTree([])
        };
    }, [repositoryId])

    useEffect(() => {
        // 初次进入激活导航菜单
        if (props.location.pathname.split("/")[3] === "overview") {
            setSelectKey("overview")
        } else {
            setSelectKey(id)
        }
    }, [id])

    //点击左侧菜单
    const selectKeyFun = (event, item) => {
        // setSelectKey(item.id)
        event.preventDefault()
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation()
        goDetail(item, "click")
    }

    const goDetail = (item, action) => {
        const params = {
            name: item.name,
            model: item.type,
            modelId: item.id,
            master: { id: userId },
            wikiRepository: { id: repositoryId }
        }
        createRecent(params)
        if (item.type === "category") {
            if(action === "click"){
                findCategoryChildren(item.id, item.type)
                setOpenClickCategory(item.id)
            }
            localStorage.setItem("categoryId", item.id);
        }
        documentPush(props.history,repositoryId,item);
    }

    const findCategoryChildren = (id, type) => {
        // setSelectKey(id)
        const isRequested = requsetedCategory.some(category => category === id);
        if (!isRequested) {
            findCategory({ id: id }).then(res => {
                if (res.code === 0) {
                    const node = res.data.node;
                    const params = {
                        repositoryId: repositoryId,
                        treePath: id,
                        status: "nomal",
                        dimensions: [node.dimension + 1, node.dimension + 2]
                    }
                    findNodePageTree(params).then(data => {
                        if (data.code === 0) {
                            const list = appendNodeInTree(id, repositoryCatalogueList, data.data, "overview")
                            setRepositoryCatalogueList([...list])
                            console.log(list)
                            setRequsetedCategory(requsetedCategory.concat(id))
                        }
                    })
                }

            })
        }
    }

    // 编辑
    const editMenu = (item, index) => {
        return <Menu onClick={(value) => editCatelogue(value, item, index)}>
            <Menu.Item key="edit">
                重命名
            </Menu.Item>
            <Menu.Item key="delete">
                删除
            </Menu.Item>
            <Menu.Item key="move">
                移动
            </Menu.Item>
            <Menu.Item key="share">
                分享
            </Menu.Item>
            <Menu.Item key="recycle">
                <div className="repository-aside-archived">
                    移动到回收站
                    {
                        versionInfo.expired === true &&
                        <svg className="img-icon" aria-hidden="true" >
                            <use xlinkHref="#icon-member"></use>
                        </svg>
                    }
                </div>
            </Menu.Item>
        </Menu>
    };

    //更新目录
    const editCatelogue = (value, item, index) => {
        const { id, type, sort } = item;
        value.domEvent.stopPropagation()
        if (value.key === "edit") {
            setIsRename(id)
        }
        if (value.key === "delete") {
            Modal.confirm({
                title: '确定删除?',
                className: "delete-modal",
                centered: true,
                onOk() { deleteDocumentOrCategory(item, type, id) },
                onCancel() { },
            });
        }
        if (value.key === "recycle") {
            if (versionInfo.expired === false) {
                setArchivedNode(item)
                setNodeRecycleVisable(true)
            } else {
                setArchivedFreeVisable(true)
            }
        }
        if (value.key === "move") {
            setMoveLogListVisible(true)
            setMoveItem(item)
        }
        if (value.key === "share") {
            setShareListVisible(true)
        }
        if (value.key === "archived") {
            if (versionInfo.expired === false) {
                setArchivedNode(item)
                setNodeArchivedVisable(true)
            } else {
                setArchivedFreeVisable(true)
            }

        }
    }

    const deleteDocumentOrCategory = (item, type, id) => {
        if (type === "category") {
            deleteNode(item.id).then(res => {
                if(res.code === 0){
                    const node = removeNodeInTree(repositoryCatalogueList, null, id)
                    console.log(node)
                    if (node) {
                        documentPush(props.history, repositoryId, node);
                    } else {
                        props.history.push(`/repository/${repositoryId}/overview`)
                    }
                }else {
                    message.error("删除失败")
                }
            })
        }
        if (type === "document") {
            deleteNode(item.id).then(res => {
                if(res.code === 0){
                    const node = removeNodeInTree(repositoryCatalogueList, null, id)
                    console.log(node)
                    if (node) {
                        documentPush(props.history, repositoryId, node);
                    } else {
                        props.history.push(`/repository/${repositoryId}/overview`)
                    }
                }else {
                    message.error("删除失败")
                }
            })
        }
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.autofocus = true;
            let range = getSelection();
            range.selectAllChildren(inputRef.current);
            range.collapseToEnd()
        }
        return;
    }, [inputRef.current])

    const reName = (value, reNameId, type, initName) => {
        const fileExtensionWithDot = initName ? getFileExtensionWithDot(initName) : '';
        const name = value.target.innerText + fileExtensionWithDot;
        const params = {
            id: reNameId,
            node: {
                id: reNameId,
                name: name ,
            }
        }
        if (type === "category") {
            updateRepositoryCatalogue(params).then(data => {
                if (data.code === 0) {
                    setIsRename(null)
                    updateNodeName(repositoryCatalogueList, reNameId, name)
                    // 为了使右侧的标题与目录的一致
                    if (reNameId === id) {
                        setCategoryTitle(name)
                    }

                } else {
                    message.info("重命名失败")
                }
            })
        }
        if (type === "document") {
            updateDocument(params).then(data => {
                if (data.code === 0) {
                    setIsRename(null)
                    updateNodeName(repositoryCatalogueList, reNameId, name)
                    if (reNameId === id) {
                        setDocumentTitle(name)
                    }
                } else {
                    message.info("重命名失败")
                }
            })
        }
        setIsRename(null)
    }

    const enterKeyRename = (value, id, type, initName) => {
        if (value.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault()
            reName(value, id, type, initName)
        }
    }

    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }

    const setOpenOrClose = expanded => {
        const id = expanded.node.key
        if (isExpandedTree(id)) {
            setExpandedTree(expandedTree.filter(item => item !== id))
        } else {
            findCategoryChildren(id, expanded.node.dimension)
            setExpandedTree(expandedTree.concat(id));
        }
    }

    const setOpenClickCategory = key => {
        if (!isExpandedTree(key)) {
            setExpandedTree(expandedTree.concat(key));
        } else {
            setExpandedTree(expandedTree.filter(item => item !== key))
        }
    }

    const [moveItem, setMoveItem] = useState()
    const [moveLogListVisible, setMoveLogListVisible] = useState(false)

    const onDrop = (info) => {
        const { event, node, dragNode, dragNodesKeys } = info;
        // node放置， dragNode被移动节点
        console.log(node, dragNode)
        // return
        const dropToGap = info.dropToGap;
        const dropType = node.type;
        if (dropType === "document" && dropToGap === false) {
            return
        }
        const dropId = node.key;
        const dragId = dragNode.key;
        const type = dragNode.type;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        let params = {
            moveToId: dropId,
            moveToType: dropType,
            moveType: "1",
            id: dragId
        }
        if (dropToGap === true && dropPosition !== -1) {
            // 移动到某个目录的顶部
            params.moveType = "1"
        }
        if (dropToGap === false && dropPosition !== -1) {
            // 移动到某个目录的或者知识库的中间
            params.moveType = "2"
        }
        if (dropPosition === -1) {
            // 移动到此知识库的最顶部
            console.log(node, dragNode, 3)
            params.moveType = "3"
        }
        params = {
            id: params.id,
            node: params
        }
        if (type === "category") {
            updateCategorySort(params)
        }
        if (type === "document") {
            updateDocumentSort(params)
        }
    }

    const updateDocumentSort = (params) => {
        updateDocument(params).then(res => {
            if (res.code === 0) {
                updataTreeSort(repositoryCatalogueList, params.node)
                setMoveLogListVisible(false)
            } else {
                message.error("保存失败")
            }
        })

    }

    const updateCategorySort = (params) => {
        updateRepositoryCatalogue(params).then(res => {
            if (res.code === 0) {
                updataTreeSort(repositoryCatalogueList, params.node)
                setMoveLogListVisible(false)
            }
        })
    }

    const fileTree = (item, index) => {
        return <div
            key={item.id}
            className={`repository-menu-submenu`}
            onClick={(event) => selectKeyFun(event, item)}
            onMouseOver={(event) => { event.stopPropagation(), setIsHover(item.id) }}
            onMouseLeave={(event) => { event.stopPropagation(), setIsHover(null) }}
        >
            <DocumentIcon
                documentName={item.name}
                documentType={item.documentType}
                className={"icon-15"}
            />
            <div
                className={`${isRename === item.id ? "repository-input" : "repository-view"}`}
                contentEditable={isRename === item.id ? true : false}
                suppressContentEditableWarning
                onBlur={(value) => {
                    reName(value, item.id, item.type, item.documentType === "file" ? item.name : null)
                }}
                onKeyDownCapture={(value) => {
                    enterKeyRename(value, item.id, item.type, item.documentType === "file" ? item.name : null)
                }}
                ref={isRename === item.id ? inputRef : null}
                id={"file-" + item.id}
                title={item.name}
            >
                {
                    (item.documentType === "file" && isRename === item.id) ?
                        removeFileExtension(item.name) : item.name
                }
            </div>
            {
                repositoryStatus && (
                    <div className={`${isHover === item.id ? "icon-show" : "icon-hidden"}`}>
                        <Dropdown overlay={() => editMenu(item, index)} placement="bottomLeft">
                            <div className="category-add">
                                <svg className="icon-18" aria-hidden="true">
                                    <use xlinkHref="#icon-more"></use>
                                </svg>
                            </div>
                        </Dropdown>
                    </div>
                )
            }
        </div>
    }

    const logTree = (item, index) => {
        return <div
            className={`repository-menu-submenu`}
            key={item.id}
            onClick={(event) => selectKeyFun(event, item)}
            onMouseOver={(event) => { event.stopPropagation(), setIsHover(item.id) }}
            onMouseLeave={(event) => { event.stopPropagation(), setIsHover(null) }}
        >
            <svg className="icon-15" aria-hidden="true">
                <use xlinkHref="#icon-folder"></use>
            </svg>
            <div className={`${isRename === item.id ? "repository-input" : "repository-view"}`}
                contentEditable={isRename === item.id ? true : false}
                suppressContentEditableWarning
                onBlur={(value) => reName(value, item.id, item.type)}
                ref={isRename === item.id ? inputRef : null}
                onKeyDownCapture={(value) => enterKeyRename(value, item.id, item.type)}
            > {item.name}</div>
            {
                repositoryStatus && (
                    <div className={`${isHover === item.id ? "icon-show" : "icon-hidden"} icon-action`}>
                        {/* <div className="icon-action"> */}
                        <AddDropDown category={item} button="icon-gray" />
                        <Dropdown overlay={() => editMenu(item, index)} placement="bottomLeft">
                            <div className="category-add">
                                <svg className="icon-18" aria-hidden="true">
                                    <use xlinkHref="#icon-more"></use>
                                </svg>
                            </div>

                        </Dropdown>
                    </div>
                )
            }
        </div>
    }

    const categoryTree = (data) => {
        return data?.map((item, index) => {
            if (item.type === "category") {
                return <Tree.TreeNode
                    title={logTree(item, index)}
                    key={item.id}
                    dimension={item.dimension}
                    sort={item.sort}
                    treePath={item.treePath}
                    type={item.type}
                    parentWikiCategory={item.dimension !== 1 ? item.parentWikiCategory?.id : "nullString"}
                    disableCheckbox
                    className={`repository-menu-node ${item.id === selectKey ? "repository-menu-select" : ""}`}
                >
                    {categoryTree(item.children)}
                </Tree.TreeNode>
            }
            if (item.type === "document") {
                return <Tree.TreeNode
                    title={fileTree(item, index)}
                    disableCheckbox
                    type={item.type}
                    dimension={item.dimension}
                    treePath={item.treePath}
                    parentWikiCategory={item.dimension !== 1 ? item.wikiCategory?.id : "nullString"}
                    key={item.id}
                    sort={item.sort}
                    className={`repository-menu-node ${item.id === selectKey ? "repository-menu-select" : ""} `}
                />

            }
        })
    }

    return (
        <Fragment>
            <Spin spinning={loading} delay={500}>
                <Sider trigger={null} collapsible collapsedWidth="50" width="270" className="repositorydetail-aside">
                    <div className='repository-aside'>
                        <div className="repository-title title">
                            <div className="repository-title-left">
                                文档
                            </div>
                            <AddDropDown category={null} button="icon-gray" />
                        </div>
                        <div className="repository-search" onClick={() => setShowSearchModal(true)}>
                            {/* <div className="repository-search-input"> */}
                            <svg className="icon-13" aria-hidden="true">
                                <use xlinkHref="#icon-search"></use>
                            </svg>
                            <span>
                                搜索
                            </span>
                        </div>
                        <div className="repository-menu">
                            {
                                repositoryCatalogueList?.length > 0  ?
                                <Tree
                                    showIcon
                                    draggable={repositoryStatus}
                                    blockNode={true}
                                    switcherIcon={<DownOutlined />}
                                    expandedKeys={expandedTree}
                                    onExpand={(expandedKeys, expanded) => setOpenOrClose(expanded)}
                                    onDrop={onDrop}
                                    rootStyle="repository-menu-tree"
                                >
                                    {categoryTree(repositoryCatalogueList)}
                                </Tree>
                                    :
                                <>
                                    {!loading && <Empty description="暂无文档" />}
                                </>
                            }
                        </div>
                        {/* <div className="repository-setting-menu" onClick={() => props.history.push(`/repositorySet/${repositoryId}/basicInfo`)}>
                        <svg className="img-icon" aria-hidden="true">
                            <use xlinkHref="#icon-set"></use>
                        </svg>
                        设置
                    </div> */}
                    </div>
                </Sider>
            </Spin>
            <MoveLogList
                moveLogListVisible={moveLogListVisible}
                setMoveLogListVisible={setMoveLogListVisible}
                moveItem={moveItem}
                findCategoryChildren={findCategoryChildren}
                updateDocumentSort={updateDocumentSort}
                updateCategorySort={updateCategorySort}
            />
            <ShareListModal
                repositoryCatalogueList={repositoryCatalogueList}
                shareListVisible={shareListVisible}
                setShareListVisible={setShareListVisible}
                findCategoryChildren={findCategoryChildren}
                setOpenOrClose={setOpenOrClose}
            />
            <Modal
                title="确定删除"
                centered={true}
                visible={deleteVisible}
                width={400}
            >
                确定删除文档？
            </Modal>
            {
                NodeArchivedModal && versionInfo.expired === false &&
                <NodeArchivedModal
                    nodeArchivedVisable={nodeArchivedVisable}
                    setNodeArchivedVisable={setNodeArchivedVisable}
                    node={archivedNode}
                    repositoryCatalogueList={repositoryCatalogueList}
                />
            }
            {
                NodeRecycleModal && versionInfo.expired === false &&
                <NodeRecycleModal
                    nodeRecycleVisable={nodeRecycleVisable}
                    setNodeRecycleVisable={setNodeRecycleVisable}
                    node={archivedNode}
                    repositoryCatalogueList={repositoryCatalogueList}
                />
            }

            <ArchivedFree
                archivedFreeVisable={archivedFreeVisable}
                setArchivedFreeVisable={setArchivedFreeVisable}
            />
            <SearchModal
                showSearchModal={showSearchModal}
                setShowSearchModal={setShowSearchModal}
                repositoryId={repositoryId}
            />
        </Fragment>
    )
}
export default withRouter(inject("repositoryDetailStore")(observer(RepositoryDocList)));
