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

const NoFoundPage = AsyncComponent(() => import('./login/NoFoundPage'));
const NoAccessPage = AsyncComponent(() => import('./setting/privilege/NoAccess'));
const ProjectNoAccessPage = AsyncComponent(() => import('./login/ProjectNoAccessPage'));
const ExcludeProductUserContent = AsyncComponent(() => import('./login/ExcludeProductUserPage'))

const Index = AsyncComponent(() => import('./home/home/components/Layout'))
const RepositoryDetail = AsyncComponent(() => import('./repository/common/components/RepositoryLayout'))
const Survey = AsyncComponent(() => import('./repository/overview/components/Survey'))
const DynamicList = AsyncComponent(() => import("./repository/overview/components/DynamicList"))
const LogDetail = AsyncComponent(() => import('./repository/document/category/CategoryDetail'))
// 收藏
const CollectLayout = AsyncComponent(() => import("./home/collect/components/CollectLayout"))


// 知识库
const Repository = AsyncComponent(() => import('./repository/repository/components/Repository'))
const RepositoryDoc = AsyncComponent(() => import('./repository/document/common/RepositoryDoc'))
const DocumentEdit = AsyncComponent(() => import("./repository/document/document/components/DocumentEdit"))
const DocumentExamine = AsyncComponent(() => import("./repository/document/document/components/DocumentExamine"))

const DocumentShare = AsyncComponent(()=>import('./repository/document/share/components/Share'))
const DocumentCollect = AsyncComponent(()=>import('./repository/document/collect/components/Collect'))
const MarkdownDocumentEdit = AsyncComponent(() => import("./repository/document/markdown/components/MarkdownEdit"))
const MarkdownDocumentView = AsyncComponent(() => import("./repository/document/markdown/components/MarkdownView"))

const FileView = AsyncComponent(()=>import("./repository/document/file/components/FileView"))

const RepositorySet = AsyncComponent(() => import("./repository/setting/common/components/RepositorySet"))
const RepositoryDomainRole = AsyncComponent(() => import('./repository/user/RepositoryDomainRole'))
const RepositoryDomainUser = AsyncComponent(() => import('./repository/user/RepositoryDomainUser'))
const RepositoryBasicInfo = AsyncComponent(() => import('./repository/setting/basicInfo/components/BasicInfo'))

// 模版
const Template = AsyncComponent(() => import('./setting/template/components/Template'))
const TemplateEdit = AsyncComponent(() => import('./setting/template/components/TemplateEdit'))
const TemplatePreview = AsyncComponent(() => import('./setting/template/components/TemplatePreview'))

// 分享文档页面
const SharePage = AsyncComponent(()=> import('./repository/document/share/components/ShareLayout'))
const ShareDocument = AsyncComponent(() => import('./repository/document/share/components/ShareDocument'))
const ShareCategoryDetail = AsyncComponent(() => import('./repository/document/share/components/ShareCategoryDetail'))
const ShareMarkdown = AsyncComponent(() => import("./repository/document/share/components/ShareMarkdown"))
const ShareFile = AsyncComponent(() => import("./repository/document/share/components/ShareFile"))
const SharePassWord = AsyncComponent(() => import('./repository/document/share/components/SharePassWord'))

const Setting = AsyncComponent(() => import('./setting/common/components/Setting'))
const SettingHome = AsyncComponent(() => import('./setting/home/components/SettingHome'))
// 消息
const SystemMessage = AsyncComponent(() => import('./setting/message/Message'))
const DomainMessageNoticeContent = AsyncComponent(() => import("./repository/setting/projectMessage/DomainMessageNoticeContent"))

//组织用户
const OrgaContent = AsyncComponent(() => import('./setting/user/Orga'))
const OrgaUser = AsyncComponent(() => import('./setting/user/User'))
const ProjectDirectory = AsyncComponent(() => import("./setting/user/Directory"))
const ProjectUserGroup = AsyncComponent(() => import("./setting/user/UserGroup"))

// 系统集成
const Server = AsyncComponent(() => import('./setting/integration/server/components/Server'));

const Confluence = AsyncComponent(() => import('./setting/integration/confluence/components/Confluence'));
const OpenApi = AsyncComponent(()=>import('./setting/integration/openApi/OpenApi'));
const OpenApiDoc = AsyncComponent(()=>import('./setting/integration/openApi/OpenApiDoc'));

const Backups = AsyncComponent(() => import('./setting/security/Backups'))
const RequestError = AsyncComponent(() => import('./setting/security/RequestError'))

const Version = AsyncComponent(() => import('./setting/licence/Version'))
const ProductAuth = AsyncComponent(() => import('./setting/licence/ProductAuth'))

//基础数据
const SystemMessageType = AsyncComponent(() => import('./setting/base/message/SystemMessageType'))
const SystemMessageTemplate = AsyncComponent(() => import('./setting/base/message/SystemMessageTemplate'))
const SystemMessageNoticeBase = AsyncComponent(() => import('./setting/base/message/SystemMessageNoticeBase'))
const ProjectMessageNoticeContent = AsyncComponent(() => import("./setting/base/message/ProjectMessageNoticeContent"))

const Task = AsyncComponent(() => import('./setting/base/message/Task'))
const TodoTemp = AsyncComponent(() => import('./setting/base/message/TodoTemp'))
const MyTodoTask = AsyncComponent(() => import('./setting/base/message/MyTodoTask'))
const TodoType = AsyncComponent(() => import('./setting/base/message/TodoType'))

const SystemFeature = AsyncComponent(() => import('./setting/base/privilege/SystemFeature'))
const SystemRoleBuilt = AsyncComponent(() => import('./setting/base/privilege/SystemRoleBuilt'))
const SystemRole = AsyncComponent(() => import('./setting/privilege/SystemRole'))
const ProjectFeature = AsyncComponent(() => import('./setting/base/privilege/ProjectFeature'))
const ProjectRole = AsyncComponent(() => import('./setting/base/privilege/ProjectRole'))

const ProjectSystemUserGroup = AsyncComponent(() => import("./setting/base/user/UserGroup"))
const ProjectVirtualRoleList = AsyncComponent(() => import("./setting/base/user/ProjectVirtualRole"))

const LogTemplate = AsyncComponent(() => import('./setting/base/security/LogTemplate'))
const LogType = AsyncComponent(() => import('./setting/base/security/LogType'))

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
                path: "/repository",
                exact: true,
                component: Repository,
                key: 'repository'
            },
            {
                exact: true,
                path: '/noaccess',
                component: NoAccessPage,
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
                        path: "/setting/message",
                        component: SystemMessage,
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
                        path: "/setting/server",
                        component: Server,
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
                        exact: true,
                        path: '/repository/:repositoryId/noaccess',
                        component: NoAccessPage,
                    },
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
                        path: "/repository/:repositoryId/share",
                        exact: true,
                        component: DocumentShare
                    },
                    {
                        path: "/repository/:repositoryId/collect",
                        exact: true,
                        component: DocumentCollect
                    },
                    {
                        path: "/repository/:repositoryId/doc",
                        component: RepositoryDoc,
                        routes: [
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
                            },
                            {
                                path: "/repository/:repositoryId/set/share",
                                exact: true,
                                component: DocumentShare
                            },
                        ]
                    },

                ]
            },
        ]
    },
]

export default Routes;
