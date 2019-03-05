import { NativeModules } from "react-native";

const { PhoneAuthenModule } = NativeModules;

const isCanPhoneAuthen = () => {
    return PhoneAuthenModule.isCanPhoneAuthen();
};

const startPhoneAuthen = (phoneNum) => {

};

export {isCanPhoneAuthen,startPhoneAuthen};
