import res from '../../../comm/res';
import signIn from './signIn';
import search from './search';
import product from './product'

const resHome = {
    arrowRight: require('./arrow_right.png'),
    goods: require('./goods.png'),
    home_icon_logo_red: require('./home_icon_logo_red.png'),
    home_icon_logo_white: require('./home_icon_logo_white.png'),
    icon_search: require('./icon_search.png'),
    message: require('./message.png'),
    home_notice_bg:require('./home_notice_bg.png'),
    star: require('./star.png'),
    user_level: require('./user_level.png'),
    /** 首页5个icon*/
    school: require('./school.png'),
    share_icon: require('./share.png'),
    show: require('./show.png'),
    signin: require('./signin.png'),
    spike: require('./spike.png'),
    signIn: {
        ...signIn
    },
    search: {
        ...search
    },
    product: {
        ...product
    },
    ...res
};
export default resHome;
