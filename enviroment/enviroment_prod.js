/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-04-19 15:58:49
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-20 13:23:49
 */
const api =  '/';
const base_url = JSON.stringify(api);

const url = "/";
const plugin_base_url = JSON.stringify(url);

let plugin_url = `/pluginConfig/getPluginConfig`;
plugin_url = JSON.stringify(plugin_url);

const upload_url = JSON.stringify('')


// 判断是否是用户环境， 如果是用户环境收到切换为true， 如果是内部公司手动切换为false
const userProduction = false;

let fetchMethod = "post"
fetchMethod = JSON.stringify(fetchMethod);

let env = "prod";
env = JSON.stringify(env)

const appKey = JSON.stringify('tiklab_sward');
const appSecret = JSON.stringify('');
const isSaas = false;
const mobile_url = JSON.stringify("/mobile.html")
const version = JSON.stringify('ce');
const client = JSON.stringify('web');
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
    upload_url,
    isSaas,
    mobile_url
}
