import { observable, action } from 'mobx';

class XpDetailModel {

    @observable img = 'https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=图片&hs=0&pn=0&spn=0&di=220&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&ie=utf-8&oe=utf-8&cl=2&lm=-1&cs=2249893882%2C1165836821&os=2203774813%2C3758473366&simid=4236599532%2C754691173&adpicid=0&lpn=0&ln=30&fr=ala&fm=&sme=&cg=&bdtype=0&oriquery=&objurl=http%3A%2F%2Fimg03.tooopen.com%2Fuploadfile%2Fdowns%2Fimages%2F20110714%2Fsy_20110714135215645030.jpg&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3Bp555rjg_z%26e3Bv54AzdH3FetjoAzdH3F80mma8_z%26e3Bip4s&gsm=0&islist=&querylist=';
    @observable vip = 'V1价';
    @observable price = '345-345';
    @observable leave = '库存12314';
    @observable tittle = '圣芝红酒法国波尔多AOC银奖干红原瓶进口珍藏葡萄酒类整箱6支原装';
    @observable subTittle = '海量新品 潮流穿搭 玩趣互动';

    @action saveData = () => {

    };
}

export default XpDetailModel;
