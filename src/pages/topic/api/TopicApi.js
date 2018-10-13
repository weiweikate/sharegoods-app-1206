const api = {
    //获取专题列表
    findTopicById: ['/topic/findByCode', { method: 'get' }],
    //根据ID查询降价拍详情 沈耀鑫
    activityDepreciate_findById:['/operator/activityDepreciate/findById',{method:'get'}],
    //秒杀详情 周浩
    seckill_findByCode:['/operator/seckill/findByCode',{method:'get'}],
    //订阅或不订阅
    followAction: '/activity/activitySubscribe/addActivitySubscribe'
};
import ApiUtils from '../../../api/network/ApiUtils';

const TopicAPI = ApiUtils(api);

export default TopicAPI;
