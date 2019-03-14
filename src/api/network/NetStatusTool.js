import {
    Platform,
    NetInfo,
} from 'react-native';
class NetStatusTool {

    constructor() {
        this.netStatus = Platform.os === 'ios' ? 'none' : 'UNKNOWN';
        this.isConnected = false;
        this.setNetStatus = this.setNetStatus.bind(this);
        this.startMonitorNetworkStatus();
    }

    setNetStatus(status) {
        this.netStatus = status;
        switch (status) {
            case 'none':
            case 'unknown':
            case 'NONE':
            case 'UNKNOWN':{
                this.isConnected = false;
                break;
            }
            default: {
                this.isConnected = true;
                break;
            }
        }
    }

    startMonitorNetworkStatus() {
        //监听网络状态改变
        NetInfo.addEventListener('connectionChange', this.setNetStatus);
    }

    endMonitorNetworkStatus() {
        NetInfo.removeEventListener('connectionChange', this.setNetStatus);
    }
}

const netStatusTool = new NetStatusTool();
export { netStatusTool };
