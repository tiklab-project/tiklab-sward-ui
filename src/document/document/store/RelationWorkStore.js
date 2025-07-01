import { observable, action} from "mobx";
import { Service } from "../../../common/utils/requset";
import {message} from "antd";
export class RelationWorkStore {
    @observable projectList = [];
    @observable userList = [];
    @observable workTypeList = [];
    @observable workList = [];
    @observable searchCondition = {
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    }
    @observable total = 0

    @action
    findAllProject = async() => {
        const data = await Service("/wiki/kanass/project/findKanassProjectList",{})
        if(data.code === 0){
            this.projectList = data.data;
        } else {
            message.error(data.msg)
        }
        return data;
    }

    @action
    findKanassProjectPage = async() => {
        const data = await Service("/wiki/kanass/project/findKanassProjectPage")
        return data;
    }

    @action
    findDmUserPage = async (params) => {
        if(!params || JSON.stringify(params) === '{}'){
            this.userList = []
            return
        }
        const data = await Service("/wiki/kanass/project/findDmUserList",params);
        if(data.code === 0){
            this.userList = data.data || [];
        }
        return data.data
    }

    @action
    findWorkTypeDmList = async(params) => {
        if(!params || JSON.stringify(params) === '{}'){
            this.workTypeList = []
            return
        }
        const data = await Service("/wiki/kanass/project/findKanassWorkTypeList", params)
        if(data.code === 0){
            this.workTypeList = data.data  || [];
        }
        return data;
    }

    @action
    findWorkItemList = async(params) => {
        Object.assign(this.searchCondition, {...params})
        const data = await Service("/wiki/kanass/project/findKanassWorkItemPage", this.searchCondition)
        if(data.code === 0){
            this.workList = data.data?.dataList;
            this.total = data.data?.totalRecord
        }
        return data;
    }

    @action
    findWorkItem = async(param) => {
        const value = new FormData();
        value.append("workItemId", param.id)
        const data = await Service("/wiki/kanass/project/findKanassWorkItem", value)
        return data;
    }

    @action
    findSystemUrl = async(params) => {
        const data = await Service("/systemUrl/findSystemUrlList", params)
        let urlData;
        if(data.code === 0 && data.data.length > 0){
            urlData = data.data[0]
        }
        return urlData;
    }

}
export const RELATIONWORK_STORE = "relationWorkStore"
