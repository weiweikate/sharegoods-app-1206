import { NativeModules } from 'react-native';
const RNSensorsAnalyticsModule = NativeModules.RNSensorsAnalyticsModule;

const OrderTrack = {
    example: '$example',
};

// RNSensorsAnalyticsModule.track("event_name",parmas:{})}>
export default RNSensorsAnalyticsModule.track;
export {OrderTrack};
