import axios from 'axios';
import configureResponseError from './interceptors/ResponseError';
import configureTimeout from './interceptors/timeout';
import fetchHistory from '../../model/FetchHistory';
import apiEnvironment from '../ApiEnvironment';
import { RSA } from './RSA';

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

/**
 * @param {string} query字符串 选填 http://www.mr.com/?a=1&b=2#login
 * @returns {object} {a:1,b:2}
 */
function query2Object(str) {
    let url = str || document.URL;
    // removeURLAnchor
    url.indexOf('#') > 0 && (url = url.substring(0, url.indexOf('#')))
    let e = {},
        t = url,
        o = t.split('?').slice(1).join('');
    if (o.length < 3) {
        return e;
    }
    for (let n = o.split('&'), i = 0; i < n.length; i++) {
        let r = n[i], d = r.indexOf('=');
        if (!(0 > d || d === r.length - 1)) {
            let p = r.substring(0, d), s = r.substring(d + 1);
            0 !== p.length && 0 !== s.length && (e[p] = decodeURIComponent(s));
        }
    }
    return e;
}

// 这是默认post
axios.defaults.headers.post['Content-Type'] = 'application/json';
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

    static get(uri, params, config = {}) {
        let headers = RSA.sign(params || {});
        let host = apiEnvironment.getCurrentHostUrl();
        let url = uri.indexOf('http') > -1 ? uri : (host + uri);
        if (params) {
            if (url.indexOf('?') > -1) {
                url = url + '&' + Qs.stringify(params);
            } else {
                url = url + '?' + Qs.stringify(params);
            }
        }
        let timeLineStart = +new Date();
        return axios.get(url), { headers, ...config }.then(response => {
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

    static post(uri, data, config = {}) {
        let params = query2Object(uri);
        let headers = RSA.sign(params);
        let host = apiEnvironment.getCurrentHostUrl();
        let url = uri.indexOf('http') > -1 ? uri : (host + uri);

        data = {
            ...defaultData,
            ...data
        };
        let timeLineStart = +new Date();
        return axios.post(url, data, { headers, ...config })
            .then(response => {
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
