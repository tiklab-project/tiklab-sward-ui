/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/8/5
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/8/5
 */
import { observable, action } from "mobx";
import {Service} from "../../../../common/utils/requset";

class ServerStore {

    @action
    findAllSystemUrl = async () => {
        const data = await Service("/systemUrl/findAllSystemUrl");
        return data;
    }

    @action
    createSystemUrl = async (value) => {
        const data = await Service("/systemUrl/createSystemUrl", value);
        return data;
    }

    @action
    findSystemUrl = async (value) => {
        const data = await Service("/systemUrl/findSystemUrl", value);
        return data;
    }

    @action
    updateSystemUrl = async (value) => {
        const data = await Service("/systemUrl/updateSystemUrl", value);
        return data;
    }

    @action
    deleteSystemUrl = async (value) => {
        const data = await Service("/systemUrl/deleteSystemUrl", value);
        return data;
    }

}

export default new ServerStore();
