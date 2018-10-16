/**
 * @author xzm
 * @date 2018/10/15
 */
const api = {
    //消息查询
    queryMessage:'/message/queryMessagePage',
    //通知查询
    queryNotice:'/notice/queryNoticePage'
};
import ApiUtils from '../../../api/network/ApiUtils';

const MessageAPI = ApiUtils(api);

export default MessageAPI;
