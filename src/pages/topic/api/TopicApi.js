const api = {
    //获取专题列表
    findTopicById: ['/topic/findByCode', { method: 'get' }],
    //降价拍详情 沈耀鑫
    activityDepreciate_findByCode:['/operator/activityDepreciate/findByCode',{method:'get'}],
    //秒杀详情 周浩
    seckill_findByCode:['/operator/seckill/findByCode',{method:'get'}],
    //查看礼包详情 杨小猛
    findActivityPackageDetail:['/operator/activitypackage/findActivityPackageDetail',{method:'get'}],
    //订阅或不订阅
    followAction: ['/activity/activitySubscribe/addActivitySubscribe',{method:'post'}],
    //获取广告位信息
    getQueryAdvertisingList:['/advertising/queryAdvertisingList',{method:'post'}]
};
import ApiUtils from '../../../api/network/ApiUtils';

const TopicAPI = ApiUtils(api);

export default TopicAPI;
