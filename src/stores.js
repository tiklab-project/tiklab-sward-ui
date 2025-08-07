/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-10-29 17:53:09
 */

import {RELATIONWORK_STORE,RelationWorkStore} from "./repository/document/document/store/RelationWorkStore";
function createStores() {
    return {
        [RELATIONWORK_STORE]: new RelationWorkStore()
    };
}

const store = createStores();

export {
    store
}
