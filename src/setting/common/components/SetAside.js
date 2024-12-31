/*
 * @Descripttion: 设置导航
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-06-01 13:24:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:08:15
 */
import React, { Fragment, useState, useEffect } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom";
import { setDevRouter, setPrdRouter } from "./SetRouter";
import { PrivilegeButton } from "tiklab-privilege-ui";
import SettingHomeStore from "../../home/store/SettingHomeStore"
import { observer } from 'mobx-react';
import { getVersionInfo } from 'tiklab-core-ui';
import ArchivedFree from '../../../common/components/ArchivedFree';
const SetAside = (props) => {
    // 无子级菜单处理
    const { selectKey, setSelectKey, expandedTree, setExpandedTree } = SettingHomeStore;

    const [router, setRouterMenu] = useState(setDevRouter);
    const authType = JSON.parse(localStorage.getItem("authConfig"))?.authType;
    const versionInfo = getVersionInfo();
    const [archivedFreeVisable, setArchivedFreeVisable] = useState(false)
    const select = (data) => {
        const id = data.id;
        const iseEnhance = data.iseEnhance;
        // getAuthconfig
        if (data.islink && !authType) {
            const authUrl = JSON.parse(localStorage.getItem("authConfig"))?.authServiceUrl + "#" + data.id;
            window.open(authUrl, '_blank');
        } else {
            if (versionInfo.expired === false) {
                props.history.push(id)
                setSelectKey(id)
            } else {
                if (!iseEnhance) {
                    props.history.push(id)
                    setSelectKey(id)
                } else {
                    setArchivedFreeVisable(true)
                }
            }
            
        }
    }


    useEffect(() => {
        if (env === "local") {
            setRouterMenu(setDevRouter)
        }
        if (env !== "local") {
            setRouterMenu(setPrdRouter)
        }

        return
    }, [])


    const renderMenu = (data, deep, index) => {
        return (
            <PrivilegeButton code={data.purviewCode}>
                <li
                    style={{ cursor: "pointer", paddingLeft: `${deep * 20 + 20}` }}
                    className={`orga-aside-item ${data.id === selectKey ? "orga-aside-select" : ""}`}
                    onClick={() => select(data)}
                    key={data.code}
                    code={data.encoded}
                >
                    <span className="orga-aside-item-left">
                        {
                            data.icon && <svg className="icon-15" aria-hidden="true">
                                <use xlinkHref={`#icon-${data.icon}`}></use>
                            </svg>
                        }
                        <span>{data.title}</span>

                    </span>
                    {
                        (data.islink && !authType) && <div className="orga-aside-item-icon">
                            <svg className="icon-15" aria-hidden="true">
                                <use xlinkHref={`#icon-outside`}></use>
                            </svg>
                        </div>
                    }
                    {
                        data.iseEnhance && versionInfo.expired === true && <svg className="img-icon-16" aria-hidden="true" >
                            <use xlinkHref="#icon-member"></use>
                        </svg>
                    }

                </li>
            </PrivilegeButton>

        )
    }


    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }

    const setOpenOrClose = key => {
        if (isExpandedTree(key)) {
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            setExpandedTree(expandedTree.concat(key))
        }
    }

    const renderSubMenu = (item, deep, index) => {

        return (
            <PrivilegeButton code={item.purviewCode}>
                <li key={item.code} title={item.title} className="orga-aside-li">
                    <div className="orga-aside-item orga-aside-first" style={{ paddingLeft: `${deep * 20 + 20}` }} onClick={() => setOpenOrClose(item.id)}>

                        {
                            item.icon && <span to={item.id} className="orga-aside-item-left">
                                <svg className="icon-15" aria-hidden="true">
                                    <use xlinkHref={`#icon-${item.icon}`}></use>
                                </svg>
                                <span className="orga-aside-title">{item.title}</span>
                            </span>
                        }
                        <div className="orga-aside-item-icon">
                            {
                                item.children ?
                                    (isExpandedTree(item.id) ?
                                        <DownOutlined style={{ fontSize: "10px" }} /> :
                                        <UpOutlined style={{ fontSize: "10px" }} />
                                    ) : ""
                            }
                        </div>
                    </div>

                    <ul title={item.title} className={`orga-aside-ul ${isExpandedTree(item.id) ? null : 'orga-aside-hidden'}`}>
                        {
                            item.children && item.children.map(item => {
                                const deepnew = deep + 1
                                return item.children && item.children.length ?
                                    renderSubMenu(item, deepnew, index) : renderMenu(item, deepnew, index)
                            })
                        }
                    </ul>
                </li>
            </PrivilegeButton>

        )
    }

    const backProject = () => {
        props.history.push(`/index`)
        sessionStorage.setItem("menuKey", "home")
    }

    return (
        <Fragment>
            <div className="orga-aside">
                <ul style={{ padding: 0 }} key="0" className="orga-aside-top">
                    <div className="orga-aside-name" onClick={()=> props.history.push("/setting/home")}>设置</div>
                    <div className="orga-aside-back" onClick={() => backProject()}>
                        <svg className="icon-15" aria-hidden="true" >
                            <use xlinkHref="#icon-home-default"></use>
                        </svg>
                        返回首页
                    </div>
                    {
                        router && router.map((firstItem, index) => {
                            return firstItem.children && firstItem.children.length > 0 ?
                                renderSubMenu(firstItem, 0, index) : renderMenu(firstItem, 0, index)
                        })
                    }
                </ul>
                <ArchivedFree
                    archivedFreeVisable={archivedFreeVisable}
                    setArchivedFreeVisable={setArchivedFreeVisable}
                />
            </div>

        </Fragment>
    )
}
export default withRouter(observer(SetAside));
