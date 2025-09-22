import { action } from "mobx";
import { Service } from "../../../../common/utils/requset";
import {message} from "antd";

export class RelationWorkStore {

    @action
    findAllProject = async() => {
        const data = await Service("/wiki/kanass/project/findKanassProjectList",{})
        if(data.code !== 0){
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
    findDmUserList = async (params) => {
        const data = await Service("/wiki/kanass/project/findDmUserList",params);
        return data.data
    }

    @action
    findWorkTypeDmList = async(params) => {
        const data = await Service("/wiki/kanass/project/findKanassWorkTypeList", params)
        return data;
    }

    @action
    findWorkItemList = async(params) => {
        const data = await Service("/wiki/kanass/project/findKanassWorkItemPage",params)
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
