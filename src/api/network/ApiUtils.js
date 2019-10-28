import HttpUtils from './HttpUtils';
import user from '../../model/user';
import apiEnvironment from '../ApiEnvironment';
import RouterMap, { routePush } from '../../navigation/RouterMap';
import store from '@mr/rn-store';

const KEY_ApiEnvironment = '@mr/apiEnvironment';
export default function ApiUtils(Urls) {
    let result = {}, list = [];


    Object.keys(Urls).forEach(function(name) {
        let value = Urls[name];
        if (typeof value === 'string') {
            list.push({
                name,
                uri: value
            });
        } else if (value && value.length > 0) {
            list.push({
                name,
                uri: value[0],
                ...value[1]
            });
        }
    });
    list.forEach(function(item) {
        let name = item.name;
        result[name] = async function(params, config = {}) {
            let url = item.uri, method = item.method || 'post', isRSA = item.isRSA || false,
                filter = item.filter, checkLogin = item.checkLogin || false;
            if (checkLogin === true && !user.isLogin) {
                return Promise.reject({
                    code: 10009,
                    msg: '用户登录失效'
                });
            }
            //路径传参
            const { pathValue, ...paramsOutPathValue } = params || {};
            if (pathValue) {
                url = url + pathValue;
            }
            const handleRequest = async () => {
                const response = await HttpUtils[method](url, isRSA, paramsOutPathValue, config);
                // code为0表明请求正常
                if (!response.code || response.code === 10000) {
                    filter && filter(response);
                    return Promise.resolve(response);
                } else {
                    // 假如返回未登陆并且当前页面不是登陆页面则进行跳转
                    if (response.code === 10009) {
                        user.clearUserInfo();
                        user.clearToken();
                    }
                    //系统升级中跳转错误网页
                    if (response.code === 9999) {
                        routePush(RouterMap.HtmlPage, { uri: apiEnvironment.getCurrentH5Url() + '/system-maintenance' });
                    }
                    return Promise.reject(response);
                }
            };
            if (__DEV__) {
                // 判断缓存的环境是否与当前接口请求的一致，一致是响应code对应动作
                return store.get(KEY_ApiEnvironment).then(envType => {
                    if (envType) {
                        if (envType === apiEnvironment.envType) {
                            return handleRequest();
                        } else {
                            return Promise.reject({
                                code: -10000,
                                msg: ''
                            });
                        }
                    } else {
                        return handleRequest();
                    }
                }).catch(e => {
                    console.log('获取环境配置失败！');
                    return handleRequest();
                });
            } else {
                return handleRequest();
            }
        };
    });
    return result;
}
