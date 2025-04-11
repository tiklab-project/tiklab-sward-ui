/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-05-28 15:09:43
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:51:12
 */

import wikiRoutes from "./routers";
import {store} from "./stores";
import AsyncComponent from './common/lazy/SyncComponent.js'
import App from "./app";
import FirstMenu from "./home/home/components/FirstMenu";
import Search from "./home/search/components/Search";
import RepositoryLayout from "./repository/common/components/RepositoryLayout";
import BasicInfo from "./repository/setting/basicInfo/components/BasicInfo";
import Layout from "./home/home/components/Layout";
import RepositoryDoc from "./repository/document/components/RepositoryDoc";
import SettingHomeStore from "./setting/home/store/SettingHomeStore";
import SettingHome from "./setting/home/components/SettingHome";
import SettingAside from "./setting/common/components/SetAside";

export {
    AsyncComponent,
    wikiRoutes,
    store,
    Search,
    RepositoryLayout,
    BasicInfo,
    Layout,
    App,
    FirstMenu,
    RepositoryDoc,
    SettingHomeStore,
    SettingHome,
    SettingAside
}
