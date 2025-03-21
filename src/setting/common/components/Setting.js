/*
 * @Descripttion: 设置入口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:08:21
 */
import React from 'react';
import SetAside from "./SetAside";

const Setting = (props) => {

    const applicationRouters = [
        {
            title: "用户与权限",
            icon: 'systemuser',
            id: '/setting/orga',
            purviewCode: "orga",
            code: 1,
            children: [

                {
                    title: '用户',
                    id: '/setting/user',
                    easId: '/user/user',
                    purviewCode: "user",
                    islink: true,
                    code: 1 - 2,
                },
                {
                    title: "部门",
                    id: '/setting/orga',
                    easId: '/user/orga',
                    purviewCode: "orga",
                    islink: true,
                    code: 1 - 1,

                },
                {
                    title: '用户组',
                    id: '/setting/userGroup',
                    easId: '/user/userGroup',
                    purviewCode: "user_group",
                    islink: true,
                    code: 1 - 3,
                },
                {

                    title: "用户目录",
                    id: '/setting/dir',
                    easId: '/user/dir',
                    purviewCode: "user_dir",
                    islink: true,
                    code: 1 - 4,
                },
                {
                    title: '权限',
                    id: "/setting/systemRole",
                    purviewCode: "SysPermission",
                    code: 2
                },
            ]
        },
        {
            title: "消息",
            icon: 'systemmessage',
            id: '/setting/messageNotice',
            purviewCode: "SysMessage",
            code: 4,
            children: [
                {
                    title: "消息通知方案",
                    id: '/setting/messageNotice',
                    purviewCode: "SysMessageNotice",
                    code: 4 - 1
                },
                {
                    title: '消息发送方式',
                    id: '/setting/messageSendType',
                    purviewCode: "SysMessageSendType",
                    code: 4 - 2,
                }
            ]
        },
        {
            title: "集成与开放",
            icon: 'systemIntergrtion',
            id: '/setting/loadData',
            code: 9,
            children: [
                {
                    title: '地址配置',
                    id: '/setting/urlData',
                    code: 9 - 1,
                },
                {
                    title: 'Confluence导入',
                    id: '/setting/loadData',
                    code: 9-2,
                },
                {
                    title: 'openApi',
                    id: '/setting/openApi',
                    code: 9-3,
                }
            ]
        },
        {
            title: "安全",
            icon: 'systemlog',
            id: '/setting/log',
            // purviewCode: "SysLog",
            code: 10,
            children: [
                {
                    title: '操作日志',
                    id: '/setting/log',
                    code: 10 - 1,
                },
                {
                    title: '备份与恢复',
                    id: '/setting/backup',
                    code: 10 - 2,
                }
            ]
        },
        {
            title: "系统",
            icon: 'systemversion',
            id: '/setting/version',
            code: 11,
            children: [
                {
                    title: '版本与许可证',
                    id: "/setting/version",
                    code: 11 - 1,
                },
                {
                    title: '系统访问权限',
                    id: "/setting/productAuth",
                    code: 11 - 2,
                }
            ]
        },
        {
            title: '归档',
            icon: 'systemreset',
            id: '/setting/archived',
            code: 'archived',
            iseEnhance: true
        },
        {
            title: '回收站',
            icon: 'systemdelete',
            id: '/setting/recycle',
            code: 'recycle',
            iseEnhance: true
        },
    ];

    return (
        <SetAside
            {...props}
            applicationRouters={applicationRouters}
        >

        </SetAside>
    )
}

export default Setting;
