/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-09-26 08:59:04
 */
import React from 'react';
import AsyncComponent from './common/lazy/SyncComponent'
import { Redirect } from "react-router-dom";

const Login = AsyncComponent(() => import('./login/Login'))
const Logout = AsyncComponent(() => import('./login/Logout'))
const Home = AsyncComponent(() => import('./home/home/components/home'))
const Index = AsyncComponent(() => import('./home/home/containers/Portal'))
const WikiDetail = AsyncComponent(() => import('./wiki/common/containers/WikiDetail'))
const Survey = AsyncComponent(() => import('./wiki/survey/containers/Survey'))
const DynamicList = AsyncComponent(() => import("./home/home/components/dynamicList"))

const LogDetail = AsyncComponent(() => import('./wiki/common/components/CategoryDetail'))
const BrainMap = AsyncComponent(() => import('./wiki/brainMapFlow/components/BrainMapFlowExamine'))
const DocumentMindMapEdit = AsyncComponent(() => import('./wiki/brainMapFlow/components/BrainMapFlowEdit'))

// 知识库
const wiki = AsyncComponent(() => import('./wiki/wiki/components/WikiList'))
const DocumentEdit = AsyncComponent(() => import("./wiki/document/components/DocumentEdit"))
const DocumnetExamine = AsyncComponent(() => import("./wiki/document/components/DocumnetExamine"))
const DocumentAddEdit = AsyncComponent(() => import("./wiki/document/components/DocumentAddEdit"))

const WikiSet = AsyncComponent(() => import("./wiki/wikiSet/common/containers/WikiSet"))
const WikiDomainRole = AsyncComponent(() => import('./wiki/user/WikiDomainRole'))
const WikiDomainUser = AsyncComponent(() => import('./wiki/user/WikiDomainUser'))
const WikiBasicInfo = AsyncComponent(() => import('./wiki/wikiSet/basicInfo/containers/BasicInfo'))
const Template = AsyncComponent(() => import('./setting/template/components/template'))
const TemplateAdd = AsyncComponent(() => import('./setting/template/components/templateAddmodal'))
// 分享文档页面
const ShareDocument = AsyncComponent(() => import('./wiki/share/components/ShareDocument'))
// 分享文档页面
const PassWord = AsyncComponent(() => import('./wiki/share/components/PassWord'))


const LoadData = AsyncComponent(() => import('./setting/loadData/LoadData'))

// 消息
const ProjectMessageSendType = AsyncComponent(() => import('./setting/message/ProjectMessageSendType'))
const ProjectMessageType = AsyncComponent(() => import('./setting/message/ProjectMessageType'))
const ProjectMessageTemplate = AsyncComponent(() => import('./setting/message/ProjectMessageTemplate'))
const ProjectMessageManagement = AsyncComponent(() => import('./setting/message/ProjectMessageManagement'))
const ProjectMessageNotice = AsyncComponent(() => import('./setting/message/ProjectMessageNotice'))
const ProjectMessageNoticeSystem = AsyncComponent(() => import('./setting/message/ProjectMessageNoticeSystem'))

const Setting = AsyncComponent(() => import('./setting/common/containers/Setting'))
const ProjectPlugin = AsyncComponent(() => import('./setting/plugin/ProjectPlugin'))

const SystemFeature = AsyncComponent(() => import('./setting/privilege/SystemFeature'))
const SystemRoleBuilt = AsyncComponent(() => import('./setting/privilege/SystemRoleBuilt'))
const SystemRole = AsyncComponent(() => import('./setting/privilege/SystemRole'))
const ProjectFeature = AsyncComponent(() => import('./setting/privilege/ProjectFeature'))
const ProjectRole = AsyncComponent(() => import('./setting/privilege/ProjectRole'))

//组织用户
const OrgaContent = AsyncComponent(() => import('./setting/orga/Orga'))
const OrgaUser = AsyncComponent(() => import('./setting/orga/User'))
const ProjectDirectory = AsyncComponent(() => import("./setting/user/ProjectDirectory"))
const ProjectUserGroup = AsyncComponent(() => import("./setting/user/ProjectUserGroup"))
const ProjectSystemUserGroup = AsyncComponent(() => import("./setting/user/ProjectSystemUserGroup"))


