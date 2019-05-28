/**
 * @author xzm
 * @date 2019/5/24
 */

import { observable, action } from 'mobx';
import ShowApi from '../ShowApi';
class WhiteModel {
    @observable userStatus = 0;

    @action
    saveWhiteType(){
        ShowApi.getWhiteList().then((data)=>{
            this.userStatus = data.data.status;
        }).catch((error)=>{
            this.userStatus = 0;
        })
    }

    @action
    clearStatus(){
       this.userStatus = 0
    }
}

export default new WhiteModel();
