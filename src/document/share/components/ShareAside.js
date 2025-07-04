/*
 * @Descripttion: 知识库详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:29:42
 */
import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { Layout } from 'antd';
import "./ShareAside.scss";
import {productImg} from "tiklab-core-ui";
import DocumentIcon from "../../../common/components/icon/DocumentIcon";

const { Sider } = Layout;

const ShareAside = (props) => {
    // 解析props
    const { shareStore, setShareExist } = props;
    const tenant = props.location.search.split("=")[1];
    const origin = location.origin;
    const moveRef = useRef([]);
    const { findShareCategory, judgeAuthCode, setTenant } = shareStore;
    //当前选中目录id
    const [selectKey, setSelectKey] = useState();
    const [isShowText, SetIsShowText] = useState(true)
    const shareLink = props.match.params.shareId;
    const id = props.location.pathname.split("/")[4];
    //分享目录
    const [repositoryCatalogueList, setRepositoryCatalogueList] = useState([])
    const locationStatePassWord = props.location.state?.password;

    useEffect(() => {
        setSelectKey(id);
        setTenant(tenant);
    }, [id])

    useEffect(() => {
        const params = new FormData();
        params.append("shareLink", shareLink)
        // 判断是否需要验证码
        judgeAuthCode(params).then(data => {
            if(data.code===0){
                if (data.data === "true" && locationStatePassWord!== "true") {
                    if(version !== "cloud"){
                        window.location.href = `${origin}/#/passWord/${shareLink}`
                    }
                    if(version === "cloud"){
                        window.location.href = `${origin}/#/passWord/${shareLink}?tenant=${tenant}`
                    }
                    return
                }
                if (data.data === "false" || locationStatePassWord === 'true') {
                    findShareCategory({
                        shareId: shareLink,
                    }).then((data) => {
                        if (data.code === 0) {
                            setRepositoryCatalogueList(data.data)
                            const item = data.data[0]
                            if(item){
                                setUrl(item)
                                setSelectKey(item.id)
                            }
                        }
                    })
                }
            } else {
                setShareExist(false)
            }
        })
    }, [shareLink])

    // 跳转到对应页面
    const setUrl = (item) => {
        if (version !== "cloud") {
            if (item.type === "category") {
                props.history.push(`/share/${shareLink}/category/${item.id}`)
            }
            if (item.documentType === "document") {
                props.history.push(`/share/${shareLink}/doc/${item.id}`)
            }
            if (item.documentType === "markdown") {
                props.history.push(`/share/${shareLink}/markdown/${item.id}`)
            }
            if (item.documentType === "file") {
                props.history.push(`/share/${shareLink}/file/${item.id}`)
            }
        }
        if (version === "cloud") {
            if (item.type === "category") {
                props.history.push(`/share/${shareLink}/category/${item.id}?tenant=${tenant}`)
            }
            if (item.documentType === "document") {
                props.history.push(`/share/${shareLink}/doc/${item.id}?tenant=${tenant}`)
            }
            if (item.documentType === "markdown") {
                props.history.push(`/share/${shareLink}/markdown/${item.id}?tenant=${tenant}`)
            }
            if (item.documentType === "file") {
                props.history.push(`/share/${shareLink}/file/${item.id}?tenant=${tenant}`)
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
    //更新目录
    const inputRef = React.useRef(null);
    const [isRename, setIsRename] = useState()

    useEffect(() => {
        if (isRename) {
            inputRef.current.autofocus = true;
            let range = getSelection();
            range.selectAllChildren(inputRef.current);
            range.collapseToEnd()
        }
    }, [isRename])


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
                    <span className= "repository-view"
                        ref={isRename === item.id ? inputRef : null}
                        title = {item.name}
                    >{item.name} </span>
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
                        ref={isRename === item.id ? inputRef : null}
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
            collapsed={!isShowText}
            collapsedWidth="50"
            width="250"
            theme={'light'}
        >
            <div className={`repository-aside ${isShowText ? "" : "repository-icon"}`}>
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
export default withRouter(inject("shareStore")(observer(ShareAside)));
