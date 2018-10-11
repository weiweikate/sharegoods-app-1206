const api = {
    //获取专题列表
    findTopicById:['/topic/findByCode',{method:'get'}],
};
import ApiUtils from '../../../api/network/ApiUtils';

const TopicAPI = ApiUtils(api);

export default TopicAPI;
