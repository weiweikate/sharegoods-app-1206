import React from 'react';
import CommModal from '../../comm/components/CommModal';
import { DeviceEventEmitter, NativeModules, Platform, TouchableOpacity, View } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import UIText from '../../components/ui/UIText';
import CustomProgress from './../../components/ui/CustomProgress';

export default class VersionUpdateModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showBtn: true,
            progress: 0
        };
    }

    componentWillMount() {
        DeviceEventEmitter.addListener('UpdateEvent', (progress) => {
            if (progress < 100) {
                this.setState({
                    progress: progress
                });
            } else {
                this.setState({
                    progress: 100,
                    showBtn: true
                });
            }
        });
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('UpdateEvent');
    }

    render() {
        return (<CommModal
            animationType='fade'
            transparent={true}
            visible={this.props.showUpdate}>
            <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                backgroundColor: '#fff',
                width: ScreenUtils.width - 84,
                borderRadius: 10,
                borderWidth: 0
            }}>{this.state.showBtn ?
                <UIText value={'是否更新为V' + this.props.updateData.version + '版本？'}
                        style={{
                            fontSize: 17,
                            color: '#333',
                            marginTop: 40,
                            marginBottom: 40,
                            alignSelf: 'center'
                        }}/> :
                <View style={{ flexDirection: 'column' }}>
                    <CustomProgress
                        ref="progressBar"
                        style={{
                            marginTop: 100
                        }}
                        progress={this.state.progress}
                        buffer={100}
                    />
                    <UIText value={this.state.progress + '%'}/>
                </View>}
                {this.state.showBtn ?
                    <View style={{ height: 0.5, backgroundColor: '#eee' }}/> : null}
                <View style={{ flexDirection: 'row' }}>
                    {
                        // this.props.forceUpdate ? null :
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 45 }}
                                onPress={() => {
                                    this.props.onDismiss();
                                }}>
                                <UIText value={'以后再说'} style={{ color: '#999' }}/>
                            </TouchableOpacity>
                            < View style={{ width: 0.5, backgroundColor: '#eee' }}/>
                        </View>
                    }{
                    this.state.showBtn ?
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 45,
                                backgroundColor: '#d51243',
                                borderBottomRightRadius: 10,
                                borderBottomLeftRadius: 10
                            }}
                            onPress={() => {
                                this.toUpdate();
                            }}>
                            <UIText value={'立即更新'} style={{ color: '#fff' }}/>
                        </TouchableOpacity> : null
                }
                </View>
            </View>
        </CommModal>);
    }

    toUpdate = () => {
        if (Platform.OS === 'ios') {
            // 前往appstore
        } else {
            if (this.props.updateData.forceUpdate === 1) {
                // 强制更新app
                NativeModules.commModule.updateable(JSON.stringify(this.props.updateData), true, () => {
                    this.setState({
                        showBtn: false
                    });
                });
            } else {
                // 关闭弹框
                this.props.onDismiss();
                // 更新app
                NativeModules.commModule.updateable(JSON.stringify(this.props.updateData), false, null);
            }
        }
    };
}
