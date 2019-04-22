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
    //一天弹一次 公告与广告不共存
    // EXCHANGE(2, "兑换专区"),
    // EXPERIENCE(3, "经验值专区"),
    // TOPIC(4, "专题"),
    // CUSTOMTOPIC(5, "自定义专题"
    @action
    getAd(type) {
        let currStr = new Date().getTime() + "";
        this.type = type;
        AsyncStorage.getItem("web_" + type).then((value) => {
            if (value == null || parseInt(currStr) - parseInt(value) > 24 * 60 * 60 * 1000) {
                HomeAPI.getHomeData({type:  homeType.guideInfo}).then(resp => {
                    if (resp.data && resp.data.length > 0) {
                        this.needShowAd = true;
                        this.AdData = resp.data[0];

                    }else {
                    }
                }).catch((msg)=> {

                })
            } else {
            }
        }).catch(() => {

        });
    }
    @action
    showAd(callBack){
        if (this.needShowAd === true){
            this.isShowAd= true
        }else {
            callBack&&callBack();
        }

    }

    @action
    closeAd () {
        let currStr = new Date().getTime() + '';
        AsyncStorage.setItem('web_'+this.type, currStr);
        this.isShowAd = false;
        this.needShowAd = false;
        this.AdData = null;
    }
}

export default Manager;
export {AdViewBindModal};
