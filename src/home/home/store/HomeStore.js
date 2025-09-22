import { action } from "mobx";
import { Service } from "../../../common/utils/requset";

class HomeStore {

    @action
    findDocumentRecentList= async(value)=> {
        const data = await Service("/recent/findRecentList",value);
        return data;
    }

    @action
    findRecentRepositoryList= async(value)=> {
        const data = await Service("/repository/findRecentRepositoryList",value);
        return data;
    }

}

export default new HomeStore();
