/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-22 14:34:53
 */
import { Service } from "../../../common/utils/requset";
import { observable, action, makeObservable} from "mobx";
export class RepositoryDetailStore {
    @observable repository = null;
    // 知识库id
    @observable repositoryCatalogue = [];
    @observable expandedTree = [];
    // 目录树
    @observable repositoryCatalogueList = [];
    @observable documentTitle = "";
    @observable categoryTitle = ""

    @action
    setDocumentTitle = (value) => {
        this.documentTitle = value
    }

    @action
    setCategoryTitle = (value) => {
        this.categoryTitle = value
    }

    @action
    setExpandedTree = (value) => {
        this.expandedTree = value;
    }
    /**
     *
     * @param {*} id
     * @returns
     */
    @action
    setRepositoryCatalogueList = (value) => {
        this.repositoryCatalogueList = value
    }
    /**
     * 设置知识库id
     * @param {*} id
     */
    @action
    findNodePageTree= async(value)=> {
        const data = await Service("/node/findNodePageTree", value)
        return data;
    }

    @action
    findDocument = async(id) => {
        const params = new FormData()
        params.append("id", id)
        const data = await Service("/document/findDocument", params);
        return data;
    }

    @action
    addRepositoryCatalogue= async(params)=> {
        const data = await Service("/category/createCategory", params);
        return data;
    }

    @action
    updateRepositoryCatalogue= async(params)=> {
        const data = await Service("/category/updateCategory", params);
        return data;
    }

    // 删除目录
    @action
    deleteNode= async(value)=> {
        const params = new FormData();
        params.append("id", value)
        const data = await Service("/node/deleteNode", params);
        return data;
    }

    @action
    findCategory= async(value)=> {
        const params = new FormData()
        params.append("id", value.id)
        const data = await Service("/category/findCategory", params);
        return data;
    }

    // 创建文档
    @action
    createDocument = async(params) => {
        const data = await Service("/document/createDocument", params);
        return data;
    }
    // 创建文档
    @action
    updateDocument = async(params) => {
        const data = await Service("/document/updateDocument", params);
        return data;
    }

    // 获取文档

    @action
    findNodeList= async(param)=> {
        const data = await Service("/node/findNodeList", param);
        return data;
    }

    // 查找项目成员
    @action
    findDmUserList= async(id)=> {
        const params ={
            domainId: id,
            pageParam: {pageSize: 10, currentPage: 1}
        }
        const data = await Service("/dmUser/findDmUserList", params);
        return data.data;
    }

    @action
    createRecent= async(value)=> {
        const data = await Service("/recent/createRecent", value);
        return data.data;
    }
    @action
    deleteDocument= async(id)=> {
        const params = new FormData()
        params.append("id", id)
        const data = await Service("/document/deleteDocument", params);
        return data;
    }

    @action
    findRecentList = async(value) => {
        const data = await Service("/recent/findRecentList", value);
        return data;
    }

    @action
    searchRepositoryDocument = async(value) => {
        const data = await Service("/search/searchRepositoryDocument", value);
        return data;
    }

    // 临时搜索方法
    @action
    findNodeList = async(value) => {
        const data = await Service("/node/findNodeList", value);
        return data;
    }

    @action
    findRecentRepositoryList = async (value) => {
        const data = await Service("/repository/findRecentRepositoryList", value);
        return data;
    }


    @action
    getAllRepositorylist = async () => {
        const data = await Service("/repository/findRepositoryListByUser", {});
        return data;
    }

    @action
    findRepository = async (values) => {
        const params = new FormData()
        params.append("id", values)
        const data = await Service("/repository/findRepository", params);
        if(data.code===0){
            this.repository = data.data
        }
        return data;
    }

}

export default new RepositoryDetailStore();
