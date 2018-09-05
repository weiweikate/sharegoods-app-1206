import axios from 'axios';
import configureResponseError from './interceptors/ResponseError';
import configureTimeout from './interceptors/timeout';
import fetchHistory from '../model/FetchHistory';

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

//axios.defaults.headers.post['Content-Type'] = "application/x-www-form-urlencoded;charset=UTF-8";
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
function createHistory(response,requestStamp) {


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

    return history;
}
export default class HttpUtils {

    static get(url, params) {
        if (params) {
            if (url.indexOf('?') > -1) {
                url = url + '&' + Qs.stringify(params);
            } else {
                url = url + '?' + Qs.stringify(params);
            }
        }
        return axios.get(url).then(response => {
            let data = response.data;
            return data;
        }).catch(error => {
            return error;
        });
    }

    static post(url, data, config) {
        data = {
            ...defaultData,
            ...data
        };
        let timelineStart = +new Date();
        return axios.post(url, data, config)
            .then(response => {
                let history = createHistory(response,timelineStart);

                fetchHistory.insertData(history);
                console.log('history',history);
                return response.data;
            })
            .catch(response => {
                let history = createHistory(response,timelineStart);

                fetchHistory.insertData(history);
                console.log('history',history);
                return response.data;
                //return Promise.reject(error);
            });
    }
}
