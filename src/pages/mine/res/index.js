import res from '../../../comm/res'//将公共的res导入
import homeBaseImg from './homeBaseImg'
import invite from './invite'
import helperAndCustomerService from './customerservice'
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
    ...res
};
export default index;
