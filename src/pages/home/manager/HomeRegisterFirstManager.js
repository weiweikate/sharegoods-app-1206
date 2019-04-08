/**
 * @author xzm
 * @date 2018/11/20
 */

'use strict';
import { action, observable } from 'mobx';
import OssHelper from '../../../utils/OssHelper';
const newuser_n = OssHelper('/sharegoods/resource/sg/images/package/newuser_n.png');
const newuser_y = OssHelper('/sharegoods/resource/sg/images/package/newuser_y.png');
const olduser = OssHelper('/sharegoods/resource/sg/images/package/olduser.png');



/**
 * https://devcdn.sharegoodsmall.com/sharegoods/resource/sg/images/package/newuser_n.png 688
 * https://devcdn.sharegoodsmall.com/sharegoods/resource/sg/images/package/newuser_y.png 2888
 * https://devcdn.sharegoodsmall.com/sharegoods/resource/sg/images/package/olduser.png 1688
 */

const imgLink = {
    0:null,  //无
    1:olduser, //1688
    2:newuser_y, //2688
    3:newuser_n //688
}

class HomeRegisterFirstManager {
    @observable
    showRegisterModalUrl = null;

    /**
     *
     * @param giveNumber
     * 1 1688礼包
     * 2 2688礼包
     * 3 688 礼包
     */
    @action
    setShowRegisterModalUrl(giveNumber) {
        console.log('礼包nuber'+giveNumber);
        console.log(imgLink[giveNumber])
        this.showRegisterModalUrl = imgLink[giveNumber];
    }

}

const homeRegisterFirstManager = new HomeRegisterFirstManager();
export  { homeRegisterFirstManager, newuser_n, newuser_y, olduser };
