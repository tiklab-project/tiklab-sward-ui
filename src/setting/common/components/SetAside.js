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
import { observer } from 'mobx-react';
import {disableFunction} from 'tiklab-core-ui';
import ArchivedFree from '../../../common/components/archivedFree/ArchivedFree';
import {Layout} from "antd";
import {renderRoutes} from "react-router-config";
import "./SetAside.scss"


const { Sider, Content } = Layout;

const templateRouter = [
    {
        title: "基础数据",
        icon: 'systemcenter',
        id: '/setting/systemFeature',
        code: 12,
        children: [
            {
                title: '模板',
                id: "/setting/template",
                code: 12 - 1,
            },
            {
                title: '用户组',
                id: '/setting/usersystemgroup',
                purviewCode: "user_group",
                code: 12 - 18,
            },
            {
                title: '虚拟角色',
                id: '/setting/virtual',
                code: "virtual",
            },
            {
                title: '系统功能',
                id: '/setting/systemFeature',
                purviewCode: "SysFeatrueSys",
                code: 12 - 3,
            },
            {
                title: '系统角色',
                id: '/setting/systemRoleBuilt',
                purviewCode: "SysRoleSys",
                code: 12 - 4,
            },
            {
                title: '项目功能',
                id: '/setting/projectFeature',
                purviewCode: "SysFeatrueProject",
                code: 12 - 5,
            },
            {
                title: '项目角色',
                id: '/setting/projectRole',
                purviewCode: "SysRoleProject",
                code: 12 - 6
            },
            {
                title: '消息通知方式',
                id: '/setting/messageNoticeSystem',
                purviewCode: "SysMessageNotice",
                code: 12 - 7,
            },
            {
                title: '项目消息通知方式',
                id: '/setting/projectMessageNotice',
                purviewCode: "SysMessageType",
                code: 12 - 8,
            },
            {
                title: '消息类型',
                id: '/setting/messageType',
                purviewCode: "SysMessageType",
                code: "messageType",
            },

            {
                title: '日志模板',
                id: '/setting/myLogTemplateList',
                // purviewCode: "SysLogTemplate",
                code: 12 - 10,
            },
            {
                title: '日志类型',
                id: '/setting/projectLogTypeList',
                // purviewCode: "SysLogType",
                code: 12 - 11,
            },
            {
                title: '待办模板',
                id: '/setting/todoTempList',
                purviewCode: "SysSetting",
                code: 12 - 12,
            },
            {
                title: '待办类型',
                id: '/setting/todoTypeTask',
                purviewCode: "SysSetting",
                code: 12 - 13,
            }
        ]
    }
]

const SetAside = (props) => {

    const {route,applicationRouters,enhance} = props;
    // 无子级菜单处理
    const { expandedTree, setExpandedTree } = SettingHomeStore;

    const [router, setRouterMenu] = useState(applicationRouters);
    const authConfig = JSON.parse(localStorage.getItem("authConfig"));
    const disable = disableFunction();
    let path = props.location.pathname;

    const [archivedFreeVisable, setArchivedFreeVisable] = useState(false)

    useEffect(() => {
        if (env === "local") {
            setRouterMenu([...applicationRouters,...templateRouter])
        }
        if (env !== "local") {
            setRouterMenu(applicationRouters)
        }
        return
    }, [])

    const select = (data) => {
        const {id,islink,iseEnhance} = data;
        if (islink && !authConfig?.authType) {
            const authUrl = JSON.parse(localStorage.getItem("authConfig"))?.authServiceUrl + "#" + id;
            window.open(authUrl, '_blank');
            return;
        }
        if(iseEnhance && disable){
            if(id==='/setting/archived' || id==='/setting/recycle'){
                setArchivedFreeVisable(true)
                return;
            }
            if(typeof enhance === 'function') {
                enhance(data);
            }
            return;
        }
        props.history.push(id)
    }

    const renderMenu = (data, deep, index) => {
        return (
            <PrivilegeButton code={data.purviewCode} key={data.code}>
                <li
                    style={{ cursor: "pointer", paddingLeft: `${deep * 20 + 20}` }}
                    className={`orga-aside-item ${data.id === path ? "orga-aside-select" : ""}`}
                    onClick={() => select(data)}
                    key={data.code}
                    code={data.encoded}
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
                    {
                        data.iseEnhance && disable &&
                        <svg className="img-icon-16" aria-hidden="true" >
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
            <PrivilegeButton code={item.purviewCode} key={item.code}>
                <li key={item.code} title={item.title} className="orga-aside-li">
                    <div className="orga-aside-item orga-aside-first" style={{ paddingLeft: `${deep * 20 + 20}` }} onClick={() => setOpenOrClose(item.id)}>
                        {
                            item.icon &&
                            <span to={item.id} className="orga-aside-item-left">
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
        <SystemNav
            {...props}
            applicationRouters={router}
            outerPath={"/setting"}
            noAccessPath={"/noaccess"} //没有资源访问权限页面的路由参数
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
                        <ArchivedFree
                            archivedFreeVisable={archivedFreeVisable}
                            setArchivedFreeVisable={setArchivedFreeVisable}
                        />
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
export default withRouter(observer(SetAside));
