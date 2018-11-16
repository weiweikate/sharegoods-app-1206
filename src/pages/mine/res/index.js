import res from '../../../comm/res'//将公共的res导入
import homeBaseImg from './homeBaseImg'
import invite from './invite'
import helperAndCustomerService from './customerservice'
const index = {
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
