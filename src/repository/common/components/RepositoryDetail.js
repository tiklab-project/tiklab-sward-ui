/*
 * @Descripttion: 知识库详情页入口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-08-30 15:06:15
 */
import React, { useEffect } from "react";
import {observer, inject, Provider} from "mobx-react";
import repositoryDetailStore from "../store/RepositoryDetailStore";
import {getUser} from "tiklab-core-ui";
import RepositoryAside from "../../../common/components/repositoryAside/RepositoryAside";
import RepositoryChangeModal from "./RepositoryChangeModal";

const RepositoryDetail = (props)=>{

    const {systemRoleStore,router} = props;

    const store = {
        repositoryDetailStore: repositoryDetailStore
    }

    const {findRepository,findFileLimit,createRecent} = repositoryDetailStore;
    const {getInitProjectPermissions} = systemRoleStore;

    const repositoryId = props.match.params.repositoryId;
    const userId = getUser().userId
    // 当前选中菜单key
    const path = props.location.pathname.split("/")[3];

    useEffect(() => {
        findRepository(repositoryId).then(res=>{
            if(res.code===0){
                const data = res.data;
                getInitProjectPermissions(userId,repositoryId,data?.projectLimits === "0")
                createRecent({
                    name: data?.name,
                    model: "repository",
                    modelId: repositoryId,
                    master: {id:userId},
                    wikiRepository: {id:repositoryId}
                })
            }
        })
        findFileLimit().then()
    }, [repositoryId]);

    return (
        <Provider {...store}>
            <RepositoryAside
                {...props}
                ChangeModal={RepositoryChangeModal}
                initRouters={router}
                backName={"返回首页"}
                path={path}
                setUrl={`/repository/${repositoryId}/set`}
                backUrl={`/repository`}
            />
        </Provider>
    )

}
export default inject("systemRoleStore")(observer(RepositoryDetail));
