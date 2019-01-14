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
import collectShop from './collectShop';
import mentor from './mentor';
const index = {
    collectShop: {
        ...collectShop
    },
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
    mentor:{
        ...mentor
    },
    ...res
};
export default index;
