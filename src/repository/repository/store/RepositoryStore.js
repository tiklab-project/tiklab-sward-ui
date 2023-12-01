import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset";
export class RepositoryStore {
    @observable repositorylist = [];
    @observable repositoryTypelist = [];
    @observable uselist = [];
    @observable repository = [];
    @observable allRepositorylist = [];
    @observable name = "";
    @observable repositoryPageParams = {
        current: 1,
        pageSize: 10
    };
    @observable
    activeTabs = "1";

    @action
    setActiveTabs = (value) => {
        this.activeTabs = value
    }

    @action
    findRepositoryList = async (params) => {
        const data = await Service("/repository/findRepositoryListByUser", params);
        if (data.code === 0) {
            this.repositorylist = data.data;
        }
        return data;
    }

    @action
    getAllRepositorylist = async () => {
        const data = await Service("/repository/findRepositoryListByUser", {});
        if (data.code === 0) {
            this.allRepositorylist = data.data;
            this.repositorylist = data.data;
        }
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
    searchrepositoryList = async (values) => {
        const param = new FormData()
        param.append("id", values);
        const data = await Service("/repository/findRepository", param);
        if (data.code === 0) {
            this.repositorylist = [data.data];
        }
        return data;
    }
    @action
    searchrepository = async (values) => {
        const params = new FormData()
        params.append("id", values)

        const data = await Service("/repository/findRepository", params);
        return data;
    }
    @action
    getRepositoryTypeList = async () => {
        const data = await Service("/projectType/findAllProjectType");
        if (data.code === 0) {
            this.repositoryTypelist = data.data;
        }
        return data;
    }

    @action
    getUseList = async () => {
        const data = await Service("/user/user/findAllUser");
        if (data.code === 0) {
            this.uselist = data.data;
        }
        return data;
    }

    @action
    createRecent = async (value) => {
        const data = await Service("/recent/createRecent", value);
        return data.data;
    }

    @action
    findRecentRepositoryList = async (value) => {
        const data = await Service("/repository/findRecentRepositoryList", value);
        if (data.code === 0) {
            this.repositorylist = data.data;
        }
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
        if (data.code === 0) {
            this.repositorylist = data.data;
        }
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

}

export default new RepositoryStore();