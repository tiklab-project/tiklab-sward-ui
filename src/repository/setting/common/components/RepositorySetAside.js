/*
 * @Descripttion: 知识库设置导航
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:07:38
 */
import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import "./RepositorySetAside.scss";
import {renderRoutes} from "react-router-config";
import {DownOutlined, UpOutlined} from "@ant-design/icons";
import {ProjectNav} from "tiklab-privilege-ui";

const { Sider } = Layout;

const RepositorySetAside = (props) => {

    const {repositoryRouters,route,AsideTitle,outerPath} = props;

    const repositoryId = props.match.params.repositoryId;
    const path = props.location.pathname;

    // 菜单是否折叠
    const [isShowText, SetIsShowText] = useState(true)
    // 树的展开与闭合
    const [expandedTree,setExpandedTree] = useState([""])

    const isExpandedTree = key => expandedTree.some(item => item ===key)

    /**
     * 展开闭合树
     * @param key
     */
    const select = (key) => {
        if (isExpandedTree(key)) {
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            setExpandedTree(expandedTree.concat(key))
        }
    }

    /**
     * 点击左侧菜单
     * @param {*} Item
     */
    const selectKeyFun = (Item) => {
        props.history.push(Item.key)
    }

    const menuHtml = (Item,deep) => {
        return (
            <div
                className={`repository-menu ${(path && path.indexOf(Item.key) !== -1) ? "repository-menu-select" : ""}`}
                key={Item.key}
                onClick={() => selectKeyFun(Item)}
                style={{paddingLeft: deep}}
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
        )
    }

    const renderMenuHtml = (item,deep) => {
        return (
            <div key={item.key} className='repository-menu-ui'>
                <div className="repository-menu-li" onClick={()=>select(item.id)} style={{paddingLeft: deep}}>
                    <div>{item.title}</div>
                    <div>
                        {
                            item.children ?
                                (isExpandedTree(item.id)?
                                        <DownOutlined style={{fontSize: "10px"}}/> :
                                        <UpOutlined style={{fontSize: "10px"}}/>
                                ): ""
                        }
                    </div>
                </div>
                <div className={`repository-menu-ui ${isExpandedTree(item.id)?"":"repository-menu-hidden"}`}>
                    {
                        item.children && item.children.map(item =>{
                            const deepnew = deep + 15
                            return item.children && item.children.length ?
                                renderMenuHtml(item,deepnew) : menuHtml(item,deepnew)
                        })
                    }
                </div>
            </div>
        )
    }

    return (
        <ProjectNav
            {...props}
            domainId={repositoryId}
            projectRouters={repositoryRouters}
            outerPath={outerPath}
            noAccessPath={"/noaccess"}
            pathKey={'key'}
        >
            <Layout className="repository-set">
                <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth="50" width="200">
                    <div className={`repository-set-aside ${isShowText ? "" : "repository-icon"}`}>
                        <div className="repository-set-title">
                        <span className={`${isShowText ? "" : "repository-notext"}`} style={{ marginRight: "20px" }}>
                            {AsideTitle}
                        </span>
                        </div>
                        <div className="repository-menus">
                            { repositoryRouters.map(item=>{
                                return item.children && item.children.length > 0 ?
                                    renderMenuHtml(item,20) : menuHtml(item,20)
                            }) }
                        </div>
                    </div>
                </Sider>
                <Layout>
                    {renderRoutes(route.routes)}
                </Layout>
                {props.children}
            </Layout>
        </ProjectNav>
    )

}
export default withRouter(RepositorySetAside);
