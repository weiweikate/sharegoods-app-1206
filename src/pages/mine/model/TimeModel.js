import { observable, action } from 'mobx';

class TimeModel {
    //我的页面拼团定时器
    @observable
    countdownDate = 0;

    //拼团列表定时器
    @observable
    spellGroupDate = 0;

    //弹窗定时器
    @observable
    groupModalDate = 0;

    @action getCurrentTime() {
        if (!this.mineTime) {
            this.mineTime = setInterval(() => {
                this.countdownDate = Math.round(new Date());
            }, 1000);
        }
    }

    @action stopMineTime() {
        this.countdownDate = 0;
        this.mineTime && clearInterval(this.mineTime);
        this.mineTime = null;
    }

    @action getSpellGroupTime() {
        if (!this.spellGroup) {
            this.spellGroup = setInterval(() => {
                this.spellGroupDate = Math.round(new Date());
            }, 1000);
        }
    }

    @action stopSpellGroupTime() {
        this.spellGroupDate = 0;
        this.spellGroup && clearInterval(this.spellGroup);
        this.spellGroup = null;
    }

    @action getGroupModalTime() {
        if (!this.groupModal) {
            console.log(this.groupModal);
            this.groupModal = setInterval(() => {
                this.groupModalDate = Math.round(new Date());
            }, 1000);
        }
    }

    @action stopGroupModalTime() {
        this.groupModalDate = 0;
        this.groupModal && clearInterval(this.groupModal);
        this.groupModal = null;
    }


}


const timeModel = new TimeModel();
export default timeModel;
