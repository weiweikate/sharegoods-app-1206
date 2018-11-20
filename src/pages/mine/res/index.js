import res from '../../../comm/res'//将公共的res导入
import homeBaseImg from './homeBaseImg'
import invite from './invite'
import helperAndCustomerService from './customerservice'
import bankCard from './bankCard';
import couponsImg from './couponsImg';
import address from './address';
import setting from './setting';
import myData from './myData';
import userInfoImg from './userInfoImg';
const index = {
    money: require('./money.png'),
    colloct_start: require('./colloct_start.png'),
    homeBaseImg:{
        ...homeBaseImg
    },
    invite:{
        ...invite
    },
    helperAndCustomerService:{
        ...helperAndCustomerService
    },
    bankCard:{
        ...bankCard
    },
    couponsImg: {
        ...couponsImg,
    },
    address: {
        ...address,
    },
    setting: {
        ...setting,
    },
    myData: {
        ...myData,
    },
    userInfoImg: {
        ...userInfoImg,
    },
    ...res
};
export default index;
