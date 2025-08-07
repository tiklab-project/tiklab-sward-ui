import { Service } from "../../../../common/utils/requset";
import { observable, action} from "mobx";
class DocumentStore {
    // 知识库id
    @observable repositoryCatalogue = [];
    @observable
    expandedTree = [0];
    // 目录树
    @observable repositoryCatalogueList = [];
    @observable docDetail = [{
        title: "",
        type: "",
        content: ""
    }]

    @observable templatePageParams = {
        current: 1,
        pageSize: 10,
        total: 1
    };

    @action
    setExpandedTree = (value) => {
        this.expandedTree = value;
    }
    /**
     *
     * @param {*} id
     * @returns
     */
    @action
    setRepositoryCatalogueList = (value) => {
        this.repositoryCatalogueList = value
    }


    // 创建文档
    @action
    createDocument = async(params) => {
        const data = await Service("/document/createDocument", params);
        return data;
    }
    // 创建文档
    @action
    updateDocument = async(params) => {
        const data = await Service("/document/updateDocument", params);
        return data;
    }

    // 获取文档
    @action
    findDocument = async(id) => {
        const params = new FormData()
        params.append("id", id)
        const data = await Service("/document/findDocument", params);
        return data;
    }

     // 删除文档
    @action
    deleteDocument= async(id)=> {
        const params = new FormData()
        params.append("id", id)
        const data = await Service("/document/deleteDocument", params);
        return data;
    }

    @action
    findCategoryDocument= async(id)=> {
        const params = new FormData()
        params.append("id", id)
        const data = await Service("/category/findCategoryDocument", params);
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
            this.templateList = data.data.dataList
        }
        return data;
    }

    @action
    createDocumentFocus = async(value) =>{
        const data = await Service("/documentFocus/createDocumentFocus",value);
        return data;
    }

    @action
    deleteDocumentFocusByCondition = async(value) =>{
        const data = await Service("/documentFocus/deleteDocumentFocusByCondition",value);
        return data;
    }
}

export default new DocumentStore()
