/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-06-09 09:53:33
 */
import {Axios as service} from "tiklab-core-ui";

const Service = (url, data) => {
    return service.request({
        url: url,
        method: "post",
        data: data
    })
}

const ServiceShare = (url, data, tenant) => {
    return service.request({
        url: url,
        method: "post",
        data: data,
        header: {tenant: tenant}
    })
}

export {service, Service, ServiceShare};
