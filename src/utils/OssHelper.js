/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/12/7.
 *
 */
'use strict';
import apiEnvironment from '../api/ApiEnvironment';
import HttpUtils from '../api/network/HttpUtils';
const timestamp = new Date().getTime();

export default function(url) {
    if(url){
        return apiEnvironment.getCurrentOssHost() + url + '?ts=' + timestamp;
    }else {
        return url;
    }
}

function getSize(url, callBack) {
    if (!url) {
        return
    }
    url = url.split("？")[0]
    HttpUtils.get(url+'?x-oss-process=image/info').then((data)=> {
        let height = data.ImageHeight.value;
        let width = data.ImageWidth.value;
        callBack&&callBack(width, height)
    })
}

export {getSize}

