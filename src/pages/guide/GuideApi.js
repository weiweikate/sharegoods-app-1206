
const api = {
    getLucky: ['/config/advertisement/findByUserLevel' , { method: 'post', checkLogin: true }],
}

import ApiUtils from '../../api/network/ApiUtils';

const MineAPI = ApiUtils(api);

export default MineAPI;
