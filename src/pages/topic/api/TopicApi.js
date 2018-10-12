const api = {
    //获取专题列表
    findTopicById: ['/topic/findByCode', { method: 'get' }],
    //订阅或不订阅
    followAction: '/activity/activitySubscribe/addActivitySubscribe'
};
import ApiUtils from '../../../api/network/ApiUtils';

const TopicAPI = ApiUtils(api);

export default TopicAPI;
