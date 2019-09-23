/**
 * Created by zhoujianxin on 2019/4/17.
 * @Desc 分享函数
 */

import bridge from './bridge';
import user from '../model/user';
import EmptyUtils from './EmptyUtils';
import HttpUtils from '../api/network/HttpUtils';
import apiEnvironment from '../api/ApiEnvironment';
import { track } from './SensorsTrack';
import { mediatorCallFunc } from '../SGMediator';
import userApi from '../model/userApi';
import StringUtils from './StringUtils';

const TrackShareType = {
    unknown: 0,
    wx: 1, //微信好友
    wxTimeline: 2, //微信朋友圈
    qq: 3, //qq好友
    qqSpace: 4, //qq空间
    weibo: 5, // 微博
    copyLink: 6, //复制链接
    saveImage: 7, //分享图片
    other: 100//其他
};

const onShare = (data, api, trackParmas, trackEvent, callback = () => {
}, luckyDraw, taskShareParams) => {
    let params = data || {};
    if (data.thumImage && data.thumImage.indexOf('?') > -1) {
        params.thumImage = data.thumImage && data.thumImage.substring(0, data.thumImage.indexOf('?'));
    }
    if (data.shareType === 2) {
        params.userName = data.userName || apiEnvironment.getCurrentWxAppletKey();
        params.miniProgramType = apiEnvironment.getMiniProgramType();
    }
    console.log(data);
    if (params.linkUrl) {
        let addData = { pageSource: params.platformType >= 0 ? params.platformType + 1 : 0 };
        params.linkUrl = queryString(params.linkUrl, addData);
    }

    if (params.platformType === 1) {
        params.title = params.dec && params.dec.length > 0 ? params.title + ',' + params.dec : params.title;
    }

    if (trackEvent) {
        let p = trackParmas || {};
        let shareType = [TrackShareType.wx, TrackShareType.wxTimeline, TrackShareType.qq, TrackShareType.qqSpace, TrackShareType.weibo][data.platformType];
        track(trackEvent, { shareType, ...p });
    }
    if (params.platformType === 0) {
        userApi.shareShortUrl({ 'longUrl': params.linkUrl, 'expireTime': 0 })
            .then(res => {
                console.log('res', res);
                if (res && res.data) {
                    params.linkUrl = res.data;
                    shareFunc(params, luckyDraw, api, callback, taskShareParams);
                } else {
                    shareFunc(params, luckyDraw, api, callback, taskShareParams);
                }
            }).catch(error => {
            shareFunc(params, luckyDraw, api, callback, taskShareParams);
        });
    } else {
        shareFunc(params, luckyDraw, api, callback, taskShareParams);
    }

};

const shareSucceedCallBlack = (api, sucCallback = () => {
}) => {
    if (EmptyUtils.isEmpty(api)) {
        return;
    }
    let { url, methods, params, refresh } = api;
    if (EmptyUtils.isEmpty(url)) {
        return;
    }
    if (methods && methods.tolocaleUpperCase === 'GET') {
        HttpUtils.get(url, false, params).then(() => {
            if (refresh === true) {
                // this.props.reloadWeb && this.props.reloadWeb();
                sucCallback('reload');//分享成功后刷新操作
            }
        });
    } else {
        HttpUtils.post(url, false, params, {}).then(() => {
            if (refresh === true) {
                // this.props.reloadWeb && this.props.reloadWeb();
                sucCallback('reload');
            }
        }).catch(() => {
        });
    }
};

const queryString = (url, params) => {
    if (params) {
        const paramsArray = [];
        Object.keys(params).forEach(key =>
            paramsArray.push(key + '=' + params[key])
        );
        if (StringUtils.isNoEmpty(url)) {
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&');
            } else {
                let arr = url.split('?');
                if (arr.length > 1 && arr[1].length > 0) {
                    url += '&' + paramsArray.join('&');
                } else {
                    url += paramsArray.join('&');

                }
            }
        }
    }
    return url;
};

const shareFunc = (params, luckyDraw, api, callback = () => {
}, taskShareParams = () => {
}) => {
    bridge.share(params, () => {
        if (user.isLogin && luckyDraw === true) {
            user.luckyDraw();
        }
        shareSucceedCallBlack(api, callback);
        callback('shareSuccess'); //提示分享成功

        taskShareParams && mediatorCallFunc('Home_ShareNotify', { type: params.platformType + 1, ...taskShareParams });
    }, (errorStr) => {
    });
};

const showSharedetailDataType = (type,download = false)=>{
    if(type){
        if(type === 1){
            return download ? 'showDown' : 'show';

        }else if(type === 2){
            return download ? 'showWebDown' : 'showWeb';

        }else  if(type === 3) {
            return download ? 'showVideoDown' : 'showVideo';

        }else {
            return '';
        }
    }
    return '';
};

const QRCodeAppendPageSource = (QRCode) => {
    let str = QRCode;
    if (StringUtils.isNoEmpty(str)&& str.indexOf('pageSource') === -1) {
        if (str.search(/\?/) === -1) {
            str = str + "?pageSource=7";
        } else {
            str = str + "&pageSource=7";
        }
    }
    return str;
};

export default {
    onShare,
    queryString,
    showSharedetailDataType,
    QRCodeAppendPageSource
};
