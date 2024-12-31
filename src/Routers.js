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

const Login = AsyncComponent(() => import('./login/Login.js'))
const LoginRpw = AsyncComponent(() => import('./login/LoginRpwContent.js'))
const Logout = AsyncComponent(() => import('./login/Logout.js'))
const Home = AsyncComponent(() => import('./home/home/components/Home.js'))
const ProjectNotFound = AsyncComponent(() => import("./setting/common/components/ProjectNotFond.js"))
const SysExceptionContent = AsyncComponent(() => import("./login/SysExceptionContent.js"))
// 收藏
const Collect = AsyncComponent(() => import("./home/collect/components/CollectAside.js"))
const CollectLayout = AsyncComponent(() => import("./home/collect/components/CollectLayout.js"))
const CollectEmpty  = AsyncComponent(() => import("./home/collect/components/CollectEmpty.js"))

const NoFoundPage = AsyncComponent(() => import('./login/NoFoundPage.js'));
const NoAccessPage = AsyncComponent(() => import('./login/SystemNoAccessPage.js'));
const ProjectNoAccessPage = AsyncComponent(() => import('./login/ProjectNoAccessPage.js'));
const ExcludeProductUserContent = AsyncComponent(() => import('./login/ExcludeProductUserPage.js'))

const Index = AsyncComponent(() => import('./home/home/components/LayoutCe.js'))
const RepositoryDetail = AsyncComponent(() => import('./repository/common/components/RepositoryLayout.js'))
const Survey = AsyncComponent(() => import('./repository/overview/components/Survey.js'))
const DynamicList = AsyncComponent(() => import("./repository/overview/components/DynamicList.js"))
const FocusDocumentList = AsyncComponent(() => import("./home/home/components/FocusDocumentList.js"))
const LogDetail = AsyncComponent(() => import('./repository/category/CategoryDetail.js'))


// 知识库
const Repository = AsyncComponent(() => import('./repository/repository/components/RepositoryList.js'))
const RepositoryDoc = AsyncComponent(() => import('./repository/document/components/RepositoryDoc.js'))
const RepositoryAdd = AsyncComponent(() => import('./repository/repository/components/RepositoryAdd.js'))
const DocumentEdit = AsyncComponent(() => import("./document/document/components/DocumentEdit.js"))
const DocumnetExamine = AsyncComponent(() => import("./document/document/components/DocumnetExamine.js"))

const MarkdownDocumentEdit = AsyncComponent(() => import("./document/markdown/components/MarkdownEdit.js"))
const MarkdownDocumentView = AsyncComponent(() => import("./document/markdown/components/MarkdownView.js"))

const RepositorySet = AsyncComponent(() => import("./repository/setting/common/components/RepositorySet.js"))
const RepositoryDomainRole = AsyncComponent(() => import('./repository/user/RepositoryDomainRole.js'))
const RepositoryDomainUser = AsyncComponent(() => import('./repository/user/RepositoryDomainUser.js'))
const RepositoryBasicInfo = AsyncComponent(() => import('./repository/setting/basicInfo/components/BasicInfo.js'))

// 归档
const Template = AsyncComponent(() => import('./setting/template/components/TemplateList.js'))
const TemplateEdit = AsyncComponent(() => import('./setting/template/components/TemplateEdit.js'))
const TemplatePreview = AsyncComponent(() => import('./setting/template/components/TemplatePreview.js'))
// 分享文档页面
const ShareDocument = AsyncComponent(() => import('./document/share/components/ShareDocument.js'))
const SharePage = AsyncComponent(()=> import('./document/share/components/ShareLayout.js'))
const ShareCategory = AsyncComponent(() => import('./document/share/components/PassWord.js'))
const ShareCategoryDetail = AsyncComponent(() => import('./document/share/components/ShareCategoryDetail.js'))
const ShareMarkdown = AsyncComponent(() => import("./document/share/components/ShareMarkdown.js"))
// 分享文档页面
const PassWord = AsyncComponent(() => import('./document/share/components/PassWord.js'))

const SettingHome = AsyncComponent(() => import('./setting/home/components/SettingHome.js'))
// 消息
const SystemMessageSendType = AsyncComponent(() => import('./setting/message/SystemMessageSendType.js'))
const SystemMessageType = AsyncComponent(() => import('./setting/message/SystemMessageType.js'))
const SystemMessageTemplate = AsyncComponent(() => import('./setting/message/SystemMessageTemplate.js'))
const SystemMessageNotice = AsyncComponent(() => import('./setting/message/SystemMessageNotice.js'))
const SystemMessageNoticeBase = AsyncComponent(() => import('./setting/message/SystemMessageNoticeBase.js'))
const ProjectMessageNoticeContent = AsyncComponent(() => import("./setting/message/ProjectMessageNoticeContent.js"))
const DomainMessageNoticeContent = AsyncComponent(() => import("./repository/setting/projectMessage/DomainMessageNoticeContent.js"))

