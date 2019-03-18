/**
 * Created by nuomi on 2018/7/18.
 * 消息中心页面
 */
import React from 'react';
import {
    StyleSheet, View, Image, DeviceEventEmitter,
    TouchableOpacity, ScrollView
} from 'react-native';
import {
    UIText
} from '../../components/ui';
import {MRText as Text} from '../../components/ui'
import ScreenUtils from '../../utils/ScreenUtils';
import BasePage from '../../BasePage';
import MessageApi from './api/MessageApi';
import EmptyUtils from '../../utils/EmptyUtils';
import DesignRule from '../../constants/DesignRule';
import res from './res';
import { TrackApi } from '../../utils/SensorsTrack';

const {
    icon_03: noticeIcon,
    icon_06: newsIcon,
    icon_08: spellIcon,
    button: {
        arrow_right_black: arrow_right
    }
} = res;
const { px2dp } = ScreenUtils;


export default class MessageCenterPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            explain: '',
            shopMessageCount: 0,
            noticeCount: 0,
            messageCount: 0
        };
    }

    $navigationBarOptions = {
        show: true, // false则隐藏导航
        title: '消息中心'
    };


    componentDidMount() {
        this.loadPageData();
        this.listener = DeviceEventEmitter.addListener('contentViewed', this.loadPageData);
    }

    _render() {
        return (
            <ScrollView style={styles.container}>
                {this.renderBodyView()}
            </ScrollView>
        );
    }

    loadPageData = () => {
        MessageApi.getNewNoticeMessageCount().then(result => {
            if (!EmptyUtils.isEmpty(result.data)) {
                this.setState({
                    shopMessageCount: result.data.shopMessageCount,
                    noticeCount: result.data.noticeCount,
                    messageCount: result.data.messageCount
                });
            }
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }

    orderMenuJump(i) {
        switch (i) {
            case 0:
                this.$navigate('message/NotificationPage');
                TrackApi.ViewNotice();
                break;
            case 1:
                TrackApi.ViewMessage();
                this.$navigate('message/MessageGatherPage');
                break;

            case 2:
                TrackApi.ViewPinMessage();
                this.$navigate('message/ShopMessagePage');
                break;
        }
    }

    renderBodyView = () => {
        let leftImage = [noticeIcon, newsIcon, spellIcon];
        let leftText = ['通知', '消息', '拼店消息'];
        let arr = [];
        for (let i = 0; i < leftImage.length; i++) {
            let count;
            if (i === 0) {
                count = this.state.noticeCount;
            }
            if (i === 1) {
                count = this.state.messageCount;
            }
            if (i === 2) {
                count = this.state.shopMessageCount;
            }


            arr.push(
                <View key={i} style={{ width: ScreenUtils.width, height: 60, marginTop: 11 }}>
                    <TouchableOpacity style={{
                        flex: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal:DesignRule.margin_page,
                        backgroundColor: 'white',
                        flexDirection: 'row'
                    }} onPress={() => this.orderMenuJump(i)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={leftImage[i]} style={{ height: 35 }} resizeMode={'contain'}/>
                            <UIText value={leftText[i]} style={[{ fontSize: DesignRule.fontSize_secondTitle, marginLeft: DesignRule.margin_page }]}/>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {count ? <View style={{
                                marginRight: 7,
                                backgroundColor: DesignRule.mainColor,
                                borderRadius: px2dp(8),
                                height: px2dp(16),
                                width: px2dp(16),
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    color: 'white',
                                    includeFontPadding: false,
                                    fontSize: DesignRule.fontSize_20
                                }}>{count}</Text>
                            </View> : null}
                            <Image source={arrow_right} style={{ height: 14 }} resizeMode={'contain'}/>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
        return arr;
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
    }
});
