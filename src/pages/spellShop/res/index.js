import res from '../../../comm/res';
import shopSetting from './shopSetting';
import shopRecruit from './shopRecruit';
import recommendSearch from './recommendSearch';
import openShop from './openShop';
import myShop from './myShop';

const index = {
    jbtk_03: require('./jbtk_03.png'),
    pindianzhaojiling: require('./pindianzhaojiling.png'),
    pindianzhaojilingbgd: require('./pindianzhaojilingbgd.png'),
    shopSetting: {
            ...shopSetting
        },
    shopRecruit: {
        ...shopRecruit
    },
    recommendSearch: {
        ...recommendSearch
    },
    openShop: {
        ...openShop
    },
    myShop: {
        ...myShop
    },
    ...res
};
export default index;
