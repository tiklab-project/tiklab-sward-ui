/*
 * @Descripttion: 设置导航
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-06-01 13:24:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:08:15
 */
import React, {useState, useEffect } from 'react';
import {DownOutlined, UpOutlined} from '@ant-design/icons';
import { withRouter } from "react-router-dom";
import {PrivilegeButton, SystemNav} from "tiklab-privilege-ui";
import SettingHomeStore from "../../home/store/SettingHomeStore"
import {inject, observer} from 'mobx-react';
import {Layout} from "antd";
import {renderRoutes} from "react-router-config";
import "./SetAside.scss"

const { Sider, Content } = Layout;

const templateRouter = [
    {
        title: "基础数据",
        icon: 'systemcenter',
        id: 'base',
        children: [
            {
                title: '模板',
                id: "/setting/template",
            },
            {
                title: '用户组',
                id: '/setting/usersystemgroup',
            },
            {
                title: '虚拟角色',
                id: '/setting/virtual',
            },
            {
                title: '系统功能',
                id: '/setting/systemFeature',
            },
            {
                title: '系统角色',
                id: '/setting/systemRoleBuilt',
            },
            {
                title: '项目功能',
                id: '/setting/projectFeature',
            },
            {
                title: '项目角色',
                id: '/setting/projectRole',
            },
            {
                title: '消息通知方式',
                id: '/setting/messageNoticeSystem',
            },
            {
                title: '项目消息通知方式',
                id: '/setting/projectMessageNotice',
            },
            {
                title: '消息类型',
                id: '/setting/messageType',
            },

            {
                title: '日志模板',
                id: '/setting/myLogTemplateList',
            },
            {
                title: '日志类型',
                id: '/setting/projectLogTypeList',
            },
            {
                title: '待办模板',
                id: '/setting/todoTempList',
            },
            {
                title: '待办类型',
                id: '/setting/todoTypeTask',
            }
        ]
    }
]

const SetAside = (props) => {

    const {route,applicationRouters,systemRoleStore} = props;

    const { expandedTree, setExpandedTree } = SettingHomeStore;
    const {systemPermissions} = systemRoleStore;


    const [router, setRouterMenu] = useState(applicationRouters);
    const authConfig = JSON.parse(localStorage.getItem("authConfig"));
    let path = props.location.pathname;

    useEffect(() => {
        if (env === "local") {
            setRouterMenu([...applicationRouters,...templateRouter])
        }
        if (env !== "local") {
            setRouterMenu(applicationRouters)
        }
    }, [])

    const select = (data) => {
        const {id,islink} = data;
        if (islink && !authConfig?.authType) {
            const authUrl = JSON.parse(localStorage.getItem("authConfig"))?.authServiceUrl + "#" + id;
            window.open(authUrl, '_blank');
            return;
        }
        props.history.push(id)
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

    const backProject = () => {
        props.history.push(`/index`)
    }

    const renderMenu = (data, deep, index) => {
        return (
            <PrivilegeButton code={data.purviewCode} key={data.id}>
                <li
                    style={{ cursor: "pointer", paddingLeft: `${deep * 20 + 20}` }}
                    className={`orga-aside-item ${data.id === path ? "orga-aside-select" : ""}`}
                    onClick={() => select(data)}
                    key={data.id}
                >
                    <span className="orga-aside-item-left">
                        {
                            data.icon &&
                            <svg className="icon-15" aria-hidden="true">
                                <use xlinkHref={`#icon-${data.icon}`}></use>
                            </svg>
                        }
                        <span>{data.title}</span>
                    </span>
                    {
                        (data.islink && !authConfig?.authType) &&
                        <div className="orga-aside-item-icon">
                            <svg className="icon-15" aria-hidden="true">
                                <use xlinkHref={`#icon-outside`}></use>
                            </svg>
                        </div>
                    }
                </li>
            </PrivilegeButton>
        )
    }

    const subMenu = (item, deep, index) => {
        return (
            <li key={item.id} className="orga-aside-li">
                <div
                    className="orga-aside-item orga-aside-first"
                    style={{ paddingLeft: `${deep * 20 + 20}` }}
                    onClick={() => setOpenOrClose(item.id)}
                >
                    {
                        item.icon &&
                        <span className="orga-aside-item-left">
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
                <ul className={`orga-aside-ul ${isExpandedTree(item.id) ? null : 'orga-aside-hidden'}`}>
                    {
                        item.children && item.children.map(item => {
                            const deepnew = deep + 1
                            return item.children && item.children.length ?
                                renderSubMenu(item, deepnew, index) : renderMenu(item, deepnew, index)
                        })
                    }
                </ul>
            </li>
        )
    }

    const renderSubMenu = (item,deep)=> {
        const isCode = item.children.some(list=>!list.purviewCode)
        if(isCode) return subMenu(item,deep)
        const isPromise = item.children.some(list=> systemPermissions.includes(list.purviewCode))
        return isPromise && subMenu(item,deep)
    }

    return (
        <SystemNav
            {...props}
            applicationRouters={router}
            outerPath={"/setting"}
            noAccessPath={"/noaccess"}
        >
            <Layout className="setting-aside">
                <Sider width={200} className="site-layout-background">
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
                    </div>
                    {props.children}
                </Sider>
                <Content className="orga-background">
                    {renderRoutes(route.routes)}
                </Content>
            </Layout>
        </SystemNav>
    )

}
export default inject("systemRoleStore")(observer(SetAside))

