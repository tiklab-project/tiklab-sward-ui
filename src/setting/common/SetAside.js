/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-06-01 13:24:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-28 16:34:32
 */
import React, { Fragment, useState, useEffect } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom";
import { setDevRouter, setPrdRouter } from "./SetRouter"
import { PrivilegeButton } from "tiklab-privilege-ui"
const SetAside = (props) => {
    // 无子级菜单处理
    const [selectKey, setSelectKey] = useState("/organ/organ");

    const [router, setRouterMenu] = useState(setDevRouter)
    const select = (key, index) => {

        props.history.push(key)
        setSelectKey(key)

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
                    className={`orga-aside-li orga-aside-second ${data.id === selectKey ? "orga-aside-select" : ""}`}
                    onClick={() => select(data.id, index)}
                    key={data.code}
                    code={data.encoded}
                >
                    <span className="orga-aside-item-left">
                        {
                            deep === 0 && <svg className="img-icon" aria-hidden="true">
                                <use xlinkHref={`#icon-${data.icon}`}></use>
                            </svg>
                        }

                        <span>{data.title}</span>
                    </span>

                </li>
            </PrivilegeButton>
        )
    }
    // 树的展开与闭合
    const [expandedTree, setExpandedTree] = useState(["/organ/organ"])

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
                        <span to={item.id} className="orga-aside-item-left">
                            <svg className="img-icon" aria-hidden="true">
                                <use xlinkHref={`#icon-${item.icon}`}></use>
                            </svg>
                            <span className="orga-aside-title">{item.title}</span>
                        </span>
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

    return (
        <Fragment>
            <div className="orga-aside">
                <ul style={{ padding: 0 }} key="0" className="orga-aside-top">
                    {
                        router && router.map((firstItem, index) => {
                            return firstItem.children && firstItem.children.length > 0 ?
                                renderSubMenu(firstItem, 0, index) : renderMenu(firstItem, 0, index)
                        })
                    }
                </ul>
                {/* <div className="orga-change" onClick={()=> props.history.push("/organ/organ")}>
                    组织管理
                </div> */}
            </div>

        </Fragment>
    )
}
export default withRouter(SetAside);
