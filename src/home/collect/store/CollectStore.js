import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset";
export class CollectStore {
    @observable focusDocumentList = [];
    @observable documentCondition = {
        orderParams: [{
            name: "focusTime",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1,
            total: 1,
            totalPage: 1
        }
    }
    @action
    findDocumentFocusList = async(value) => {
        Object.assign(this.documentCondition, value)
        const data = await Service("/documentFocus/findDocumentFocusList", this.documentCondition);
        if(data.code === 0){
            this.focusDocumentList = data.data.dataList;
            this.documentCondition.pageParam.totalPage = data.data.totalPage;
            this.documentCondition.pageParam.total = data.data.totalRecord;
        }
        return data;
    }

    @action
    findDocumentFocusPage = async (value) => {
        const data = await Service("/documentFocus/findDocumentFocusPage", value);
        return data;
    }

    @action
    deleteDocumentFocusByCondition = async(value) =>{
        const data = await Service("/documentFocus/deleteDocumentFocusByCondition",value);
        return data;
    }

    @action
    findFocusRepositoryList = async (value) => {
        const data = await Service("/repository/findFocusRepositoryList", value);

        return data;
    }

}

export default new CollectStore();
