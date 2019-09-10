import res from '../../../comm/res';
import signIn from './signIn';
import search from './search';
import task from './task';

const resHome = {
    goods: require('./goods.png'),
    home_icon_logo_red: require('./home_icon_logo_red.png'),
    icon_search: require('./icon_search.png'),
    message: require('./message.png'),
    home_notice_bg: require('./home_notice_bg.png'),
    star: require('./star.png'),
    account_bg: require('./account_bg.png'),
    /** 首页5个icon*/
    school: require('./school.png'),
    share_icon: require('./share.png'),
    show: require('./show.png'),
    signin: require('./signin.png'),
    spike: require('./spike.png'),
    home_right: require('./home_right.png'),
    home_sallout: require('./home_pic_qiangguang.png'),
    btn_bg: require('./btn_bg.png'),
    unwin: require('./unwin.png'),
    win: require('./win.png'),
    limitGoHeader: require('./limitGoHeader.png'),
    modalBg: require('./modalBg.png'),
    shouye_icon_gengduo: require('./shouye_icon_gengduo.png'),
    more: require('./more2.png'),
    arrow_bottom: require('./arrow_bottom.png'),
    arrow_top: require('./arrow_top.png'),
    tabBg: require('./tabBg.png'),
    icon_shopCar: require('./icon_shopCar.png'),
    home_limit_progress: require('./home_limit_progress.png'),
    discount: require('./discount.png'),
    signIn: {
        ...signIn
    },
    search: {
        ...search
    },
    task: {
        ...task
    },
    ...res
};
export default resHome;
