import { observable, action } from "mobx";
import { Service } from "../../../../common/utils/requset";
export class RepositorySetStore {
    @observable repositorylist = [];
    @observable uselist = [];

    @action
    findRepositoryList = async(params) => {
        const data = await Service("/repository/findRepositoryListByUser",params);
        if(data.code === 0){
            this.repositorylist = data.data;
        }
        return data;
    }


    @action
	findRepository = async(values) => {
        const params = new FormData()
        params.append("id", values)

        const data = await Service("/repository/findRepository",params);
        return data;
	}

    @action
	deleteRepository = async(values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await Service("/repository/deleteRepository",param);
        return data;
    }

    @action
	updateRepository = async(values) => {
        const data = await Service("/repository/updateRepository",values);
        return data;

    }

    @action
    findAllUser = async() => {
        const data = await Service("/user/user/findAllUser");
        if(data.code === 0){
            this.uselist = data.data;
        }
		return data;
    }
}

export default new RepositorySetStore();