//工时
const TaskListContent = AsyncComponent(() => import('./setting/todo/TaskList.js'))
const TodoTempListContent = AsyncComponent(() => import('./setting/todo/TodoTempList'))
const MyTodoTaskContent = AsyncComponent(() => import('./setting/todo/MyTodoTask'))
const TodoTypeListContent = AsyncComponent(() => import('./setting/todo/TodoTypeList'))

const LogList = AsyncComponent(() => import('./setting/log/Log.js'))
const LogTemplateList = AsyncComponent(() => import('./setting/log/MyLogTemplateList'))
const ProjectLogTypeList = AsyncComponent(() => import('./setting/log/LogTypeList'))

const LicenceVersion = AsyncComponent(() => import('./setting/version/Version'))

const Routes = [
    {
        path: "/login",
        exact: true,
        component: Login,
    },
    {
        path: "/logout",
        exact: true,
        component: Logout,
    },
    {
        path: "/shareDocument/:id/:shareId",
        exact: true,
        component: ShareDocument,
    },
    {
        path: "/passWord/:id/:shareId",
        exact: true,
        component: PassWord,
    },
    {
        path: "/index",
        component: Index,
        routes: [
            {
                path: "/index/home",
                exact: true,
                component: Home,
                key: 'home'
            },
            {
                path: "/index/dynamic",
                exact: true,
                component: DynamicList,
                key: 'dynamic'
            },
            {
                path: "/index/wiki",
                exact: true,
                component: wiki,
                key: 'wiki'

            },
            {
                path: "/index/template",
                exact: true,
                component: Template,
                key: 'template'
            },
            {
                path: "/index/wikidetail/:wikiId",
                component: WikiDetail,
                routes: [
                    {
                        path: "/index/wikidetail/:wikiId/survey",
                        component: Survey
                    },
                    {
                        path: "/index/wikidetail/:wikiId/dynamicList",
                        component: DynamicList
                    },
                    {
                        path: "/index/wikidetail/:wikiId/doc/:id",
                        component: DocumnetExamine
                    },{
                        path: "/index/wikidetail/:wikiId/add/:id",
                        component: DocumentAddEdit
                    },
                    {
                        path: "/index/wikidetail/:wikiId/docEdit/:id",
                        component: DocumentEdit
                    },
                    {
                        path: "/index/wikidetail/:wikiId/folder/:id",
                        component: LogDetail
                    },
                    {
                        path: "/index/wikidetail/:wikiId/mindmap/:id",
                        component: BrainMap
                    },
                    {
                        path: "/index/wikidetail/:wikiId/mindmapEdit/:id",
                        component: DocumentMindMapEdit
                    },
                    {
                        path: "/index/wikidetail/:wikiId/brainMap",
                        component: BrainMap
                    },
                    {
                        path: "/index/wikidetail/:wikiId/wikiSet",
                        component: WikiSet,
                        routes: [
                            {
                                path: "/index/wikidetail/:wikiId/wikiSet/basicInfo",
                                component: WikiBasicInfo
                            },
                            {
                                path: "/index/wikidetail/:wikiId/wikiSet/user",
                                component: WikiDomainUser,
                                exact: true
                            },
                            {
                                path: "/index/wikidetail/:wikiId/wikiSet/domainRole",
                                component: WikiDomainRole
                            }
                        ]
                    },
                    
                ]
            },
            {
                path: "/index/wikiSet/:wikiId",
                component: WikiSet,
                routes: [
                    {
                        path: "/index/wikiSet/:wikiId/basicInfo",
                        component: WikiBasicInfo
                    },
                    {
                        path: "/index/wikiSet/:wikiId/user",
                        component: WikiDomainUser,
                        exact: true
                    },
                    {
                        path: "/index/wikiSet/:wikiId/domainRole",
                        component: WikiDomainRole
                    }
                ]
            },
            {
                path: "/index/wikiSet/:wikiId/basicInfo",
                component: WikiBasicInfo
            },
            {
                path: "/index/setting",
                component: Setting,
                key: 'Setting',
                routes: [
                    {
                        path: "/index/setting/organ",
                        component: OrgaContent,
                        exact: true
                    },
                    {
                        path: "/index/setting/template",
                        exact: true,
                        component: Template,
                        key: 'template'
                    },
                    {
                        path: "/index/setting/templateAdd",
                        component: TemplateAdd,
                        exact: true
                    },
                    {
                        path: "/index/setting/templateView/:templateId",
                        component: TemplateAdd,
                        exact: true
                    },
                    {
                        path: "/index/setting/user",
                        component: OrgaUser,
                        exact: true
                    },
                    {
                        path: "/index/setting/directory",
                        component: ProjectDirectory,
                        exact: true
                    },
                    {
                        path: "/index/setting/usergroup",
                        component: ProjectUserGroup,
                        exact: true
                    },
                    {
                        path: "/index/setting/usersystemgroup",
                        component: ProjectSystemUserGroup,
                        exact: true
                    },
                    // 系统功能管理
                    {
                        path: "/index/setting/systemFeature",
                        component: SystemFeature,
                        exact: true
                    },
                    // 系统内置角色管理
                    {
                        path: "/index/setting/systemRoleBuilt",
                        component: SystemRoleBuilt,
                        exact: true
                    },
                    // 系统角色管理
                    {
                        path: "/index/setting/systemRole",
                        component: SystemRole,
                        exact: true
                    },
                    // 项目功能管理
                    {
                        path: "/index/setting/projectFeature",
                        component: ProjectFeature,
                        exact: true
                    },
                    // 项目角色管理
                    {
                        path: "/index/setting/projectRole",
                        component: ProjectRole,
                        exact: true
                    },
                    {
                        path: "/index/setting/messageManagement",
                        component: ProjectMessageManagement,
                        exact: true
                    },
                    {
                        path: "/index/setting/messageNotice",
                        component: ProjectMessageNotice,
                        exact: true
                    },
                    {
                        path: "/index/setting/messageNoticeSystem",
                        component: ProjectMessageNoticeSystem,
                        exact: true
                    },
                    {
                        path: "/index/setting/messageTemplate",
                        component: ProjectMessageTemplate,
                        exact: true
                    },
                    {
                        path: "/index/setting/messageType",
                        component: ProjectMessageType,
                        exact: true
                    },
                    {
                        path: "/index/setting/messageSendType",
                        component: ProjectMessageSendType,
                        exact: true
                    },

                    {
                        path: "/index/setting/taskList",
                        component: TaskListContent,
                        exact: true
                    },
                    {
                        path: "/index/setting/myTodoTask",
                        component: MyTodoTaskContent,
                        exact: true
                    },
                    {
                        path: "/index/setting/todoTypeTask",
                        component: TodoTypeListContent,
                        exact: true
                    },
                    {
                        path: "/index/setting/todoTempList",
                        component: TodoTempListContent,
                        exact: true
                    },
                    {
                        path: "/index/setting/logList",
                        component: LogList,
                        exact: true
                    },
                    {
                        path: "/index/setting/myLogTemplateList",
                        component: LogTemplateList,
                        exact: true
                    },
                    {
                        path: "/index/setting/projectLogTypeList",
                        component: ProjectLogTypeList,
                        exact: true
                    },
                    {
                        path: "/index/setting/version",
                        component: LicenceVersion,
                        exact: true
                    },
                    {
                        path: "/index/setting/loadData",
                        component: LoadData,
                        exact: true
                    },
                    {
                        path: "/index/setting/plugin",
                        component: ProjectPlugin,
                        exact: true
                    }
                ]
            },
        ]

    },
    {
        path: "/",
        component: () => <Redirect to="/index/home" />,
        exact: true
    },
]
export default Routes;