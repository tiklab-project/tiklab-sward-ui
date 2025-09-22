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
            title: "用户",
            icon: 'systemuser',
            id: 'user',
            children: [
                {
                    title: '用户',
                    id: '/setting/user',
                    easId: '/user/user',
                    purviewCode: "user",
                    islink: true,
                },
                {
                    title: "部门",
                    id: '/setting/orga',
                    easId: '/user/orga',
                    purviewCode: "orga",
                    islink: true,
                },
                {
                    title: '用户组',
                    id: '/setting/userGroup',
                    easId: '/user/userGroup',
                    purviewCode: "user_group",
                    islink: true,
                },
                {

                    title: "用户目录",
                    id: '/setting/dir',
                    easId: '/user/dir',
                    purviewCode: "user_dir",
                    islink: true,
                },
            ]
        },
        {
            title: '权限',
            id: "/setting/systemRole",
            purviewCode: "permission",
            icon: 'systempermissions'
        },
        {
            title: "消息",
            icon: 'systemmessage',
            id: '/setting/message',
            purviewCode: "message",
        },
        {
            title: "集成开放",
            icon: 'systemIntergrtion',
            id: 'integration',
            children: [
                {
                    title: '服务集成',
                    id: '/setting/server',
                    purviewCode: "wiki_service_integration",
                },
                {
                    title: 'Confluence导入',
                    id: '/setting/loadData',
                    purviewCode: "wiki_confluence",
                },
                {
                    title: 'OpenApi',
                    id: '/setting/openApi',
                    purviewCode: "openapi",
                }
            ]
        },
        {
            title: "安全",
            icon: 'systemlog',
            id: 'security',
            children: [
                {
                    title: '备份与恢复',
                    id: '/setting/backup',
                    purviewCode: "backups_and_recover",
                },
            ]
        },
        {
            title: "系统",
            icon: 'systemversion',
            id: 'licence',
            children: [
                {
                    title: '版本与许可证',
                    id: "/setting/version",
                    purviewCode: "licence",
                },
                {
                    title: '系统访问权限',
                    id: "/setting/productAuth",
                    purviewCode: "apply_limits",
                },
            ]
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
