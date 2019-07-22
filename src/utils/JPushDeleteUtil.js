import {
    NativeModules
} from 'react-native';

export default {
    deleteAllAlias:()=>{
        NativeModules.commModule.deleteAllAlias();
    }
};
