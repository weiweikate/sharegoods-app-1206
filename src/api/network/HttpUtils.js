import axios from 'axios';
import configureResponseError from './interceptors/ResponseError';
import configureTimeout from './interceptors/timeout';
import fetchHistory from '../../model/FetchHistory';
import apiEnvironment from '../ApiEnvironment';

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

    static get(uri, params) {
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
        return axios.get(url).then(response => {
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

    static post(uri, data, config) {
        let host = apiEnvironment.getCurrentHostUrl();
        let url = uri.indexOf('http') > -1 ? uri : (host + uri);

        data = {
            ...defaultData,
            ...data
        };
        let timeLineStart = +new Date();
        return axios.post(url, data, config)
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
