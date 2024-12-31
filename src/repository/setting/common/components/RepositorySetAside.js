/*
 * @Descripttion: 知识库设置导航
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:07:38
 */

import React, { Fragment, useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Layout, Button } from "antd";

import { useTranslation } from 'react-i18next';
import { getVersionInfo } from 'tiklab-core-ui';
import ArchivedFree from '../../../../common/components/ArchivedFree';

const { Sider } = Layout;

const RepositorySetAside = (props) => {
    const { t } = useTranslation();
    const repositoryId = props.match.params.repositoryId;
    const versionInfo = getVersionInfo();
    const [archivedFreeVisable, setArchivedFreeVisable] = useState(false)
    // 路由
    const repositoryrouter = [
        {
            title: '知识库信息',
            icon: 'survey',
            key: `/repository/${repositoryId}/set/basicInfo`,
            encoded: "Survey",
            iseEnhance: false
        },
        {
            title: '成员',
            icon: 'survey',
            key: `/repository/${repositoryId}/set/user`,
            encoded: "User",
            iseEnhance: false
        },
        {
            title: '权限',
            icon: 'survey',
            key: `/repository/${repositoryId}/set/domainRole`,
            encoded: "Privilege",
            iseEnhance: false
        },
        {
            title: '消息',
            icon: 'survey',
            key: `/repository/${repositoryId}/set/messagenotice`,
            encoded: "message",
            iseEnhance: false
        },
        {
            title: '归档',
            icon: 'archived',
            key: `/repository/${repositoryId}/set/archivedNode`,
            encoded: "archived",
            iseEnhance: true
        },
        {
            title: '回收站',
            icon: 'recycleBin',
            key: `/repository/${repositoryId}/set/recycleBin`,
            encoded: "recycleBin",
            iseEnhance: true
        }
    ];
    // 当前选中路由
    const [selectKey, setSelectKey] = useState(`/repository/${repositoryId}/set/basicInfo`);

    // 菜单是否折叠
    const [isShowText, SetIsShowText] = useState(true)

    useEffect(() => {
        // 初次进入激活导航菜单
        setSelectKey(props.location.pathname)
        return
    }, [repositoryId])


    /**
     * 点击左侧菜单
     * @param {*} key 
     */
    const selectKeyFun = (key, iseEnhance) => {
        if (versionInfo.expired === false) {
            setSelectKey(key)
            props.history.push(key)
        } else {
            if (!iseEnhance) {
                setSelectKey(key)
                props.history.push(key)
            } else {
                setArchivedFreeVisable(true)
            }
        }



    }

    const backRepository = () => {
        props.history.push(`/repository/${repositoryId}/overview`)
    }

    return (
        <Fragment>
            <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth="50" width="200">
                <div className={`repository-set-aside ${isShowText ? "" : "repository-icon"}`}>
                    <div className="repository-set-title">
                        {/* <svg className="menu-icon" aria-hidden="true" onClick={() => backRepository()}>
                            <use xlinkHref="#icon-backrepository"></use>
                        </svg> */}
                        <span className={`${isShowText ? "" : "repository-notext"}`} style={{ marginRight: "20px" }}>
                            设置
                        </span>
                    </div>
                    <ul className="repository-menu">
                        {
                            repositoryrouter && repositoryrouter.map(Item => {
                                return <div className={`repository-menu-submenu ${Item.key === selectKey ? "repository-menu-select" : ""}`}
                                    key={Item.key}
                                    onClick={() => selectKeyFun(Item.key, Item.iseEnhance)}
                                >
                                    <span className={`${isShowText ? "" : "repository-notext"}`}>
                                        {Item.title}
                                    </span>
                                    {
                                        Item.iseEnhance && versionInfo.expired === true &&  <svg className="img-icon-16" aria-hidden="true" >
                                        <use xlinkHref="#icon-member"></use>
                                    </svg>
                                     }
                                </div>
                            })
                        }
                    </ul>
                </div>
                <ArchivedFree
                    archivedFreeVisable={archivedFreeVisable}
                    setArchivedFreeVisable={setArchivedFreeVisable}
                />
            </Sider>
        </Fragment>
    )

}
export default withRouter(RepositorySetAside);