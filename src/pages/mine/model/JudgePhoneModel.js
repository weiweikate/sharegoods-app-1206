import { observable } from 'mobx';

class JudgePhoneModel {
    @observable
    dowTime = 0;
}

const judgePhoneModel = new JudgePhoneModel();
export default judgePhoneModel;
