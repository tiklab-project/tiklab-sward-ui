/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:54:05
 */
import React from 'react';
import AsyncComponent from './common/lazy/SyncComponent.js'
import { Redirect } from "react-router-dom";

const Login = AsyncComponent(() => import('./login/Login'))
const LoginRpw = AsyncComponent(() => import('./login/LoginRpwContent'))
const Logout = AsyncComponent(() => import('./login/Logout'))
const Home = AsyncComponent(() => import('./home/home/components/Home'))
const SysExceptionContent = AsyncComponent(() => import("./login/SysExceptionContent"))
// 收藏
const Collect = AsyncComponent(() => import("./home/collect/components/CollectAside"))
const CollectLayout = AsyncComponent(() => import("./home/collect/components/CollectLayout"))
const CollectEmpty  = AsyncComponent(() => import("./home/collect/components/CollectEmpty"))

const NoFoundPage = AsyncComponent(() => import('./login/NoFoundPage'));
const NoAccessPage = AsyncComponent(() => import('./login/SystemNoAccessPage'));
const ProjectNoAccessPage = AsyncComponent(() => import('./login/ProjectNoAccessPage'));
const ExcludeProductUserContent = AsyncComponent(() => import('./login/ExcludeProductUserPage'))

const Index = AsyncComponent(() => import('./home/home/components/Layout'))
const RepositoryDetail = AsyncComponent(() => import('./repository/common/components/RepositoryLayout'))
const Survey = AsyncComponent(() => import('./repository/overview/components/Survey'))
const DynamicList = AsyncComponent(() => import("./repository/overview/components/DynamicList"))
const FocusDocumentList = AsyncComponent(() => import("./home/home/components/FocusDocumentList"))
const LogDetail = AsyncComponent(() => import('./repository/document/category/CategoryDetail'))


// 知识库
const Repository = AsyncComponent(() => import('./repository/repository/components/RepositoryList'))
const RepositoryDoc = AsyncComponent(() => import('./repository/document/common/RepositoryDoc'))
const DocumentEdit = AsyncComponent(() => import("./document/document/components/DocumentEdit"))
const DocumentExamine = AsyncComponent(() => import("./document/document/components/DocumentExamine"))

const DocumentShare = AsyncComponent(()=>import('./repository/document/share/components/Share'))
const DocumentCollect = AsyncComponent(()=>import('./repository/document/collect/components/Collect'))
const MarkdownDocumentEdit = AsyncComponent(() => import("./document/markdown/components/MarkdownEdit"))
const MarkdownDocumentView = AsyncComponent(() => import("./document/markdown/components/MarkdownView"))

const FileView = AsyncComponent(()=>import("./document/file/components/FileView"))

const RepositorySet = AsyncComponent(() => import("./repository/setting/common/components/RepositorySet"))
const RepositoryDomainRole = AsyncComponent(() => import('./repository/user/RepositoryDomainRole'))
const RepositoryDomainUser = AsyncComponent(() => import('./repository/user/RepositoryDomainUser'))
const RepositoryBasicInfo = AsyncComponent(() => import('./repository/setting/basicInfo/components/BasicInfo'))

// 模版
const Template = AsyncComponent(() => import('./setting/template/components/TemplateList'))
const TemplateEdit = AsyncComponent(() => import('./setting/template/components/TemplateEdit'))
const TemplatePreview = AsyncComponent(() => import('./setting/template/components/TemplatePreview'))
// 分享文档页面
const ShareDocument = AsyncComponent(() => import('./document/share/components/ShareDocument'))
const SharePage = AsyncComponent(()=> import('./document/share/components/ShareLayout'))
const ShareCategoryDetail = AsyncComponent(() => import('./document/share/components/ShareCategoryDetail'))
const ShareMarkdown = AsyncComponent(() => import("./document/share/components/ShareMarkdown"))
const ShareFile = AsyncComponent(() => import("./document/share/components/ShareFile"))
const SharePassWord = AsyncComponent(() => import('./document/share/components/SharePassWord'))


