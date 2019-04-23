/**
 * Created by zhoujianxin on 2019/4/17.
 * @Desc 分享函数
 */

import bridge from './bridge';
import user from "../model/user";
import EmptyUtils from "./EmptyUtils";
import HttpUtils from "../api/network/HttpUtils";
import apiEnvironment from '../api/ApiEnvironment';
import { track } from './SensorsTrack';

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

const onShare = (data, api, trackParmas,trackEvent, callback = () => {}, luckyDraw) => {
    let params = data;
    if (data.shareType === 2) {
        params.userName = data.userName || apiEnvironment.getCurrentWxAppletKey();
        params.miniProgramType = apiEnvironment.getMiniProgramType();
    }
    if (trackEvent) {
        let p = trackParmas || {};
        let shareType = [TrackShareType.wx, TrackShareType.wxTimeline, TrackShareType.qq, TrackShareType.qqSpace, TrackShareType.weibo][data.platformType];
        track(trackEvent, { shareType, ...p });
    }
    bridge.share(params, () => {
            if (user.isLogin && luckyDraw === true) {
                user.luckyDraw();
            }
            shareSucceedCallBlack(api, callback);
        }, (errorStr) => {

        });
};

const shareSucceedCallBlack = (api, sucCallback = () => {}) => {
    console.log('分享成功后调用分享方法',api);
    if (EmptyUtils.isEmpty(api)) {
        return;
    }
    let {url, methods, params, refresh} = api;
    if (EmptyUtils.isEmpty(url)) {
        return;
    }
    if (methods && methods.tolocaleUpperCase === 'GET') {
        HttpUtils.get(url, false, params).then(() => {
            if (refresh === true) {
                // this.props.reloadWeb && this.props.reloadWeb();
                sucCallback();
            }
        });
    } else {
        HttpUtils.post(url, false, params, {}).then(() => {
            if (refresh === true) {
                // this.props.reloadWeb && this.props.reloadWeb();
                sucCallback();
            }
        }).catch(() => {
        });
    }
};


export default {
    onShare
}
