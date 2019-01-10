import axios from 'axios';
import {
    NativeModules,
    Platform
} from 'react-native';
import configureResponseError from './interceptors/ResponseError';
import configureTimeout from './interceptors/timeout';
import fetchHistory from '../../model/FetchHistory';
import apiEnvironment from '../ApiEnvironment';
import user from '../../model/user';
import DeviceInfo from 'react-native-device-info';
import { RSA } from './RSA';
import rsa_config from './rsa_config';
// console.log('user token', user.getToken())
const { RNDeviceInfo } = NativeModules;
const Qs = require('qs');

let defaultData = {
    token: ''
};

export function setToken(data) {
    defaultData = {
        ...defaultData,
        ...data
    };
}

// 这是默认post
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.common['sg-token'] =  user && user.getToken() ? user.getToken : ''
axios.defaults.headers.common.device = DeviceInfo && DeviceInfo.getUniqueID() + '';
axios.interceptors.response.use(null, configureResponseError);
axios.interceptors.request.use(configureTimeout, err => {

    return Promise.reject(err);
});

axios.interceptors.response.use((response) => {
    return response;
}, error => {

    return Promise.reject(error);
});

axios.defaults.timeout = 20000;

// 记录日志
function createHistory(response, requestStamp) {

    let responseStamp = +new Date();
    let requestHeader = response.config.headers;
    let responseHeader = response.headers;
    let requestBody = response.config.data;
    let responseJson = response.data || {};
    let url = response.config.url;
    let method = response.config.method;
    let status = response.status || -1;
    let history = {
        url,
        method,
        status,
        requestStamp,
        responseStamp,
        requestHeader,
        responseHeader,
        requestBody,
        responseJson
    };
    console.log('history', history);
    return history;
}

export default class HttpUtils {

    platform = '';

    static sign(params, isRSA) {
        if (isRSA) {
            return new Promise((resolve, reject) => {
                const signParam = RSA.sign(params)
                resolve(signParam)
            })
        } else {
            return new Promise((resolve, reject) => {
                resolve({})
            })
        }
        
    }

    static get(uri, isRSA, params) {
        let host = apiEnvironment.getCurrentHostUrl();
        let url = uri.indexOf('http') > -1 ? uri : (host + uri);
        if (params) {
            if (url.indexOf('?') > -1) {
                url = url + '&' + Qs.stringify(params);
            } else {
                url = url + '?' + Qs.stringify(params);
            }
        }
        // url = decodeURIComponent(url);

        /**
         * @type {*|{nonce, timestamp, client, version, sign}}
         * 加签相关,如果为GET需要对url中的参数进行加签,不要对请求体参数加签
         */

        let signParam = {};
        // if (isRSA) {
        //     signParam = HttpUtils.sign(params);
        // }
        let timeLineStart = +new Date();

        if (!this.platform) {
            this.platform = DeviceInfo.getSystemName() + ' ' + DeviceInfo.getSystemVersion();
        }

        return HttpUtils.sign(params, isRSA).then(sign => {
            signParam = sign
            return user.getToken()
        }).then(token => {
            let config = {
                headers: {
                    ...signParam,
                    'Security-Policy': 'SIGNATURE',//区分app和h5
                    'sg-token': token ? token : '',
                    'platform': this.platform,
                    'version': rsa_config.version,
                    'channel': Platform.OS === 'ios' ? 'appstore' : RNDeviceInfo.channel
                }
            };
            return axios.get(url, config);
        }).then(response => {
            let data = response.data;
            let history = createHistory(response, timeLineStart);

            fetchHistory.insertData(history);
            return data;
        }).catch(response => {
            let history = createHistory(response, timeLineStart);

            fetchHistory.insertData(history);

            return response.data;
        });
    }

    // static upload(uri,isRSA,data,config){
    //     let host = apiEnvironment.getCurrentHostUrl();
    //     let url = uri.indexOf('http') > -1 ? uri : (host + uri);
    //     let signParam = {}
    //     if (isRSA){
    //         signParam = RSA.sign()
    //     }
    //
    //   return fetch(`${url}/common/upload/oss`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //             'Accept': 'application/json',
    //             ...singParams
    //         },
    //         body: data
    //     }).then(resq => resq.json())
    //
    // }

    static post(uri, isRSA, data, config) {
        let host = apiEnvironment.getCurrentHostUrl();
        let url = uri.indexOf('http') > -1 ? uri : (host + uri);
        /**
         * @type {*|{nonce, timestamp, client, version, sign}}
         * 加签相关,如果为GET需要对url中的参数进行加签,不要对请求体参数加签
         */

        let signParam = {};
        if (isRSA) {
            signParam = HttpUtils.sign();
        }
        data = {
            ...data
        };

        if (!this.platform) {
            this.platform = DeviceInfo.getSystemName() + ' ' + DeviceInfo.getSystemVersion();
        }

        let timeLineStart = +new Date();
        return HttpUtils.sign({}, isRSA).then(sign => {
            signParam = sign
            return user.getToken()
        }).then(token => {
            config.headers = {
                ...signParam,
                'Security-Policy': 'SIGNATURE',//区分app和h5
                'sg-token': token ? token : '',
                'platform': this.platform,
                'version': rsa_config.version,
                'channel': Platform.OS === 'ios' ? 'appstore' : RNDeviceInfo.channel
            };
            return axios.post(url, data, config);
        }).then(response => {
            let history = createHistory(response, timeLineStart);

            fetchHistory.insertData(history);

            return response.data;
        })
            .catch(response => {
                let history = createHistory(response, timeLineStart);

                fetchHistory.insertData(history);

                return response.data;
            });
    }
}
