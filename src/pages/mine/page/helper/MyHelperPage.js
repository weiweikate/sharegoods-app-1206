/**
 * Created by xiangchen on 2018/7/10.
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
import UIImage from '../../../../components/ui/UIImage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import csperson from '../../res/customerservice/kefu-img.png';
// import backmg from '../../res/customerservice/xwduo.png';
import kf11 from '../../res/customerservice/kf_11.png';
import monenybpg from '../../res/customerservice/kf_20.png';
import qbcIcon from '../../res/customerservice/kf_22.png';
import autobcIon from '../../res/customerservice/kf_24.png';
import phoneIcon from '../../res/customerservice/bangzukefu_icon.png';
import personIcon from '../../res/customerservice/bangzyuef_icon.png';
import QYChatUtil from './QYChatModel';
import MineApi from '../../api/MineApi';
import DesignRule from 'DesignRule';

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
                                <Image source={kf11} style={{ width: 37, height: 37 }}/>
                                <Text style={{
                                    fontSize: 11,
                                    color: DesignRule.textColor_secondTitle,
                                    marginTop: 2
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
                    <View style={{ marginTop: 9, paddingLeft: 36, backgroundColor: DesignRule.bgColor }}>
                        <Image source={csperson}
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
                        <TouchableOpacity activeOpacity={0.6} onPress={() => console.log('退款进度')}
                                          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={monenybpg} style={{ width: 37, height: 37 }}/>
                            <Text style={styles.textFontstyle}>退款进度</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => this.questionfeedBack()}
                                          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={qbcIcon} style={{ width: 37, height: 37 }}/>
                            <Text style={styles.textFontstyle}>问题反馈</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => console.log('自动退款')}
                                          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={autobcIon} style={{ width: 37, height: 37 }}/>
                            <Text style={styles.textFontstyle}>自动退款</Text>
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
                    }} onPress={() => this.jump2Telephone()}>
                        <UIImage source={phoneIcon} style={{ height: 23, width: 23, marginTop: 3 }}/>
                        <View style={{ marginLeft: 16, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.textFontstyle}>咨询电话</Text>
                            <Text style={styles.text2Style}>9：00-21：00</Text>
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
                        }} onPress={() => this.jumpQYIMPage()}>
                        <UIImage source={personIcon} style={{ height: 23, width: 24 }}/>
                        <View style={{ marginLeft: 16, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.textFontstyle}>在线客服</Text>
                            <Text style={styles.text2Style}>9：00-21：00</Text>
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

    jumpTohelpPage() {
        console.log('fankui');
    }

    orderListq(list) {
        this.$navigate('mine/helper/HelperQuestionListPage', { list });
    }

    questionfeedBack() {
        this.$navigate('mine/helper/HelperFeedbackPage');
    }

    gotoquestionDetail(id) {
        console.log(id);
        this.$navigate('mine/helper/HelperQuestionDetail', { id: id });
    }

    componentDidMount() {
        let list = [];
        MineApi.queryHelpQuestionList().then(res => {
            console.log(res);
            if (res.code == 10000) {
                Object.keys(res.data).forEach(item => {
                    list.push({
                        name: item,
                        list: res.data[item],
                        typeid: res.data[item][0].typeId
                    });
                });
                this.setState({
                    typeList: list
                });
            } else {
                this.$toastShow(res.msg);
                this.setState({ isEmpty: true });
            }
        }).catch(error => {
            if (error.code === 10009) {
                this.$navigate('login/login/LoginPage');
            }
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
        fontSize: 16,
        color: DesignRule.textColor_mainTitle,
        marginTop: 6
    },
    text2Style: {
        color: DesignRule.textColor_instruction,
        fontSize: 12
    }
});
