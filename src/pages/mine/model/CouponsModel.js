import { observable, action } from 'mobx';

class CouponsModel {
    @observable
    params = {name:'全部',type:null};

    @action changeType(item){
        this.params=item
    }
}


const couponsModel = new CouponsModel();
export default couponsModel;
