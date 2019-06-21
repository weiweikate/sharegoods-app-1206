import HttpUtils from './HttpUtils';
import User from '../../model/user';
import apiEnvironment from '../ApiEnvironment';
import { routePush } from '../../navigation/RouterMap';
import RouterMap from '../../navigation/RouterMap';

export default function ApiUtils(Urls) {
    let result = {}, list = [];
    Object.keys(Urls).forEach(function(name) {
        let value = Urls[name];
        if (typeof value === 'string') {
            list.push({
                name,
                uri: value
            });
        } else if (value.length) {
            list.push({
                name,
                uri: value[0],
                ...value[1]
            });
        }
    });
    list.forEach(function(item) {
        let name = item.name, url = item.uri, method = item.method || 'post', isRSA = item.isRSA || false,
            filter = item.filter, checkLogin = item.checkLogin || false;
        result[name] = async function(params, config = {}) {
            if (checkLogin === true && !User.isLogin) {
                return Promise.reject({
                    code: 10009,
                    msg: '用户登录失效'
                });
            }
            const response = await HttpUtils[method](url, isRSA, params, config);
            // code为0表明请求正常
            if (!response.code || response.code === 10000) {
                filter && filter(response);
                return Promise.resolve(response);
            } else {
                // 假如返回未登陆并且当前页面不是登陆页面则进行跳转
                if (response.code === 10009) {
                    User.clearUserInfo();
                    User.clearToken();
                }
                //系统升级中跳转错误网页
                if (response.code === 9999) {
                    routePush(RouterMap.HtmlPage, { uri: apiEnvironment.getCurrentH5Url() + '/system-maintenance' });
                }
                return Promise.reject(response);
            }
        };
    });
    return result;

}
