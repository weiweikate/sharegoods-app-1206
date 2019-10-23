/**
 * @author xzm
 * @date 2019/10/21
 */

const api = {
    //砸金蛋抽奖
    getLotteryResultV2:['/activity/lottery/click',{method:'get'}]
}
import ApiUtils from '../../../api/network/ApiUtils';

const MarketingApi = ApiUtils(api);
export default MarketingApi;
