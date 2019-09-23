const api = {
    getUser: ['/user/getUser', { method: 'get' }],
    getUserOrderNum:['/orderV2/count',{method:'get'}],
    userShare:['/user/share',{method:'get'}],
    luckyDraw:['/user/send',{method:'post'}],
    shareShortUrl:['/shortUrl/converter',{method:'post'}] //长链转短链 接口
};
import ApiUtils from '../api/network/ApiUtils'

const UserApi = ApiUtils(api)
export default UserApi
