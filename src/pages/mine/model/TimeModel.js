import { observable, action } from 'mobx';

class TimeModel {
    @observable
    countdownDate = 0;

    @observable
    spellGroupDate = 0;

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


}


const timeModel = new TimeModel();
export default timeModel;
