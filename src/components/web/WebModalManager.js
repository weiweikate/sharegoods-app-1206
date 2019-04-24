import { action, observable } from "mobx";
import { AsyncStorage } from 'react-native';
import HomeAPI from '../../pages/home/api/HomeAPI';
import { AdViewBindModal } from '../../pages/home/view/HomeMessageModalView';
// const Type = {
//     EXCHANGE: 2,
//     EXPERIENCE: 3,
//     TOPIC: 4,
//     CUSTOMTOPIC: 5
// }
class Manager {
    /** 控制广告页*/
    @observable
    isShowAd = false;
    needShowAd = false;
    @observable
    AdData = null;
    isHome = true;
    //showPage：
    // EXCHANGE(2, "兑换专区"),web
    // EXPERIENCE(3, "经验值专区"),web
    // TOPIC(4, "专题"),app
    // CUSTOMTOPIC(5, "自定义专题"）web
    @action
    getAd(showPage,showPageValue,type) { //获取数据
        let currStr = new Date().toDateString();
        let _showPageValue = showPageValue|| ""
        let _showPage = showPage|| ""
        //将showPage，showPageValue作为本地缓存的key，取上次打开时间，如果不是同一天就请求接口
        this.type = "web__storage_"+_showPage+'_'+_showPageValue+'_'+type;
        AsyncStorage.getItem(this.type).then((value) => {
            if (value == null || currStr !== value) {
                HomeAPI.getHomeData({showPage, showPageValue, type}).then(resp => {
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
        let currStr = new Date().toDateString();
        AsyncStorage.setItem(this.type, currStr);
        this.isShowAd = false;
        this.needShowAd = false;
        this.AdData = null;
    }
}

export default Manager;
export {AdViewBindModal};
