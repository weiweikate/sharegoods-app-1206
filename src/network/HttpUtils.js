import axios from 'axios';
import configureResponseError from './interceptors/ResponseError';
import configureTimeout from './interceptors/timeout';

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
        });
    }

    static post(url, data, config) {
        data = {
            ...defaultData,
            ...data
        };

        return axios.post(url, data, config)
            .then(response => response.data)
            .catch(error => console.log(error));
    }
}
