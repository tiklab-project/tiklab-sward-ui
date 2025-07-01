/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-15 13:23:14
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-09-15 14:50:10
 */
import { observable, action } from "mobx";
import { ServiceShare } from "../../../common/utils/requset";
class ShareStore {
    @observable tenant = null;

    @action
    setTenant  = (value) => {
        this.tenant = value
    }

    @action
    documentView = async(value)=> {
        const params = new FormData()
        params.append("id", value.documentId)
        const data = await ServiceShare("/document/view", params, this.tenant);
        return data;
    }

    @action
    commentView = async(value)=> {
        const data = await ServiceShare("/comment/view", value, this.tenant);
        return data;
    }

    @action
    verifyAuthCode = async(value)=> {
        const data = await ServiceShare("/share/verifyAuthCode", value, this.tenant);
        return data;
    }

    @action
    judgeAuthCode = async(value)=> {
        const params = new FormData()
        params.append("shareLink", value.shareLink)
        const data = await ServiceShare("/share/judgeAuthCode", value, this.tenant);
        return data;
    }

    @action
    findShareCategory = async(value)=> {
        const data = await ServiceShare("/share/findShareCategory", value, this.tenant);
        return data;
    }

    @action
    findCategory= async(value)=> {
        const params = new FormData()
        params.append("id", value.id)
        const data = await ServiceShare("/category/findCategory", params);
        return data;
    }

    @action
    findSharePage= async (value)=> {
        const data = await ServiceShare("/share/findSharePage", value);
        return data;
    }

    @action
    deleteShare= async (value)=> {
        const params = new FormData()
        params.append("id", value)
        const data = await ServiceShare("/share/deleteShare", params);
        return data;
    }

    @action
    findNodeList= async(value)=> {
        // const params = new FormData()
        // params.append("id", id)
        const data = await ServiceShare("/node/findNodeList", value);
        return data;
    }
}

export default new ShareStore();
