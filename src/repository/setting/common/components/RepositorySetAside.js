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
import { disableFunction } from 'tiklab-core-ui';
import ArchivedFree from '../../../../common/components/archivedFree/ArchivedFree';

const { Sider } = Layout;

const RepositorySetAside = (props) => {
    const { t } = useTranslation();
    const repositoryId = props.match.params.repositoryId;
    const disable = disableFunction();
    const [archivedFreeVisable, setArchivedFreeVisable] = useState(false)
    const [archivedFreeType,setArchivedFreeType] = useState('documentVersion')

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
            title: '评审',
            icon: 'review',
            key: `/repository/${repositoryId}/set/review`,
            encoded: "review",
            iseEnhance: true
        },
        {
            title: '回收站',
            icon: 'recycleBin',
            key: `/repository/${repositoryId}/set/recycleBin`,
            encoded: "recycleBin",
            iseEnhance: true
        },
    ];
    // 当前选中路由
    const [selectKey, setSelectKey] = useState(`/repository/${repositoryId}/set/basicInfo`);

    // 菜单是否折叠
    const [isShowText, SetIsShowText] = useState(true)

    useEffect(() => {
        // 初次进入激活导航菜单
        setSelectKey(props.location.pathname)
    }, [repositoryId])


    /**
     * 点击左侧菜单
     * @param {*} Item
     */
    const selectKeyFun = (Item) => {
        const {key, iseEnhance, encoded} = Item
        if (iseEnhance && disable) {
            setArchivedFreeVisable(true);
            switch (encoded) {
                case 'review':
                    setArchivedFreeType('documentReview');
                    break
                case 'recycleBin':
                    setArchivedFreeType('defalut')
            }
            return
        }
        setSelectKey(key)
        props.history.push(key)
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
                                    onClick={() => selectKeyFun(Item)}
                                >
                                    <span className={`${isShowText ? "" : "repository-notext"}`}>
                                        {Item.title}
                                    </span>
                                    {/*{*/}
                                    {/*    Item.iseEnhance && versionInfo.expired === true && */}
                                    {/*    <svg className="img-icon-16" aria-hidden="true" >*/}
                                    {/*        <use xlinkHref="#icon-member"></use>*/}
                                    {/*    </svg>*/}
                                    {/* }*/}
                                </div>
                            })
                        }
                    </ul>
                </div>
                <ArchivedFree
                    type={archivedFreeType}
                    archivedFreeVisable={archivedFreeVisable}
                    setArchivedFreeVisable={setArchivedFreeVisable}
                />
            </Sider>
        </Fragment>
    )

}
export default withRouter(RepositorySetAside);