const Setting = AsyncComponent(() => import('./setting/common/components/Setting.js'))

const SystemFeature = AsyncComponent(() => import('./setting/privilege/SystemFeature.js'))
const SystemRoleBuilt = AsyncComponent(() => import('./setting/privilege/SystemRoleBuilt.js'))
const SystemRole = AsyncComponent(() => import('./setting/privilege/SystemRole.js'))
const ProjectFeature = AsyncComponent(() => import('./setting/privilege/ProjectFeature.js'))
const ProjectRole = AsyncComponent(() => import('./setting/privilege/ProjectRole.js'))

//组织用户
const OrgaContent = AsyncComponent(() => import('./setting/orga/Orga.js'))
const OrgaUser = AsyncComponent(() => import('./setting/orga/User.js'))
const ProjectDirectory = AsyncComponent(() => import("./setting/user/ProjectDirectory.js"))
const ProjectUserGroup = AsyncComponent(() => import("./setting/user/ProjectUserGroup.js"))
const ProjectSystemUserGroup = AsyncComponent(() => import("./setting/user/ProjectSystemUserGroup.js"))
const ProjectVirtualRoleList = AsyncComponent(() => import("./setting/user/ProjectVirtualRoleList.js"))
// 系统集成
const UrlData = AsyncComponent(() => import('./setting/systemIntegration/components/UrlData.js'));
const LoadData = AsyncComponent(() => import('./setting/systemIntegration/components/LoadData.js'));
//工时
const TaskListContent = AsyncComponent(() => import('./setting/todo/TaskList.js'))
const TodoTempListContent = AsyncComponent(() => import('./setting/todo/TodoTempList.js'))
const MyTodoTaskContent = AsyncComponent(() => import('./setting/todo/MyTodoTask.js'))
const TodoTypeListContent = AsyncComponent(() => import('./setting/todo/TodoTypeList.js'))

const LogList = AsyncComponent(() => import('./setting/log/Log.js'))
const LogTemplateList = AsyncComponent(() => import('./setting/log/MyLogTemplateList.js'))
const ProjectLogTypeList = AsyncComponent(() => import('./setting/log/LogTypeList.js'))

const LicenceVersion = AsyncComponent(() => import('./setting/version/Version.js'))
const LicenceProductAuth = AsyncComponent(() => import('./setting/version/Product.js'))
const VailProductUserPage =  AsyncComponent(() => import('./login/VaildProductUserPage.js'))
const BackupRecoveryContent = AsyncComponent(() => import('./setting/backups/Backups.js'))

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
        path:"/500",
        exact:true,
        component:SysExceptionContent,
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
                
        ]
    },
    {
        path: "/passWord/:shareId",
        exact: true,
        component: PassWord,
    },
    {
        path: "/",
        component: () => <Redirect to="/index" />,
        exact: true,
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
                component: TaskListContent,
                exact: true
            },
            {
                path: "/setting/myTodoTask",
                component: MyTodoTaskContent,
                exact: true
            },
            {
                path: "/setting/todoTypeTask",
                component: TodoTypeListContent,
                exact: true
            },
            {
                path: "/setting/todoTempList",
                component: TodoTempListContent,
                exact: true
            },
            {
                path: "/setting/log",
                component: LogList,
                exact: true
            },
            {
                path: "/setting/myLogTemplateList",
                component: LogTemplateList,
                exact: true
            },
            {
                path: "/setting/projectLogTypeList",
                component: ProjectLogTypeList,
                exact: true
            },
            {
                path: "/setting/loadData",
                component: LoadData,
                exact: true
            },
            {
                path: "/setting/urlData",
                component: UrlData,
                exact: true
            },
            {
                path: "/setting/version",
                component: LicenceVersion,
                exact: true
            },
            {
                path: "/setting/productAuth",
                component: LicenceProductAuth,
                exact: true
            },
            {
                path: "/setting/backup",
                component: BackupRecoveryContent,
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
                        path: "/repository/:repositoryId/doc/rich/:id",
                        exact: true,
                        component: DocumnetExamine
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
                        component: DocumnetExamine
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
                path: "/404",
                exact: true,
                component: ProjectNotFound,
                key: 'NotFound'
            },
            {
                path: "/repository",
                exact: true,
                component: Repository,
                key: 'repository'

            },
            {
                path: "/repositoryAdd",
                exact: true,
                component: RepositoryAdd,
                key: 'home'
            },
            {
                path: "/template",
                exact: true,
                component: Template,
                key: 'template'
            },
           
           
            {
                path: "/collect",
                component: CollectLayout,
                key: 'collect',
                routes: [
                    {
                        path: "/collect/doc/:id",
                        exact: true,
                        component: DocumnetExamine
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
                ]
            },
            {  path: "/collectEmpty",
                component: CollectEmpty,
                key: 'collect',
                
            }
            
        ]
    },
]
export default Routes;