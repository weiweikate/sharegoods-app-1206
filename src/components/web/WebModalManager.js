import { action, observable } from "mobx";
import { AsyncStorage } from 'react-native';
import HomeAPI from '../../pages/home/api/HomeAPI';
import { homeType } from '../../pages/home/HomeTypes';
import { AdViewBindModal } from '../../pages/home/view/HomeMessageModalView';
const Type = {
    EXCHANGE: 2,
    EXPERIENCE: 3,
    TOPIC: 4,
    CUSTOMTOPIC: 5
}
class Manager {
    /** 控制广告页*/
    @observable
    isShowAd = false;
    needShowAd = false;
    @observable
    AdData = null;
    //showPage：
    // EXCHANGE(2, "兑换专区"),web
    // EXPERIENCE(3, "经验值专区"),web
    // TOPIC(4, "专题"),app
    // CUSTOMTOPIC(5, "自定义专题"）web
    @action
    getAd(showPage,showPageValue) { //获取数据
        let currStr = new Date().getTime() + "";
        let _showPageValue = showPageValue|| ""
        let _showPage = showPage|| ""
        //将showPage，showPageValue作为本地缓存的key，取上次打开时间，如果小于一天就请求接口
        this.type = "web_storage_"+_showPage+'_'+_showPageValue;
        AsyncStorage.getItem(this.type).then((value) => {
            if (value == null || parseInt(currStr) - parseInt(value) > 24 * 60 * 60 * 1000) {
                HomeAPI.getHomeData({showPage, showPageValue}).then(resp => {
                    if (resp.data && resp.data.length > 0) {
                        this.needShowAd = true;
                        this.AdData = resp.data[0];

                    }else {
                    }
                }).catch((msg)=> {
                })
            } else {
            }
        }).catch((msg) => {

        });
    }
    @action
    showAd(callBack){//展示广告
        if (this.needShowAd === true){
            this.isShowAd= true
        }else {
            callBack&&callBack();
        }

    }

    @action
    closeAd () {//关闭广告，将关闭广告的时间保存下来
        let currStr = new Date().getTime() + '';
        AsyncStorage.setItem(this.type, currStr);
        this.isShowAd = false;
        this.needShowAd = false;
        this.AdData = null;
    }
}

export default Manager;
export {AdViewBindModal};