const SettingHome = AsyncComponent(() => import('./setting/home/components/SettingHome'))
// 消息
const SystemMessageSendType = AsyncComponent(() => import('./setting/message/SystemMessageSendType'))
const SystemMessageType = AsyncComponent(() => import('./setting/message/SystemMessageType'))
const SystemMessageTemplate = AsyncComponent(() => import('./setting/message/SystemMessageTemplate'))
const SystemMessageNotice = AsyncComponent(() => import('./setting/message/SystemMessageNotice'))
const SystemMessageNoticeBase = AsyncComponent(() => import('./setting/message/SystemMessageNoticeBase'))
const ProjectMessageNoticeContent = AsyncComponent(() => import("./setting/message/ProjectMessageNoticeContent"))
const DomainMessageNoticeContent = AsyncComponent(() => import("./repository/setting/projectMessage/DomainMessageNoticeContent"))

const Setting = AsyncComponent(() => import('./setting/common/components/Setting'))

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
const ProjectVirtualRoleList = AsyncComponent(() => import("./setting/user/ProjectVirtualRoleList"))

// 系统集成
const UrlData = AsyncComponent(() => import('./setting/integration/urlData/components/UrlData'));
const Confluence = AsyncComponent(() => import('./setting/integration/confluence/components/Confluence'));
const OpenApi = AsyncComponent(()=>import('./setting/integration/openApi/OpenApi'));
const OpenApiDoc = AsyncComponent(()=>import('./setting/integration/openApi/OpenApiDoc'));

const Task = AsyncComponent(() => import('./setting/message/Task'))
const TodoTemp = AsyncComponent(() => import('./setting/message/TodoTemp'))
const MyTodoTask = AsyncComponent(() => import('./setting/message/MyTodoTask'))
const TodoType = AsyncComponent(() => import('./setting/message/TodoType'))

const MyLog = AsyncComponent(() => import('./setting/security/MyLog'))
const LogTemplate = AsyncComponent(() => import('./setting/security/LogTemplate'))
const LogType = AsyncComponent(() => import('./setting/security/LogType'))
const Backups = AsyncComponent(() => import('./setting/security/Backups'))
const RequestError = AsyncComponent(() => import('./setting/security/RequestError'))

const Version = AsyncComponent(() => import('./setting/licence/Version'))
const ProductAuth = AsyncComponent(() => import('./setting/licence/ProductAuth'))

