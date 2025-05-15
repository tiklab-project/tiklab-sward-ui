/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-08 14:58:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-09-08 16:34:04
 */
import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset";
class TemplateStore {
    @observable templateList = [];
    @observable templatePageParams = {
        current: 1,
        pageSize: 10,
        total: 1
    };

    @action
    setTemPlateList = (value) => {
        this.templateList = value;
    }

    @action
	createDocumentTemplate = async(value) => {
        const data = await Service("/documentTemplate/createDocumentTemplate",value);
        return data;
    }

    @action
	findDocumentTemplateList = async(value) => {
        Object.assign(this.templatePageParams, {...value})
        const params = {
            name: this.templatePageParams.name,
            orderParams: [{
                name: "name",
                orderType: "asc"
            }]
        }
        const data = await Service("/documentTemplate/findDocumentTemplateList",params);
        if(data.code === 0){
            this.templateList = data.data
        }
        return data;
    }

    @action
	findDocumentTemplate = async(values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await Service("/documentTemplate/findDocumentTemplate",param);
        return data
    }

    @action
	updateDocumentTemplate = async(value) => {
        const data = await Service("/documentTemplate/updateDocumentTemplate",value);
        return data;
    }

    @action
	deleteDocumentTemplate = async(values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await Service("/documentTemplate/deleteDocumentTemplate",param);
        return data
    }

    @action
    findIconList = async (params) => {
        const data = await Service("/icon/findIconList", params)
        return data;
    }

    @action
    creatIcon = async (value) => {
        const data = await Service("/icon/createIcon", value)
        return data;

    }

    @action
    upload = async(value) => {
        const data = await Service("/dfs/upload", value)
        return data;
    }

}
export default new TemplateStore();
