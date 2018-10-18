/**
 * @author xzm
 * @date 2018/10/15
 */
const api = {
    //消息查询
    queryMessage:'/message/queryMessagePage',
    //通知查询
    queryNotice:['/notice/queryNoticePage',{method:'post'}],
    //获取未读消息数量
    getNewNoticeMessageCount:['/notice/newNoticeMessageCount',{method:'get'}],
    //同意拒绝 拼店消息
    confirmMessage:['/message/confirmMessage',{method:'get'}]
};
import ApiUtils from '../../../api/network/ApiUtils';

const MessageAPI = ApiUtils(api);

export default MessageAPI;
