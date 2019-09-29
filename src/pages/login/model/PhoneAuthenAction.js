import { NativeModules } from 'react-native';

const { PhoneAuthenModule } = NativeModules;

// 一键登录相关接口
const startLoginAuth = () => {
    return PhoneAuthenModule.startLoginAuth();
};

const checkInitResult = () => {
    return PhoneAuthenModule.checkInitResult();
};

const preLogin = () => {
    return PhoneAuthenModule.preLogin();
};

const closeAuth = () => {
    return PhoneAuthenModule.closeAuth();
};

const getVerifyToken = () => {
    return PhoneAuthenModule.getVerifyToken();
};

export { startLoginAuth, checkInitResult, preLogin, closeAuth, getVerifyToken };
