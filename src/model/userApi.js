const api = {
    getUser: ['/user/getUser', { method: 'get' }],
    getUserOrderNum:['/order/count',{method:'post'}],
    userShare:['/user/share',{method:'get'}],
    luckyDraw:['/user/send',{method:'post'}],
    shareShortUrl:['/shortUrl/converter',{method:'post'}]
};
import ApiUtils from '../api/network/ApiUtils'

const UserApi = ApiUtils(api)
export default UserApi
