/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-04-19 15:29:27
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-25 11:41:43
 */
const api =  'http://192.168.10.17:8060/';
const base_url = JSON.stringify(api);


const url = "http://192.168.10.17:8060/";
const plugin_base_url = JSON.stringify(url);

let pluginAddressUrl = `${url}/config.json`;
pluginAddressUrl = JSON.stringify(pluginAddressUrl);

const img_url = JSON.stringify('http://192.168.10.18:8080')
let fetchMethod = "get"
fetchMethod = JSON.stringify(fetchMethod);
// 判断是否是用户环境， 如果是用户环境收到切换为true， 如果是内部公司手动切换为false
const userProduction = false;

let env = "local";
env = JSON.stringify(env)
const appKey = JSON.stringify('');
const appSecret = JSON.stringify('');
const version = JSON.stringify('');
const client = JSON.stringify('');
const isSaas = false;
const tenant_type= JSON.stringify('mult')
// const acc_url = JSON.stringify("http://portal.dev.doublekit.net")

module.exports = {
    base_url,
    userProduction,
    plugin_base_url,
    pluginAddressUrl,
    fetchMethod,
    env,
    appKey,
    appSecret,
    version,
    client,
    isSaas,
    img_url,
    tenant_type,
    // acc_url
}