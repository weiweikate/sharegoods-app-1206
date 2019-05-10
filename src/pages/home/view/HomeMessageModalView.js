/**
 * @author xzm
 * @date 2019/3/11
 */

'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    Image,
    ImageBackground,
    TouchableWithoutFeedback,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import EmptyUtils from '../../../utils/EmptyUtils';
import CommModal from '../../../comm/components/CommModal';
import { MRText as Text } from '../../../components/ui/index';
import res from '../res/index';

const { px2dp } = ScreenUtils;

const closeImg = res.button.cancel_white_circle;
const home_notice_bg = res.home_notice_bg;

import XQSwiper from '../../../components/ui/XGSwiper';
import DesignRule from '../../../constants/DesignRule';
import HomeModalManager from '../manager/HomeModalManager';
import { observer } from 'mobx-react';

const { autoSizeWidth } = ScreenUtils;
import ImageLoad from '@mr/image-placeholder';
import { homeModule } from '../model/Modules';
import { navigate } from '../../../navigation/RouterMap';

@observer
export default class HomeMessageModalView extends React.Component {
    state = {
        messageIndex: 0
    };

    constructor(props) {
        super(props);
    }

    messageIndexRender() {
        let messageData = HomeModalManager.homeMessage || [];
        if (EmptyUtils.isEmptyArr(messageData)) {
            return null;
        }
        let indexs = [];
        for (let i = 0; i < messageData.length; i++) {
            let view = i === this.state.messageIndex ?
                <View style={[styles.messageIndexStyle, { backgroundColor: '#FF427D' }]}/> :
                <View style={[styles.messageIndexStyle, { backgroundColor: '#f4d7e4' }]}/>;
            indexs.push(view);
        }
        return (
            <View style={{
                flexDirection: 'row',
                width: px2dp(12 * messageData.length),
                justifyContent: messageData.length === 1 ? 'center' : 'space-between',
                marginBottom: px2dp(12),
                height: 12,
                alignSelf: 'center'
            }}>
                {indexs}
            </View>
        );
    }

    messageRender(item, index) {
        return (
            <View key={'message' + index} onStartShouldSetResponder={() => true}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ showsVerticalScrollIndicator: false }}>
                    <Text style={{
                        color: DesignRule.textColor_mainTitle,
                        fontSize: DesignRule.fontSize_secondTitle,
                        alignSelf: 'center'
                    }}>
                        {item.title}
                    </Text>
                    <Text style={{
                        width: px2dp(230),
                        color: DesignRule.textColor_secondTitle,
                        fontSize: DesignRule.fontSize_24,
                        marginTop: 14,
                        marginBottom: 10,
                        height: 500
                    }}>
                        {item.content}
                    </Text>
                </ScrollView>
            </View>
        );
    }

    render() {
        let dataSource = HomeModalManager.homeMessage || [];
        return (
            <CommModal ref={(ref) => {
                this.messageModal = ref;
            }}
                       onRequestClose={() => HomeModalManager.closeMessage()}
                       visible={HomeModalManager.isShowNotice && HomeModalManager.isHome}>
                <View style={{ flex: 1, width: ScreenUtils.width, alignItems: 'center' }}>
                    <TouchableWithoutFeedback onPress={() => HomeModalManager.closeMessage()}>
                        <Image source={closeImg} style={styles.messageCloseStyle}/>
                    </TouchableWithoutFeedback>

                    <ImageBackground source={home_notice_bg} style={styles.messageBgStyle}>
                        <XQSwiper
                            style={{
                                alignSelf: 'center',
                                marginTop: px2dp(145),
                                width: px2dp(230),
                                height: px2dp(211)
                            }}
                            height={px2dp(230)} width={px2dp(230)} renderRow={this.messageRender}
                            dataSource={dataSource}
                            loop={false}
                            onDidChange={(item, index) => {
                                this.setState({
                                    messageIndex: index
                                });
                            }}
                        />
                        <View style={{ flex: 1 }}/>
                        {this.messageIndexRender()}
                    </ImageBackground>
                </View>
            </CommModal>
        );
    }
}


function AdViewBindModal(modal) {
    return (
    class HomeAdModal extends React.Component {
        state = {
            messageIndex: 0
        };

        constructor(props) {
            super(props);
        }

        gotoPage = () => {
            let data = modal.AdData || {};
            const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
            let params = homeModule.paramsNavigate(data);
            if (router) {
                navigate(router, params);
            }
            modal.closeAd();
            //页面跳转
        };

        render() {
            let AdData = modal.AdData || {};
            let image = AdData.image || '';
            return (
                <CommModal ref={(ref) => {
                    this.messageModal = ref;
                }}
                           onRequestClose={() => modal.closeAd()}
                           visible={modal.isShowAd && modal.isHome}>
                    <View style={{ flex: 1, width: ScreenUtils.width, alignItems: 'center' }}>
                        <View style={{ flex: 1 }}/>
                        <TouchableOpacity onPress={() => {
                            this.gotoPage();
                        }}>
                            <ImageLoad style={{ width: autoSizeWidth(310), height: autoSizeWidth(410), backgroundColor: '#f5f5f5' }}
                                       source={{ uri: image }}
                                       resizeMode={'contain'}
                                       showPlaceholder={false}
                            >
                            </ImageLoad>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => {
                                modal.closeAd();
                            }} style={{ marginTop: autoSizeWidth(25) }}>
                                <Image source={closeImg} style={{ height: autoSizeWidth(24), width: autoSizeWidth(24) }}
                                       resizeMode={'stretch'}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </CommModal>
            );
        }
    })

}

let HomeAdModal = observer(AdViewBindModal(HomeModalManager));
export{HomeAdModal, AdViewBindModal}


const styles = StyleSheet.create({
    messageCloseStyle: {
        width: px2dp(24),
        height: px2dp(24),
        marginTop: px2dp(100),
        alignSelf: 'flex-end',
        marginRight: ((ScreenUtils.width) - px2dp(300)) / 2
    },
    messageBgStyle: {
        width: px2dp(295),
        height: px2dp(390),
        marginTop: px2dp(20)
    },
    messageIndexStyle: {
        width: px2dp(10),
        height: px2dp(10),
        borderRadius: px2dp(5)
    }
});
