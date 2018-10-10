const api = {
    //获取专题列表
    findTopicById:['/topic/findById',{method:'get'}],
};
import ApiUtils from '../../../api/network/ApiUtils';

const TopicAPI = ApiUtils(api);

export default TopicAPI;
