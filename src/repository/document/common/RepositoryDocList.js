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
import { Dropdown, Layout, Tree, message, Modal, Empty, Spin, Input} from 'antd';
import MoveLogList from "../../common/components/MoveLogList"
import { getUser, getVersionInfo } from 'tiklab-core-ui';
import "./RepositoryDocList.scss"
import {appendNodeInTree, updataTreeSort, updateNodeName, removeNodeInTree} from '../../../common/utils/treeDataAction';
import AddDropDown from '../../common/components/AddDropDown';
import {DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined,} from '@ant-design/icons';
import SearchModal from '../../common/components/SearchModal';
import {documentPush, getFileExtensionWithDot, removeFileExtension} from "../../../common/utils/overall";
import DocumentIcon from "../../../common/components/icon/DocumentIcon";
import ShareModal from "../share/components/ShareModal";
import EnhanceEntranceModal from "../../../common/components/modal/EnhanceEntranceModal";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";

const { Sider } = Layout;

const RepositoryDocList = (props) => {

    const { repositoryDetailStore, NodeRecycleModal, NodeArchivedModal, PermissionModal, collapsed, setCollapsed,moreComponent } = props;

    const { findNodePageTree, updateRepositoryCatalogue, deleteNode, updateDocument,
        repositoryCatalogueList, setRepositoryCatalogueList,
        expandedTree, setExpandedTree, setDocumentTitle, setCategoryTitle, findCategory, repository } = repositoryDetailStore;

    // 当前选中目录id
    const id = props.location.pathname.split("/")[5];
    const repositoryType = props.location.pathname.split("/")[4];
    const repositoryId = props.match.params.repositoryId;
    const userId = getUser().userId;
    const versionInfo = getVersionInfo();
    const inputRef = React.useRef(null);

    //加载
    const [loading, setLoading] = useState(false)
    //当前文档key
    const [selectKey, setSelectKey] = useState(id);
    //已请求目录
    const [requsetedCategory, setRequsetedCategory] = useState([])
    //当前悬浮的文档
    const [isHover, setIsHover] = useState(null);
    //下拉框
    const [dropdownVisible,setDropdownVisible] = useState(null);
    //分享弹出框
    const [shareVisible, setShareVisible] = useState(false);
    //分享数据
    const [shareData,setShareData] = useState(null);
    //重命名文档
    const [isRename, setIsRename] = useState()
    //文档节点
    const [archivedNode, setArchivedNode] = useState()
    //归档弹出框
    const [nodeArchivedVisable, setNodeArchivedVisable] = useState(false)
    //回收站弹出框
    const [nodeRecycleVisable, setNodeRecycleVisable] = useState(false)
    //增强引导弹出框
    const [archivedFreeVisable, setArchivedFreeVisable] = useState(false);
    //搜索弹出框
    const [showSearchModal, setShowSearchModal] = useState(false)
    //增强弹出框类型
    const [archivedFree,setArchivedFree] = useState('recycle')
    //文档权限弹出框
    const [permissionVisible,setPermissionVisible] = useState(false);
    const repositoryStatus = repository?.status === 'nomal';

    useEffect(() => {
        setSelectKey(id)
    }, [props.location.pathname])

    useEffect(() => {
        setLoading(true)
        findNodePageTree({
            repositoryId: repositoryId,
            dimensions: [1, 2],
            approveUserId: userId,
        }).then((data) => {
            setRepositoryCatalogueList([...data.data])
            if (data.data.length === 0 || id) return;
            if (moreComponent && ['draft', 'review', 'complete'].includes(repositoryType)) {
                return;
            }
            const item = data.data[0];
            goDetail(item);
        }).finally(()=>{
            setLoading(false)
        })
        return () => {
            setExpandedTree([])
        };
    }, [repositoryId])

    //点击左侧菜单
    const selectKeyFun = (event, item) => {
        event.preventDefault()
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation()
        goDetail(item, "click")
    }

    const goDetail = (item, action) => {
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
        const isRequested = requsetedCategory.some(category => category === id);
        if (!isRequested) {
            findCategory({ id: id }).then(res => {
                if (res.code === 0) {
                    const node = res.data.node;
                    const params = {
                        repositoryId: repositoryId,
                        treePath: id,
                        status: "nomal",
                        dimensions: [node.dimension + 1, node.dimension + 2],
                        approveUserId: userId,
                    }
                    findNodePageTree(params).then(data => {
                        if (data.code === 0) {
                            const list = appendNodeInTree(id, repositoryCatalogueList, data.data, "overview")
                            setRepositoryCatalogueList([...list])
                            setRequsetedCategory(requsetedCategory.concat(id))
                        }
                    })
                }
            })
        }
    }

    //更新目录
    const editCatelogue = (key, item, index, e) => {
        e.stopPropagation()
        const { id, type } = item
        switch (key) {
            case "edit":
                setIsRename(id)
                break
            case "delete":
                Modal.confirm({
                    title: "确定删除?",
                    className: "delete-modal",
                    centered: true,
                    onOk: () => deleteDocumentOrCategory(item, type, id),
                })
                break
            case "move":
                setMoveLogListVisible(true)
                setMoveItem(item)
                break
            case "share":
                setShareData(item)
                setShareVisible(true)
                break
            case "permission":
                if (!versionInfo.expired) {
                    setArchivedNode(item)
                    setPermissionVisible(true)
                } else {
                    setArchivedFree("permission")
                    setArchivedFreeVisable(true)
                }
                break
            case "archived":
                if (!versionInfo.expired) {
                    setArchivedNode(item)
                    setNodeArchivedVisable(true)
                } else {
                    setArchivedFree("archived")
                    setArchivedFreeVisable(true)
                }
                break
            case "recycle":
                if (!versionInfo.expired) {
                    setArchivedNode(item)
                    setNodeRecycleVisable(true)
                } else {
                    setArchivedFree("recycle")
                    setArchivedFreeVisable(true)
                }
                break
            default:
                break
        }
        setDropdownVisible(false)
    }


    const deleteDocumentOrCategory = (item, type, id) => {
        if (type === "category") {
            deleteNode(item.id).then(res => {
                if(res.code === 0){
                    const node = removeNodeInTree(repositoryCatalogueList, null, id)
                    if (node) {
                        documentPush(props.history, repositoryId, node);
                    } else {
                        props.history.push(`/repository/${repositoryId}/overview`)
                    }
                } else {
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
            inputRef.current.focus();
        }
    }, [inputRef.current])

    /**
     * 重命名
     * @param value
     * @param reNameId
     * @param type
     * @param initName
     */
    const reName = (value, reNameId, type, initName) => {
        const fileExtensionWithDot = initName ? getFileExtensionWithDot(initName) : '';
        const name = value + fileExtensionWithDot;
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
            updateDocument({
                ...params,
                repositoryId: repositoryId,
            }).then(data => {
                if (data.code === 0) {
                    updateNodeName(repositoryCatalogueList, reNameId, name);
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
        updateDocument({
            ...params,
            repositoryId: repositoryId,
        }).then(res => {
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

    const editMenu = (item, index) => {
        return <div className='sward-dropdown-more' onClick={(event) => event.stopPropagation()}>
            <PrivilegeProjectButton code={'wi_doc_rename'} domainId={repositoryId}>
                <div
                    className='content-add-menu dropdown-more-item'
                    onClick={e => editCatelogue('edit', item, index, e)}
                >
                    <svg className="content-add-icon" aria-hidden="true">
                        <use xlinkHref="#icon-edit"></use>
                    </svg>
                    重命名
                </div>
            </PrivilegeProjectButton>
            <PrivilegeProjectButton code="wi_doc_delete" domainId={repositoryId}>
                <div
                    className='content-add-menu dropdown-more-item'
                    onClick={e => editCatelogue('delete', item, index, e)}
                >
                    <svg className="content-add-icon" aria-hidden="true">
                        <use xlinkHref="#icon-delete"></use>
                    </svg>
                    删除
                </div>
            </PrivilegeProjectButton>
            <PrivilegeProjectButton code="wi_doc_mv" domainId={repositoryId}>
                <div
                    className='content-add-menu dropdown-more-item'
                    onClick={e => editCatelogue('move', item, index, e)}
                >
                    <svg className="content-add-icon" aria-hidden="true">
                        <use xlinkHref="#icon-move"></use>
                    </svg>
                    移动
                </div>
            </PrivilegeProjectButton>
            <PrivilegeProjectButton code="wi_doc_share" domainId={repositoryId}>
                <div
                    className='content-add-menu dropdown-more-item'
                    onClick={e => editCatelogue('share', item, index, e)}
                >
                    <svg className="content-add-icon" aria-hidden="true">
                        <use xlinkHref="#icon-share"></use>
                    </svg>
                    分享
                </div>
            </PrivilegeProjectButton>
            <PrivilegeProjectButton code="wi_doc_permission" domainId={repositoryId}>
                <div
                    className='content-add-menu dropdown-more-item'
                    onClick={e => editCatelogue('permission', item, index, e)}
                >
                    <svg className="content-add-icon" aria-hidden="true">
                        <use xlinkHref="#icon-systempermissions"></use>
                    </svg>
                    权限管理
                </div>
            </PrivilegeProjectButton>
            <PrivilegeProjectButton code="wi_doc_archive" domainId={repositoryId}>
                <div
                    className='content-add-menu dropdown-more-item'
                    onClick={e => editCatelogue('archived', item, index, e)}
                >
                    <svg className="content-add-icon" aria-hidden="true">
                        <use xlinkHref="#icon-systemreset"></use>
                    </svg>
                    归档
                </div>
            </PrivilegeProjectButton>
            <PrivilegeProjectButton code="wi_doc_mv_recycle" domainId={repositoryId}>
                <div
                    className='content-add-menu dropdown-more-item'
                    onClick={e => editCatelogue('recycle', item, index, e)}
                >
                    <svg className="content-add-icon" aria-hidden="true">
                        <use xlinkHref="#icon-systemrecycle"></use>
                    </svg>
                    移动到回收站
                </div>
            </PrivilegeProjectButton>
        </div>
    };

    const fileTree = (item, index) => {
        return <div
            key={item.id}
            className={`repository-menu-submenu`}
            onClick={(event) => selectKeyFun(event, item)}
            onMouseOver={(event) => { event.stopPropagation(); setIsHover(item.id) }}
            onMouseLeave={(event) => { event.stopPropagation(); setIsHover(null) }}
        >
            <DocumentIcon
                documentName={item?.name}
                documentType={item?.documentType}
                className={"icon-15"}
            />
            {
                isRename === item.id ?
                    <div className='repository-view-inpout'>
                        <Input
                            className="repository-input"
                            onBlur={(e)=>{
                                reName(e.target.value, item.id, item.type, item.documentType === "file" ? item.name : null)
                            }}
                            onPressEnter={(e)=>{
                                reName(e.target.value, item.id, item.type, item.documentType === "file" ? item.name : null)
                            }}
                            ref={inputRef}
                            defaultValue={item.documentType === "file" ? removeFileExtension(item.name) : item.name}
                        />
                    </div>
                    :
                    <div
                        className="repository-view"
                        id={"file-" + item.id}
                        title={item.name}
                    >
                        {item.name}
                    </div>
            }
            {
                repositoryStatus && (
                    <div className={`${isHover === item.id ? "icon-show" : "icon-hidden"}`}>
                        <Dropdown
                            overlay={() => editMenu(item, index)}
                            placement="bottomLeft"
                            visible={dropdownVisible===item.id}
                            onVisibleChange={visible => {
                                setDropdownVisible(visible ? item.id : null);
                            }}
                        >
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
            onMouseOver={(event) => { event.stopPropagation(); setIsHover(item.id) }}
            onMouseLeave={(event) => { event.stopPropagation(); setIsHover(null) }}
        >
            <svg className="icon-15" aria-hidden="true">
                <use xlinkHref="#icon-folder"></use>
            </svg>
            {
                isRename === item.id ?
                    <div className='repository-view-inpout'>
                        <Input
                            className="repository-input"
                            onBlur={(e)=>{
                                reName(e.target.value, item.id, item.type)
                            }}
                            onPressEnter={(e)=>{
                                reName(e.target.value, item.id, item.type)
                            }}
                            ref={inputRef}
                            defaultValue={item.name}
                        />
                    </div>
                    :
                    <div
                        className="repository-view"
                        id={"file-" + item.id}
                        title={item.name}
                    >
                        {item.name}
                    </div>
            }
            {
                repositoryStatus && (
                    <div className={`${isHover===item.id ? "icon-show" : "icon-hidden"} icon-action`}>
                        <AddDropDown
                            category={item}
                            button="icon-gray"
                            code={{
                                category:'wi_doc_add_dir',
                                document:'wi_doc_add_doc',
                                markdown:'wi_doc_add_markdown',
                                file:'wi_doc_upload_local_file',
                            }}
                        />
                        <Dropdown
                            overlay={()=>editMenu(item, index)}
                            placement="bottomLeft"
                            visible={dropdownVisible===item.id}
                            onVisibleChange={visible => {
                                setDropdownVisible(visible ? item.id : null);
                            }}
                        >
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
                    className={`repository-menu-node ${item.id === selectKey ? "repository-menu-select" : "repository-menu-unselected"}`}
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
                    className={`repository-menu-node ${item.id === selectKey ? "repository-menu-select" : "repository-menu-unselected"} `}
                />
            }
        })
    }

    const configEnhance = {
        'permission':{
            title:'权限管理',
            desc: '控制不同用户对文档的访问范围'
        },
        'archived':{
            title:'归档',
            desc: '长期存储不常用但需保留的文档'
        },
        'recycle':{
            title:'回收站',
            desc: '防止误删重要文件，提供灵活的数据恢复机制'
        },
    }

    return (
        <Fragment>
            <Spin spinning={loading} delay={500}>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    collapsedWidth={0}
                    width={270}
                    className="repositorydetail-aside"
                >
                    <div className={`repository-aside ${collapsed ? 'repository-aside-unfold' : 'repository-aside-fold'}`}>
                        <div className="repository-title title">
                            <div className="repository-title-left">
                                文档
                            </div>
                            <div className='repository-title-left'>
                                <AddDropDown
                                    category={null}
                                    button="icon-gray"
                                    code={{
                                        category:'wi_doc_add_dir',
                                        document:'wi_doc_add_doc',
                                        markdown:'wi_doc_add_markdown',
                                        file:'wi_doc_upload_local_file',
                                    }}
                                />
                                {moreComponent}
                            </div>
                        </div>
                        <div className="repository-search" onClick={() => setShowSearchModal(true)}>
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
                                <Empty description="暂无文档" />
                            }
                        </div>
                        <div className="repository-aside-bottom">
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: collapsed ? 'menu-unfold' : 'menu-fold',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </div>
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
            <ShareModal
                repositoryId={repositoryId}
                shareVisible={shareVisible}
                setShareVisible={setShareVisible}
                docInfo={shareData}
            />
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
            {
                PermissionModal && versionInfo.expired === false &&
                <PermissionModal
                    node={archivedNode}
                    setNode={setArchivedNode}
                    visible={permissionVisible}
                    setVisible={setPermissionVisible}
                    repositoryDetailStore={repositoryDetailStore}
                    repositoryId={repositoryId}
                />
            }
            <EnhanceEntranceModal
                config={configEnhance[archivedFree]}
                visible={archivedFreeVisable}
                setVisible={setArchivedFreeVisable}
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
