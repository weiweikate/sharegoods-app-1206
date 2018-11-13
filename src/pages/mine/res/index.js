import res from '../../../comm/res'//将公共的res导入
import homeBaseImg from './homeBaseImg'
import invite from './invite'
const index = {
    homeBaseImg:{
        ...homeBaseImg
    },
    invite:{
        ...invite
    },
    ...res
};
export default index;
