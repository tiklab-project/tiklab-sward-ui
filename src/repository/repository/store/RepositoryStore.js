import {action, observable} from "mobx";
import {Service} from "../../../common/utils/requset";

export class RepositoryStore {

    @action
    findRepositoryPage = async (params) => {
        return await Service("/repository/findRepositoryPage", params);
    }

    @action
    findRepositoryListByUser = async (params) => {
        const data = await Service("/repository/findRepositoryListByUser", params);
        return data;
    }

    @action
    addRepositorylist = async (values) => {
        const data = await Service("/repository/createRepository", values);
        return data;
    }

    @action
    delerepositoryList = async (values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await Service("/repository/deleteRepository", param);
        return data;
    }

    // 修改
    @action
    updateRepository = async (values) => {
        const data = await Service("/repository/updateRepository", values);
        return data;

    }

    @action
    getRepositoryTypeList = async () => {
        const data = await Service("/projectType/findAllProjectType");
        return data;
    }

    @action
    getUseList = async () => {
        const data = await Service("/user/user/findAllUser");
        return data;
    }

    @action
    findRecentRepositoryList = async (value) => {
        const data = await Service("/repository/findRecentRepositoryList", value);
        return data;
    }

    @action
    createRepositoryFocus = async (value) => {
        const data = await Service("/repositoryFocus/createRepositoryFocus", value);
        return data;
    }

    @action
    findFocusRepositoryList = async (value) => {
        const data = await Service("/repository/findFocusRepositoryList", value);
        return data;
    }

    @action
    deleteRepositoryFocusByCondition = async (value) => {
        const data = await Service("/repositoryFocus/deleteRepositoryFocusByCondition", value);
        return data;
    }

    /**
     * 上传icon
     */
    @action
    creatIcon = async (value) => {
        const data = await Service("/icon/createIcon", value)
        return data;

    }

    @action
    findIconList = async (params) => {
        const data = await Service("/icon/findIconList", params)
        return data;
    }
    @action
    findRepositoryNum = async(params) => {
        const data = await Service("/repository/findRepositoryNum", params)
        return data;
    }

}

export default new RepositoryStore();