const Routes = [
    {
        path: "/login",
        exact: true,
        component: Login,
    },
    {
        component: LoginRpw,
        exact:true,
        path: '/loginRpw'
    },
    {
        path: "/logout",
        exact: true,
        component: Logout,
    },
    {
        path: "/noAuth",
        exact: true,
        component: ExcludeProductUserContent,
    },
    {
        exact: true,
        path: '/404',
        component: NoFoundPage,
    },
    {
        exact: true,
        path: '/noaccess',
        component: NoAccessPage,
    },
    {
        path:"/requestError",
        exact:true,
        component:RequestError,
    },
    {
        path:"/500",
        exact:true,
        component:SysExceptionContent,
    },
    {
        path:"/openApiDoc",
        exact: true,
        component: OpenApiDoc,
    },
    {
        path: "/share/:shareId",
        component: SharePage,
        routes: [
            {
                path: "/share/:shareId/doc/:id",
                component: ShareDocument,
            },
            {
                path: "/share/:shareId/category/:id",
                component: ShareCategoryDetail,
            },
            {
                path: "/share/:shareId/markdown/:id",
                component: ShareMarkdown,
            },
            {
                path: "/share/:shareId/file/:id",
                component: ShareFile,
            },

        ]
    },
    {
        path: "/passWord/:shareId",
        exact: true,
        component: SharePassWord,
    },
    {
        path: "/",
        component: () => <Redirect to="/index" />,
        exact: true,
    },
    {
        path: "/",
        component: Index,
        routes: [
            {
                path: "/index",
                exact: true,
                component: Home,
                key: 'home'
            },
            {
                path: "/focusDocumentList",
                exact: true,
                component: FocusDocumentList,
                key: 'focusDocumentList'
            },
            {
                path: "/repository",
                exact: true,
                component: Repository,
                key: 'repository'

            },
            {
                path: "/collect",
                component: CollectLayout,
                key: 'collect',
                routes: [
                    {
                        path: "/collect/doc/:id",
                        exact: true,
                        component: DocumentExamine
                    },
                    {
                        path: "/collect/doc/:id/edit",
                        exact: true,
                        component: DocumentEdit
                    },
                    {
                        path: "/collect/markdown/:id",
                        component: MarkdownDocumentView,
                        exact: true
                    },

                    {
                        path: "/collect/markdown/:id/edit",
                        component: MarkdownDocumentEdit
                    },
                    {
                        path: "/collect/file/:id",
                        component: FileView
                    },
                ]
            },
            {
                path: "/collectEmpty",
                component: CollectEmpty,
                key: 'collect',
            },
            {
                path: "/setting",
                component: Setting,
                key: 'Setting',
                routes: [

                    {
                        path: "/setting/home",
                        component: SettingHome,
                        row: true,
                        exact: true
                    },
                    {
                        path: "/setting/orga",
                        component: OrgaContent,
                        row: true,
                        exact: true
                    },
                    {
                        path: "/setting/template",
                        exact: true,
                        component: Template,
                        key: 'template'
                    },
                    {
                        path: "/setting/templateAdd",
                        component: TemplateEdit,
                        exact: true
                    },
                    {
                        path: "/setting/templateView/:templateId",
                        component: TemplatePreview,
                        exact: true
                    },
                    {
                        path: "/setting/templateAdd/:templateId",
                        component: TemplateEdit,
                        exact: true
                    },
                    {
                        path: "/setting/user",
                        component: OrgaUser,
                        exact: true
                    },
                    {
                        path: "/setting/dir",
                        component: ProjectDirectory,
                        exact: true
                    },
                    {
                        path: "/setting/userGroup",
                        component: ProjectUserGroup,
                        exact: true
                    },
                    {
                        path: "/setting/usersystemgroup",
                        component: ProjectSystemUserGroup,
                        exact: true
                    },
                    {
                        path: "/setting/virtual",
                        component: ProjectVirtualRoleList,
                        exact: true
                    },
                    // 系统功能管理
                    {
                        path: "/setting/systemFeature",
                        component: SystemFeature,
                        exact: true
                    },
                    // 系统内置角色管理
                    {
                        path: "/setting/systemRoleBuilt",
                        component: SystemRoleBuilt,
                        exact: true
                    },
                    // 系统角色管理
                    {
                        path: "/setting/systemRole",
                        component: SystemRole,
                        exact: true
                    },
                    // 项目功能管理
                    {
                        path: "/setting/projectFeature",
                        component: ProjectFeature,
                        exact: true
                    },
                    // 项目角色管理
                    {
                        path: "/setting/projectRole",
                        component: ProjectRole,
                        exact: true
                    },
                    {
                        path: "/setting/messageNotice",
                        component: SystemMessageNotice,
                        row: true,
                        exact: true
                    },
                    {
                        path: "/setting/messageNoticeSystem",
                        component: SystemMessageNoticeBase,
                        row: true,
                        exact: true
                    },
                    {
                        path: "/setting/projectMessageNotice",
                        component: ProjectMessageNoticeContent,
                        row: true,
                        exact: true
                    },

                    {
                        path: "/setting/messageTemplate",
                        component: SystemMessageTemplate,
                        row: true,
                        exact: true
                    },
                    {
                        path: "/setting/messageType",
                        component: SystemMessageType,
                        row: true,
                        exact: true
                    },
                    {
                        path: "/setting/messageSendType",
                        component: SystemMessageSendType,
                        row: true,
                        exact: true
                    },

                    {
                        path: "/setting/taskList",
                        component: Task,
                        exact: true
                    },
                    {
                        path: "/setting/myTodoTask",
                        component: MyTodoTask,
                        exact: true
                    },
                    {
                        path: "/setting/todoTypeTask",
                        component: TodoType,
                        exact: true
                    },
                    {
                        path: "/setting/todoTempList",
                        component: TodoTemp,
                        exact: true
                    },
                    {
                        path: "/setting/log",
                        component: MyLog,
                        exact: true
                    },
                    {
                        path: "/setting/myLogTemplateList",
                        component: LogTemplate,
                        exact: true
                    },
                    {
                        path: "/setting/projectLogTypeList",
                        component: LogType,
                        exact: true
                    },
                    {
                        path: "/setting/loadData",
                        component: Confluence,
                        exact: true
                    },
                    {
                        path: "/setting/openApi",
                        component: OpenApi,
                        exact: true
                    },
                    {
                        path: "/setting/urlData",
                        component: UrlData,
                        exact: true
                    },
                    {
                        path: "/setting/version",
                        component: Version,
                        exact: true
                    },
                    {
                        path: "/setting/productAuth",
                        component: ProductAuth,
                        exact: true
                    },
                    {
                        path: "/setting/backup",
                        component: Backups,
                        exact: true
                    }
                ]
            },
            {
                path: "/repository/:repositoryId",
                component: RepositoryDetail,
                routes: [
                    {
                        path: "/repository/:id/noAccess",
                        exact: true,
                        component: ProjectNoAccessPage
                    },
                    {
                        path: "/repository/:repositoryId/overview",
                        component: Survey
                    },
                    {
                        path: "/repository/:repositoryId/dynamicList",
                        component: DynamicList
                    },
                    {
                        path: "/repository/:repositoryId/focusDocumentList",
                        component: FocusDocumentList
                    },
                    {
                        path: "/repository/:repositoryId/doc",
                        component: RepositoryDoc,
                        routes: [
                            {
                                path: "/repository/:repositoryId/doc/share",
                                exact: true,
                                component: DocumentShare
                            },
                            {
                                path: "/repository/:repositoryId/doc/collect",
                                exact: true,
                                component: DocumentCollect
                            },
                            {
                                path: "/repository/:repositoryId/doc/rich/:id",
                                exact: true,
                                component: DocumentExamine
                            },
                            {
                                path: "/repository/:repositoryId/doc/rich/:id/edit",
                                exact: true,
                                component: DocumentEdit
                            },
                            {
                                path: "/repository/:repositoryId/doc/markdown/:id",
                                component: MarkdownDocumentView,
                                exact: true
                            },
                            {
                                path: "/repository/:repositoryId/doc/markdown/:id/edit",
                                component: MarkdownDocumentEdit
                            },
                            {
                                path: "/repository/:repositoryId/doc/file/:id",
                                component: FileView,
                                exact: true
                            },
                            {
                                path: "/repository/:repositoryId/doc/folder/:id",
                                component: LogDetail
                            },
                        ]
                    },
                    {
                        path: "/repository/:repositoryId/collect",
                        component: CollectLayout,
                        key: 'collect',
                        routes: [
                            {
                                path: "/repository/:repositoryId/collect/rich/:id",
                                exact: true,
                                component: DocumentExamine
                            },
                            {
                                path: "/repository/:repositoryId/collect/rich/:id/edit",
                                exact: true,
                                component: DocumentEdit
                            },
                            {
                                path: "/repository/:repositoryId/collect/markdown/:id",
                                component: MarkdownDocumentView,
                                exact: true
                            },
                            {
                                path: "/repository/:repositoryId/collect/markdown/:id/edit",
                                component: MarkdownDocumentEdit
                            },
                            {
                                path: "/repository/:repositoryId/collect/file/:id",
                                component: FileView
                            },
                        ]
                    },
                    // {
                    //     path: "/repositorySet/:repositoryId",
                    //     component: RepositorySet,
                    //     routes: [
                    //         {
                    //             path: "/repositorySet/:repositoryId/basicInfo",
                    //             component: RepositoryBasicInfo
                    //         },
                    //         {
                    //             path: "/repositorySet/:repositoryId/user",
                    //             component: RepositoryDomainUser,
                    //             exact: true
                    //         },
                    //         {
                    //             path: "/repositorySet/:repositoryId/domainRole",
                    //             component: RepositoryDomainRole
                    //         },
                    //         {
                    //             path: "/repositorySet/:repositoryId/messagenotice",
                    //             component: DomainMessageNoticeContent,
                    //         }
                    //     ]
                    // },
                    {
                        path: "/repository/:repositoryId/set",
                        component: RepositorySet,
                        routes: [
                            {
                                path: "/repository/:repositoryId/set/basicInfo",
                                component: RepositoryBasicInfo
                            },
                            {
                                path: "/repository/:repositoryId/set/user",
                                component: RepositoryDomainUser,
                                exact: true
                            },
                            {
                                path: "/repository/:repositoryId/set/domainRole",
                                component: RepositoryDomainRole
                            },
                            {
                                path: "/repository/:repositoryId/set/messagenotice",
                                component: DomainMessageNoticeContent,
                            }
                        ]
                    },

                ]
            },
        ]
    },
]

export default Routes;
