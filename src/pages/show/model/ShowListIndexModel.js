/**
 * @author xzm
 * @date 2019/6/26
 */

import { observable, action } from 'mobx';
class WhiteModel {
    @observable pageIndex = 1;

    @action
    setIndex(num){
        if(num <5 && num > -1){
            this.pageIndex = num
        }
    }
}

export default new WhiteModel();
