import React, { Component } from 'react';
import {
    Platform,
    NetInfo,
    View,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import res from '../res';
import DesignRule from '../../constants/DesignRule';
import {MRText as Text} from '../../components/ui';
class NetStatus {

    constructor() {
        this.netStatus = Platform.os === 'ios' ? 'none' : 'UNKNOWN';
        this.isConnected = true;
        this.setNetStatus = this.setNetStatus.bind(this);

    }

    setNetStatus(status) {
        this.netStatus = status;
        switch (status) {
            case 'none':
            case 'unknown':
            case 'NONE':
            case 'UNKNOWN': {
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
        NetInfo.addEventListener('change', this.setNetStatus);
    }

    endMonitorNetworkStatus() {
        NetInfo.removeEventListener('change', this.setNetStatus);
    }
}

const netStatus = new NetStatus();
export { netStatus };

export default function NoNetHighComponent(WrappedComponent) {
    return class HighComponent extends Component {
        constructor(props) {
            super(props);
            let isConnected = netStatus.isConnected;
            this.state = {
                isConnected: isConnected
            };

            // this.render = this.render.bind(this);
            this.onPress = this.onPress.bind(this);

        }

        componentWillMount() {
            this.state.isConnected = netStatus.isConnected;
        }

        render() {
            if (this.state.isConnected === true) {
                return <WrappedComponent {...this.props}/>;
            } else {
                return this._renderDefaultNoNet();
            }
        }

        onPress() {
            if (netStatus.isConnected === true) {
                this.props.$refreshData && this.props.$refreshData();
            }
            this.setState({ isConnected: netStatus.isConnected });
        }


        _renderDefaultNoNet() {
            return (
                <View style={[this.props.style, { alignItems: 'center', justifyContent: 'center', flex: 1 }]}>
                    <TouchableWithoutFeedback onPress={this.onPress}>
                        <View>
                            <Image source={res.placeholder.netError} style={{ height: 100, width: 100 }}/>
                            <Text style={{ marginTop: 10, color: DesignRule.textColor_secondTitle }} allowFontScaling={false}>无网络</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            );
        }

    };

}
