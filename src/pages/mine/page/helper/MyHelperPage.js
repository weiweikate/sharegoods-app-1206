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
    Text,
    TouchableOpacity,
    Linking,
    ScrollView
} from 'react-native';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import UIImage from "@mr/image-placeholder";
import ScreenUtils from '../../../../utils/ScreenUtils';

import QYChatUtil from './QYChatModel';
import MineApi from '../../api/MineApi';
import DesignRule from 'DesignRule';
import res from '../../res';

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
            <View style={{ width: ScreenUtils.width, backgroundColor: 'white', marginTop: -1 }}>
                {this.state.typeList.map((item, index) => {
                    return (
                        <View key={index} style={styles.hotQuestionStyle}>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => this.orderListq(item.list)}
                                              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <UIImage source={item.imgUrl ? { uri: item.imgUrl } : icon_wenti}
                                       style={{ width: 37, height: 37 }}/>
                                <Text style={{
                                    fontSize: 11,
                                    color: DesignRule.textColor_secondTitle,
                                    marginTop: 4
                                }}>{item.name}</Text>
                            </TouchableOpacity>
                            <View style={styles.hot2ViewStyle}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <UIText onPress={() => this.gotoquestionDetail(item.list[0].id)}
                                            style={{
                                                marginLeft: 10,
                                                fontSize: 15,
                                                color: DesignRule.textColor_secondTitle
                                            }}
                                            value={item.list.length > 0 ? item.list[0].title : ''} numberOfLines={1}/>
                                </View>
                                <View style={{ width: '100%', height: 0.5, backgroundColor: '#c9c9c9' }}/>
                                <View style={{ flex: 1, justifyContent: 'center', borderColor: '#c9c9c9' }}>
                                    <UIText onPress={() => this.gotoquestionDetail(item.list[1].id)}
                                            style={{
                                                marginLeft: 10,
                                                fontSize: 15,
                                                color: DesignRule.textColor_secondTitle
                                            }}
                                            value={item.list.length > 1 ? item.list[1].title : ''} numberOfLines={1}/>
                                </View>
                            </View>
                        </View>
                    );
                })}

            </View>
        );
    };
    renderBodyView = () => {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={{ backgroundColor: DesignRule.bgColor }}>
                        <Image source={{uri:'http://mr-uat-sg.oss-cn-hangzhou.aliyuncs.com/app/bangzu_kefu%403x.png'}}
                               style={{width:ScreenUtils.width/3*2,height:ScreenUtils.px2dp(71)}}
                               resizeMode={'contain'}/>
                    </View>
                    {this.renderHotQuestionList()}
                    <View style={{ height: 1, backgroundColor: DesignRule.bgColor, marginTop: -0.5 }}/>
                    <View style={{
                        alignItems: 'center',
                        height: 87,
                        flexDirection: 'row',
                        marginTop: 10,
                        backgroundColor: 'white'
                    }}>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => this.questionfeedBack(1)}
                                          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={icon_tuikuan} style={{ width: 37, height: 37 }}/>
                            <Text style={styles.textFontstyle}>查看售后</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => this.questionfeedBack(2)}
                                          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={icon_feedback} style={{ width: 37, height: 37 }}/>
                            <Text style={styles.textFontstyle}>问题反馈</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => this.questionfeedBack(3)}
                                          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={icon_auto_feedback} style={{ width: 37, height: 37 }}/>
                            <Text style={styles.textFontstyle}>查看订单</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 177, backgroundColor: DesignRule.bgColor }}/>
                </ScrollView>
                <View style={{
                    flexDirection: 'row', backgroundColor: '#fff', width: ScreenUtils.width,
                    height: 80, position: 'absolute', bottom: 0, alignItems: 'center', zIndex: 21
                }}>

                    <TouchableOpacity style={{
                        width: 58,
                        height: 54,
                        alignItems: 'center',
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'center'
                    }}
                                      onPress={() => this.jumpQYIMPage()}>
                        <UIImage source={icon_kefu} style={{ height: 23, width: 23 }} resizeMode={'contain'}/>
                        <View style={{ marginLeft: 9, justifyContent: 'center' }}>
                            <Text style={{
                                fontFamily: 'PingFangSC-Regular',
                                fontSize: 16,
                                color: DesignRule.textColor_mainTitle_222
                            }}>在线客服</Text>
                            <Text style={styles.text2Style}>9:00-22:00</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ width: 1, height: '50%', backgroundColor: DesignRule.lineColor_inColorBg }}/>

                    <TouchableOpacity
                        style={{
                            width: 58,
                            height: 54,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            flex: 1
                        }}
                        onPress={() => this.jump2Telephone()}>
                        <UIImage source={icon_phone} style={{ height: 23, width: 24 }} esizeMode={'contain'}/>
                        <View style={{ marginLeft: 9, justifyContent: 'center' }}>
                            <Text style={{
                                fontFamily: 'PingFangSC-Regular',
                                fontSize: 16,
                                color: DesignRule.textColor_mainTitle_222
                            }}>客服电话</Text>
                            <Text style={styles.text2Style}>400-9696-365</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    jumpQYIMPage = () => {
        QYChatUtil.qiYUChat();
    };

    jump2Telephone() {
        Linking.openURL('tel:' + '400-9696-365').catch(e => console.log(e));
    }

    orderListq(list) {
        this.$navigate('mine/helper/HelperQuestionListPage', { list });
    }

    questionfeedBack(type) {
        if (!user.isLogin) {
            this.$navigate('login/login/LoginPage');
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
