// 原生桥接接口函数请使用'$'开头
import {
    NativeModules
} from 'react-native';

export default {
    $toast(msg) {
        NativeModules.commModule.toast(msg)
    }
};
