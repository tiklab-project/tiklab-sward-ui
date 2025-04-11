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
    findCfInputSchedule = async () => {
        const data = await Service("/importData/findCfInputSchedule");
        return data;
    }
}

export default new ConfluenceStore();
