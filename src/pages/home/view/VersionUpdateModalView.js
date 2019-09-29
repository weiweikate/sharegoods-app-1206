
import React from 'react';
import CommModal from '../../../comm/components/CommModal';
import {
    DeviceEventEmitter,
    NativeModules,
    Platform,
    TouchableOpacity,
    View,
    ProgressBarAndroid,
    Linking
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import UIText from '../../../components/ui/UIText';
import DesignRule from '../../../constants/DesignRule';
import StringUtils from '../../../utils/StringUtils';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import HomeModalManager from '../manager/HomeModalManager';
import bridge from '../../../utils/bridge';

@observer
export default class VersionUpdateModalView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showBtn: true,
            progress: 0,
            exist: false
        };
    }


    versionUpdate = autorun(() => {
        let versionData = HomeModalManager.versionData || {};
        if (versionData) {
            if (Platform.OS !== 'ios') {
                bridge.isApkExist(versionData.version).then((isExist) => {
                    this.setState({
                        positiveTxt: isExist ? '立即安装' : '立即更新',
                        updateContent: versionData.description
                    });
                });
            } else {
                this.setState({
                    positiveTxt: '立即更新',
                    updateContent: versionData.description
                });
            }
        }
    });

    componentWillMount() {
        if (Platform.OS !== 'ios') {
            this.updateEvent = DeviceEventEmitter.addListener('UpdateEvent', (progress) => {
                if (progress < 100) {
                    this.currProgress = progress;
                } else {
                    this.setState({
                        showBtn: true
                    });
                    this.currProgress = 100;
                }
                this.setState({
                    progress: this.currProgress,
                    positiveTxt: '立即安装',
                    updateContent: HomeModalManager.versionData.description
                });
            });
        }
    }

    render() {
        let versionData = HomeModalManager.versionData || {};
        return (<CommModal
            focusable={false}
            animationType='fade'
            onRequestClose={() => {
                HomeModalManager.closeUpdate(false);
            }}
            visible={HomeModalManager.isShowUpdate}>
            <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                backgroundColor: 'white',
                width: ScreenUtils.width - 84,
                borderRadius: 10,
                borderWidth: 0
            }}>{this.state.showBtn ?
                <UIText value={this.state.updateContent}
                        style={{
                            fontSize: 17,
                            color: DesignRule.textColor_mainTitle,
                            marginTop: 40,
                            marginBottom: 40,
                            marginLeft: 10,
                            marginRight: 10,
                            alignSelf: 'center'
                        }}/> :
                <View style={{ flexDirection: 'column', justifyContent: 'center', borderRadius: 2 }}>
                    <ProgressBarAndroid
                        styleAttr={'Horizontal'}
                        indeterminate={false}
                        color={DesignRule.mainColor}
                        style={{
                            marginTop: 50,
                            marginLeft: 20,
                            marginRight: 20,
                            borderRadius: 10
                        }}
                        progress={this.state.progress / 100}
                    />
                    <UIText value={this.state.progress + '%'}
                            style={{ alignSelf: 'center', marginBottom: 40, marginTop: 5 }}/>
                </View>}
                {this.state.showBtn ?
                    <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/> : null}
                <View style={{ flexDirection: 'row' }}>
                    {
                        versionData.forceUpdate ? null :
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 45 }}
                                    onPress={() => {
                                        // 缓存状态
                                        HomeModalManager.closeUpdate(true);
                                    }}>
                                    <UIText value={'以后再说'} style={{ color: DesignRule.textColor_instruction }}/>
                                </TouchableOpacity>
                                < View style={{ width: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
                            </View>
                    }{
                    this.state.showBtn ?
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 45,
                                backgroundColor: DesignRule.mainColor,
                                borderBottomRightRadius: 10,
                                borderBottomLeftRadius: versionData.forceUpdate ? 10 : 0
                            }}
                            onPress={() => {
                                this.toUpdate();
                            }}>
                            <UIText value={this.state.positiveTxt} style={{ color: 'white' }}/>
                        </TouchableOpacity> : null
                }
                </View>
            </View>
        </CommModal>);
    }

    toUpdate = () => {
        let updateData = HomeModalManager.versionData || {};
        if (Platform.OS === 'ios') {
            // 前往appstore
            if (StringUtils.isEmpty(updateData.url)) {
                Linking.openURL('https://itunes.apple.com/cn/app/id1439275146');
            } else {
                Linking.openURL(updateData.url);
            }
        } else {
            if (updateData.forceUpdate === 1) {
                // 强制更新app
                NativeModules.commModule.updateable(JSON.stringify(updateData), true, (exist) => {
                    if (this.state.positiveTxt !== '立即安装') {
                        this.setState({
                            showBtn: false,
                            positiveTxt: exist ? '立即安装' : '立即更新',
                            updateContent: updateData.description
                        });
                    }
                });
            } else {
                // 关闭弹框
                HomeModalManager.closeUpdate(false);
                // 更新app
                NativeModules.commModule.updateable(JSON.stringify(updateData), false, null);
            }
        }
    };
}
