/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-04-19 15:29:27
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-20 10:57:28
 */
const api =  'http://192.168.10.15:10000';
const base_url = JSON.stringify(api);


const url = "http://127.0.0.1:8060/";
const plugin_base_url = JSON.stringify(url);


let plugin_url = `/pluginConfig/getPluginConfig`;
plugin_url = JSON.stringify(plugin_url);

const upload_url = JSON.stringify('http://192.168.10.15:10000')


let fetchMethod = "get"
fetchMethod = JSON.stringify(fetchMethod);
// 判断是否是用户环境， 如果是用户环境收到切换为true， 如果是内部公司手动切换为false
const userProduction = true;

let env = "local";
env = JSON.stringify(env)
const appKey = JSON.stringify('');
const appSecret = JSON.stringify('');
const version = JSON.stringify('ce');
const client = JSON.stringify('web');

const isSaas = false;

module.exports = {
    base_url,
    userProduction,
    plugin_base_url,
    plugin_url,
    fetchMethod,
    env,
    appKey,
    appSecret,
    version,
    client,
    isSaas,
    upload_url
}
