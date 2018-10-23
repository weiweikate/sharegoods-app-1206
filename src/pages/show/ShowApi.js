const api = {
    // 获取秀场
   showQuery: ['/discover/query', {method: 'get'}]
};
import ApiUtils from '../../api/network/ApiUtils'

const ShowApi = ApiUtils(api);

export default ShowApi;
