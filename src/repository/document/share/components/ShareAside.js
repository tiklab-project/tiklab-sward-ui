/*
 * @Descripttion: 知识库详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:29:42
 */
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from 'antd';
import "./ShareAside.scss";
import {productImg, urlQuery,getUser} from "tiklab-core-ui";
import DocumentIcon from "../../../../common/components/icon/DocumentIcon";
import {useVersion} from "tiklab-eam-ui/es/utils";
import shareStore from "../store/ShareStore";

const { Sider } = Layout;

const ShareAside = (props) => {

    const {setShareExist} = props;

    const { findShareCategory, findShare, setTenant } = shareStore;

    const moveRef = useRef([]);

    const query = urlQuery(window.location.search || window.location.href);
    const tenant = query?.tenant;

    const user = getUser();
    const id = props.location.pathname.split("/")[4];
    const origin = location.origin;
    const shareId = props.match.params.shareId;
    const password = sessionStorage.getItem('password');

    //当前选中目录id
    const [selectKey, setSelectKey] = useState(null);
    //分享目录
    const [repositoryCatalogueList, setRepositoryCatalogueList] = useState([])

    useVersion();

    useEffect(() => {
        setSelectKey(id);
        setTenant(tenant);
    }, [id])

    useEffect(() => {
        findShare(shareId).then(res=>{
            if(res.code===0){
                const data = res.data;
                if(!data){
                    setShareExist('noShare');
                    return;
                }
                if(data.type===1){
                    if(data.authType===1 || password==='true'){
                        findCategory()
                        return;
                    }
                    if(version==="cloud"){
                        window.location.href = `${origin}/#/passWord/${shareId}?tenant=${tenant}`
                        return;
                    }
                    window.location.href = `${origin}/#/passWord/${shareId}`;
                    return;
                }
                if(user.userId){
                    const userIds = data.userIds.split(",");
                    if (userIds.indexOf(user.userId) !== -1) {
                        findCategory()
                        return;
                    }
                    setShareExist('noPermission')
                    return;
                }
                if(version==="cloud"){
                    window.location.href = 'https://tiklab.net';
                    return;
                }
                props.history.push({
                    pathname:'/logout',
                    state: {preRoute: props.location.pathname}
                })
            }
        })
    }, [shareId])

    /**
     * 获取分享文档
     */
    const findCategory = () => {
        const shareLink = new FormData();
        shareLink.append('id',shareId);
        findShareCategory(shareLink).then((data) => {
            if (data.code === 0) {
                if(data.data?.length){
                    setRepositoryCatalogueList(data.data)
                    const item = data.data[0]
                    if(item){
                        setUrl(item)
                        setSelectKey(item.id)
                    }
                } else {
                    setShareExist('noDocument')
                }
            }
        })
    }

    /**
     * 跳转到对应页面
     * @param item
     */
    const setUrl = (item) => {
        if (version !== "cloud") {
            if (item.type === "category") {
                props.history.push(`/share/${shareId}/category/${item.id}`)
            }
            if (item.documentType === "document") {
                props.history.push(`/share/${shareId}/doc/${item.id}`)
            }
            if (item.documentType === "markdown") {
                props.history.push(`/share/${shareId}/markdown/${item.id}`)
            }
            if (item.documentType === "file") {
                props.history.push(`/share/${shareId}/file/${item.id}`)
            }
        }
        if (version === "cloud") {
            if (item.type === "category") {
                props.history.push(`/share/${shareId}/category/${item.id}?tenant=${tenant}`)
            }
            if (item.documentType === "document") {
                props.history.push(`/share/${shareId}/doc/${item.id}?tenant=${tenant}`)
            }
            if (item.documentType === "markdown") {
                props.history.push(`/share/${shareId}/markdown/${item.id}?tenant=${tenant}`)
            }
            if (item.documentType === "file") {
                props.history.push(`/share/${shareId}/file/${item.id}?tenant=${tenant}`)
            }
        }
    }

    //点击左侧菜单
    const selectKeyFun = (event, item) => {
        event.stopPropagation()
        setSelectKey(item.id)
        setOpenOrClose(item.id)
        setUrl(item)
    }

    //折叠菜单
    const [expandedTree, setExpandedTree] = useState([0])

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


    const logTree = (fItems, item, levels, faid, index) => {
        let newLevels = 0;
        return <div className={`${isExpandedTree(faid) ? "" : 'repository-menu-submenu-hidden'}`}
            key={item.id}
            onClick={(event) => selectKeyFun(event, item)}
            ref={el => (moveRef.current[item.id] = el)}
        >
            <div className={`repository-menu-submenu ${item.id === selectKey ? "repository-menu-select" : ""} `}
                key={item.id}
            >
                <div style={{ paddingLeft: levels * 20 + 15 }} className="repository-menu-submenu-left">
                    {
                        (item.children && item.children.length > 0) || (item.documents && item.documents.length > 0) ?
                            isExpandedTree(item.id) ?
                            <svg className="img-icon" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                <use xlinkHref="#icon-down" ></use>
                            </svg>
                            :
                            <svg className="img-icon" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                <use xlinkHref="#icon-right" ></use>
                            </svg>
                            :
                            <div className="img-icon" aria-hidden="true">
                            </div>
                    }
                    <svg className="img-icon" aria-hidden="true">
                        <use xlinkHref="#icon-folder"></use>
                    </svg>
                    <span className= "repository-view" title = {item.name}>
                        {item.name}
                    </span>
                </div>
            </div>
            {
                item.children && item.children.length > 0 && (newLevels = levels + 1) &&
                item.children.map((childItem, index) => {
                    if (childItem.type === "document") {
                        return fileTree(item.children, childItem, newLevels, item.id, index)
                    }
                    if (childItem.type === "category") {
                        return logTree(item.children, childItem, newLevels, item.id, index)
                    }

                })
            }
        </div>
    }
    const fileTree = (fItems, item, levels, fId, index) => {
        return <div className={`${isExpandedTree(fId) ? null : 'repository-menu-submenu-hidden'}`}
            key={item.id}
        >
            <div className={`repository-menu-submenu ${item.id === selectKey ? "repository-menu-select" : ""} `}
                key={item.id}
                onClick={(event) => selectKeyFun(event, item)}
                ref={el => (moveRef.current[item.id] = el)}
            >
                <div style={{ paddingLeft: levels * 20 + 15 }} className="repository-menu-submenu-left">
                    <div className="img-icon" aria-hidden="true">
                    </div>
                    <DocumentIcon
                        type={item.type}
                        documentType={item.documentType}
                        documentName={item.name}
                        className="img-icon"
                    />
                    <span className= "repository-view"
                        id={"file-" + item.id}
                        title = {item.name}
                    >
                        {item.name}
                    </span>
                </div>
            </div>
        </div>
    }
    return (
        <Sider
            trigger={null}
            collapsible
            collapsedWidth="50"
            width="250"
            theme={'light'}
        >
            <div className={`repository-aside`}>
                <div className='repository-aside-logo'>
                    <img src={productImg.sward} alt={''} width={24} height={24}/>
                    <div className='logo-text'>sward</div>
                </div>
                <div className="repository-menu">
                    {
                        repositoryCatalogueList && repositoryCatalogueList.map((item, index) => {
                            if (item.type === "document") {
                                return fileTree(repositoryCatalogueList, item, 0, 0, index)
                            }
                            if (item.type === "category") {
                                return logTree(repositoryCatalogueList, item, 0, 0, index)
                            }
                        })
                    }
                </div>
            </div>
        </Sider>
    )
}
export default ShareAside;
