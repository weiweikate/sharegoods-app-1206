
const api = {
    getUserRecord: ['/user/getUserRecord', { method: 'post', checkLogin: true }],
    registerSend: ['/user/registerSend' , { method: 'get', checkLogin: true }],
    rewardzInfo: ['/config/advertisement/queryAdvertisementList' , { method: 'post', checkLogin: true }],
    getLucky: ['/config/advertisement/findByUserLevel' , { method: 'post', checkLogin: true }],
    queryAdvertisingList:  '/advertising/queryAdvertisingList'
}

import ApiUtils from '../../api/network/ApiUtils';

const MineAPI = ApiUtils(api);

export default MineAPI;
