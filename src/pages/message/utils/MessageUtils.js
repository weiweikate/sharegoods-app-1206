/**
 * @author xzm
 * @date 2018/10/23
 */

const MessageUtils = {

    goDetailPage(navigation, type, params,time) {
        let pagParams = params
        switch (type) {
            case 100://支付成功
                pagParams = JSON.parse(params);
                pagParams.type = 'pay_success';
                pagParams.time = time;
                navigation.navigate("message/PayMessagePage", pagParams);
                break;
            case 101://支付失败
                pagParams = JSON.parse(params);
                pagParams.type = 'pay_refund';
                pagParams.time = time;
                navigation.navigate("message/PayMessagePage", pagParams);
                break;
            case 107://秒杀
                navigation.navigate("topic/TopicDetailPage", {
                    activityCode: params,
                    activityType: 1
                });
                break;
            case 108://降价拍
                navigation.navigate("topic/TopicDetailPage", {
                    activityCode: params,
                    activityType: 2
                });
                break;
            case 212://招募
                navigation.navigate("spellShop/MyShop_RecruitPage", params);
                break;
            default:
                break;

        }

    }
};
export default MessageUtils;
