/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/4/10
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/4/10
 */
import { observable, action } from "mobx";
import {Service} from "../../../../common/utils/requset";

class ConfluenceStore {

    @action
    validConfluenceVersion = async value => {
        const data = await Service("/import/confluence/validConfluenceVersion",value);
        return data;
    }

    @action
    analysisEntityXml = async value => {
        const data = await Service("/import/confluence/analysisEntityXml",value);
        return data;
    }

    @action
    importJiraData = async value => {
        const data = await Service("/import/confluence/importJiraData",value);
        return data;
    }

    @action
    findCfInputSchedule = async value => {
        const data = await Service("/import/confluence/findCfInputSchedule",value);
        return data;
    }

}

export default new ConfluenceStore();
