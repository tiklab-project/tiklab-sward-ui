/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 09:44:02
 */
import { observable, action  } from "mobx";
import { Service } from "../../../common/utils/requset";
//删除事项
class SearchStore{
    @observable searchWikiList = []
    @observable searchDocumentList = []
    @observable sortList = []
    @observable keyword = ""
    @observable searchCondition = {
        pageSize: 10,
        currentPage: 1
    }

    @action
    setKeyWord = (value) => {
        this.keyword = value
    }

    @action
    getSearch = async (value) => {
        this.searchWikiList = [];
        this.searchDocumentList = [];
        const data = await Service("/search/searchForTop",value);
        if(data.code=== 0){
            this.searchWikiList = data.data.wiki;
            this.searchDocumentList = data.data.document;
        }
        return data;
    }

    // 临时替代
    @action
    findNodeList = async(value) => {
        const data = await Service("/node/findNodeList", value);
        this.searchDocumentList = data.data;
        return data;
    }

    @action
    findRepositoryListByUser = async(value) => {
        const data = await Service("/repository/findRepositoryListByUser", value);
        this.searchWikiList = data.data;
        return data;
    }

    @action
    getSearchSore = async(value) => {
        const params = new FormData();
        if(value){
            params.append('keyword', value );
        }else {
            params.append('keyword', null );
        }
        const data = await Service("/search/searchForCount",value);
        if(data.code=== 0){
            this.sortList = data.data.responseList;
        }
        return data;
    }

    @action
    searchForPage = async(value) => {
        Object.assign(this.searchCondition, {...value})
        const params={
            index: this.searchCondition.index,
            keyword: this.searchCondition.keyword,
            pageCondition: {
                pageSize: 10,
                currentPage: this.searchCondition.currentPage,
                lastRecord: this.searchCondition.lastRecord,
            }
        }
        const data = await Service("/search/searchForPage",params);
        if(data.code=== 0){
            this.searchCondition.total = response.data.totalRecord;
        }
        return data;
    }

    @action
    findDocumentRecentList= async(value)=> {
        const data = await Service("/recent/findRecentList",value);
        if(data.code === 0){
            this.searchDocumentList = data.data;

        }

        return data;
    }

    @action
    findRecentRepositoryList= async(value)=> {
        const data = await Service("/repository/findRecentRepositoryList",value);
        if(data.code === 0){
            this.searchWikiList = data.data;
        }
        return data;
    }
}

export default new SearchStore();
