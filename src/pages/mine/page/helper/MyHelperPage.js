/**
 * @author chenxiang
 * @date on 2018/9/7
 * @describe 首页
 * @org www.sharegoodsmall.com
 * @email chenxiang@meeruu.com
 */
import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Linking,
    ScrollView
} from 'react-native';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { track, trackEvent } from '../../../../utils/SensorsTrack';
import QYChatUtil from './QYChatModel';
import MineApi from '../../api/MineApi';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import { MRText as Text ,NoMoreClick} from '../../../../components/ui';

const {
    // top_kefu,
    icon_wenti,
    icon_tuikuan,
    icon_feedback,
    icon_auto_feedback,
    icon_phone,
    icon_kefu
} = res.helperAndCustomerService;
import user from '../../../../model/user';
import { observer } from 'mobx-react/native';
import OssHelper from '../../../../utils/OssHelper';
import ImageLoad from '@mr/image-placeholder';


@observer
export default class MyHelperPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            typeList: []
        };
    }

    $navigationBarOptions = {
        title: '帮助与客服',
        show: true // false则隐藏导航
    };

    renderHotQuestionList = () => {
        return (
            <View style={{ width: ScreenUtils.width, backgroundColor: 'white' }}>
                {this.state.typeList.map((item, index) => {
                    return (
                        <View key={index} style={styles.hotQuestionStyle}>
                            <NoMoreClick activeOpacity={0.6} onPress={() => this.orderListq(item.list)}
                                              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <UIImage source={item.imgUrl ? { uri: item.imgUrl } : icon_wenti}
                                         style={{ width: 37, height: 37 }}/>
                                <Text style={{
                                    fontSize: 11,
                                    color: DesignRule.textColor_secondTitle,
                                    marginTop: 4
                                }} allowFontScaling={false}>{item.name}</Text>
                            </NoMoreClick>
                            <View style={styles.hot2ViewStyle}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <UIText onPress={() => this.gotoquestionDetail(item.list[0].id)}
                                            style={{
                                                marginLeft: 10,
                                                fontSize: 15,
                                                color: DesignRule.textColor_secondTitle
                                            }}
                                            value={ Array.isArray(item.list)&&item.list.length > 0 ? item.list[0].title : ''} numberOfLines={1}/>
                                </View>
                                <View style={{ width: '100%', height: 0.5, backgroundColor: '#c9c9c9' }}/>
                                <View style={{ flex: 1, justifyContent: 'center', borderColor: '#c9c9c9' }}>
                                    <UIText onPress={() => this.gotoquestionDetail(item.list[1].id)}
                                            style={{
                                                marginLeft: 10,
                                                fontSize: 15,
                                                color: DesignRule.textColor_secondTitle
                                            }}
                                            value={item.list instanceof Array&&item.list.length > 1 ? item.list[1].title : ''} numberOfLines={1}/>
                                </View>
                            </View>
                        </View>
                    );
                })}

            </View>
        );
    };
    renderBodyView = () => {
        let helperIcon = OssHelper('/app/bangzu_kefu.png');
        console.log('renderBodyView', helperIcon)
        return (
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ backgroundColor: DesignRule.bgColor }}>
                        <ImageLoad source={{ uri: helperIcon }}
                                   style={{ width: ScreenUtils.width, height: ScreenUtils.px2dp(71) }}
                                   resizeMode={'contain'}/>
                    </View>
                    {this.renderHotQuestionList()}
                    <View style={{ height: 0.1, backgroundColor: DesignRule.white,  }}/>
                    <View style={{
                        alignItems: 'center',
                        height: 87,
                        flexDirection: 'row',
                        marginTop: 10,
                        backgroundColor: 'white'
                    }}>
                        <NoMoreClick activeOpacity={0.6} onPress={() => this.questionfeedBack(1)}
                                          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={icon_tuikuan} style={{ width: 37, height: 37 }}/>
                            <Text style={styles.textFontstyle} allowFontScaling={false}>查看售后</Text>
                        </NoMoreClick>
                        <NoMoreClick activeOpacity={0.6} onPress={() => this.questionfeedBack(2)}
                                          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={icon_feedback} style={{ width: 37, height: 37 }}/>
                            <Text style={styles.textFontstyle} allowFontScaling={false}>问题反馈</Text>
                        </NoMoreClick>
                        <NoMoreClick activeOpacity={0.6} onPress={() => this.questionfeedBack(3)}
                                          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={icon_auto_feedback} style={{ width: 37, height: 37 }}/>
                            <Text style={styles.textFontstyle} allowFontScaling={false}>查看订单</Text>
                        </NoMoreClick>
                    </View>
                    <View style={{ height: 177, backgroundColor: DesignRule.bgColor }}/>
                </ScrollView>
                <View style={{
                    flexDirection: 'row', backgroundColor: '#fff', width: ScreenUtils.width,
                    height: 80, position: 'absolute', bottom: 0, alignItems: 'center', zIndex: 21
                }}>

                    <NoMoreClick style={{
                        width: 58,
                        height: 54,
                        alignItems: 'center',
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'center'
                    }}
                                      onPress={() => this.jumpQYIMPage()}>
                        <Image source={icon_kefu} style={{ height: 23, width: 23 }} resizeMode={'contain'}/>
                        <View style={{ marginLeft: 9, justifyContent: 'center' }}>
                            <Text style={{
                                fontFamily: 'PingFangSC-Regular',
                                fontSize: 16,
                                color: DesignRule.textColor_mainTitle_222
                            }} allowFontScaling={false}>在线客服</Text>
                            <Text style={styles.text2Style} allowFontScaling={false}>9:00-22:00</Text>
                        </View>
                    </NoMoreClick>

                    <View style={{ width: 1, height: '50%', backgroundColor: DesignRule.lineColor_inColorBg }}/>

                    <NoMoreClick
                        style={{
                            width: 58,
                            height: 54,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            flex: 1
                        }}
                        onPress={() => this.jump2Telephone()}>
                        <Image source={icon_phone} style={{ height: 23, width: 24 }} resizeMode={'contain'}/>
                        <View style={{ marginLeft: 9, justifyContent: 'center' }}>
                            <Text style={{
                                fontFamily: 'PingFangSC-Regular',
                                fontSize: 16,
                                color: DesignRule.textColor_mainTitle_222
                            }} allowFontScaling={false}>客服电话</Text>
                            <Text style={styles.text2Style} allowFontScaling={false}>400-9696-365</Text>
                        </View>
                    </NoMoreClick>
                </View>
            </View>
        );
    };
    jumpQYIMPage = () => {
        track(trackEvent.ClickOnlineCustomerService
            , { customerServiceModuleSource: 1 });
        QYChatUtil.qiYUChat();
    };

    jump2Telephone() {
        track(trackEvent.ClickPhoneCustomerService
            , { customerServiceModuleSource: 1 });
        Linking.openURL('tel:' + '400-9696-365').catch(e => console.log(e));
    }

    orderListq(list) {
        this.$navigate('mine/helper/HelperQuestionListPage', { list });
    }

    questionfeedBack(type) {
        if (!user.isLogin) {
            this.gotoLoginPage();
            return;
        }
        if (type === 1) {
            this.$navigate('order/afterSaleService/AfterSaleListPage');
        } else if (type === 2) {
            this.$navigate('mine/helper/HelperFeedbackPage');
        } else if (type === 3) {
            this.$navigate('order/order/MyOrdersListPage', { index: 0 });
        }

    }

    gotoquestionDetail(id) {
        console.log(id);
        this.$navigate('mine/helper/HelperQuestionDetail', { id: id });
    }

    componentDidMount() {
        let list = [];
        MineApi.queryHelpQuestionList().then(res => {
            console.log(res);
            res.data.forEach(item => {
                list.push({
                    name: item.name,
                    list: item.helpQuestionExtList,
                    typeid: item.id,
                    imgUrl: item.imgUrl
                });
            });
            console.log("componentDidMount",list)
            this.setState({
                typeList: list
            });
        }).catch(error => {
            this.$toastShow(error.msg);
            console.log(error);
        });
    }

    _render() {
        return (
            <View style={styles.container}>
                {this.renderBodyView()}
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: DesignRule.bgColor,
        marginBottom: ScreenUtils.safeBottom
    },
    hotQuestionStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        width: ScreenUtils.width,
        height: 80,
        borderColor: '#c9c9c9',
        borderBottomWidth: 0.5
    },
    hot2ViewStyle: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 2,
        borderColor: '#c9c9c9',
        // borderWidth: 0.5,
        borderLeftWidth: 0.5
    },
    textFontstyle: {
        fontSize: 12,
        color: DesignRule.textColor_mainTitle,
        fontFamily: 'PingFangSC-Regular',
        marginTop: 5
    },
    text2Style: {
        color: DesignRule.textColor_instruction,
        fontSize: 12,
        fontFamily: 'PingFangSC-Light'
    }
});
