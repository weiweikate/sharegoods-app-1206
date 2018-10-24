const api = {
    getUser: ['/user/getUser', { method: 'get' }]
};
import ApiUtils from '../api/network/ApiUtils'

const UserApi = ApiUtils(api)
export default UserApi
