

import {
    NativeModules
} from 'react-native';
const {QYChatModule} = NativeModules;

/**
 *
 */

export default {
    //权限不足。会reject
    qiYUChat(jsonData= {     groupId:0,     staffId:0,     title:'七鱼金融',  }){
        QYChatModule.qiYUChat(jsonData);
    },
}
