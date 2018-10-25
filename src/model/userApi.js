const api = {
    getUser: ['/user/getUser', { method: 'get' }],
    getUserOrderNum:['/order/countUserOrderNum',{method:'post'}]
};
import ApiUtils from '../api/network/ApiUtils'

const UserApi = ApiUtils(api)
export default UserApi
