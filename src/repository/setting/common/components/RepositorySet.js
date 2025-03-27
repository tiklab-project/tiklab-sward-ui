/*
 * @Descripttion: 知识库设置入口页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:07:27
 */
import React, { useState,useEffect } from "react";
import { Layout } from 'antd';
import RepositorySetAside from "../components/RepositorySetAside";
import "../components/repositorySet.scss";
import { renderRoutes } from "react-router-config";
import RepositorySetStore from "../store/RepositorySetStore";
import { Provider } from "mobx-react";

const RepositorySetDetail = (props)=>{
    const route = props.route;
    const store = {
        repositorySetStore: RepositorySetStore
    }

    // 当前项目名字
    const [repositoryname,setRepositoryname] = useState();

    // 获取当前项目id
    const repositoryId = props.match.params.id;


    useEffect(() => {
        // 从信息页面跳入项目详情页面时，获取项目id
        let search = props.location.search;
        if(search !== "") {
            search = search.split("=")
            localStorage.setItem("repositoryId", search[1]);
        }
    }, [repositoryId])


    return (
         <Provider {...store}>
             <Layout className="repository-set">
                 <RepositorySetAside
                     repositoryName={repositoryname}
                     {...props}
                 />
                 <Layout>
                     {renderRoutes(route.routes)}
                 </Layout>
             </Layout>
         </Provider>
    )

}
export default RepositorySetDetail;
