import { observable, action } from 'mobx';

class XpDetailModel {

    @observable listData = [{ img: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png', tittle: '饿额呵呵呵呵呵呵呵' },
        { img: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png', tittle: '饿额呵呵呵呵呵呵呵' },
        { img: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png', tittle: '饿额呵呵呵呵呵呵呵' },
        { img: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png', tittle: '饿额呵呵呵呵呵呵呵' },
        { img: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png', tittle: '饿额呵呵呵呵呵呵呵' }];

    @observable img = 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png';
    @observable vip = 'V1价';
    @observable price = '345-345';
    @observable leave = '库存12314';
    @observable tittle = '圣芝红酒法国波尔多AOC银奖干红原瓶进口珍藏葡萄酒类整箱6支原装';
    @observable subTittle = '海量新品 潮流穿搭 玩趣互动';

    @action saveData = () => {

    };
}

export default XpDetailModel;
