/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-23 15:05:09
 */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import Routes from './Routers';
import { renderRoutes } from "react-router-config";
import { Provider } from 'mobx-react';
import { store } from "./stores"
import { orgStores } from "tiklab-user-ui/es/store";
import { getUser, enableAxios } from 'tiklab-core-ui'
import './common/language/i18n';
import "./index.scss";
import { observer } from "mobx-react"
import { useTranslation } from 'react-i18next';
import "./assets/index";
import { privilegeStores } from "tiklab-privilege-ui/es/store";
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { useVersion } from "tiklab-eam-ui/es/utils";
import { InitInstallProvider } from 'tiklab-eam-ui';

enableAxios()
const Index = observer(() => {
    const { i18n } = useTranslation();
    const allStore = {
        ...privilegeStores,
        ...orgStores,
        ...store
    }

    useVersion()
    return (
        <InitInstallProvider bgroup={'sward'}>
            <Provider {...allStore}>
                <ConfigProvider locale={zhCN}>
                    <HashRouter >
                        {
                            renderRoutes(Routes)
                        }
                    </HashRouter>
                </ConfigProvider>
            </Provider>
        </InitInstallProvider>

    )
});

ReactDOM.render(<Index />, document.getElementById('root'));

if (module.hot) {
    module.hot.accept()
}
