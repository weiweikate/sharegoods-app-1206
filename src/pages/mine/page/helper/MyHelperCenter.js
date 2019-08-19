/**
 * @author chenxiang
 * @date on 2018/9/7
 * @describe 首页
 * @org www.sharegoodsmall.com
 * @email chenxiang@meeruu.com
 */
import React from 'react';
import {Image, Linking, ScrollView, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import ScreenUtils from '../../../../utils/ScreenUtils';
import {track, trackEvent} from '../../../../utils/SensorsTrack';
import MineApi from '../../api/MineApi';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import {MRText as Text, NoMoreClick} from '../../../../components/ui';
import LinearGradient from 'react-native-linear-gradient';
import user from '../../../../model/user';
import {observer} from 'mobx-react';
import OssHelper from '../../../../utils/OssHelper';
import {beginChatType, QYChatTool} from '../../../../utils/QYModule/QYChatTool';
import StringUtils from '../../../../utils/StringUtils';
import {SmoothPushPreLoadHighComponentFirstDelay} from '../../../../comm/components/SmoothPushHighComponent';
import RouterMap from '../../../../navigation/RouterMap';

const {
    // top_kefu,
    icon_tuikuan_2,
    icon_feedback_2,
    icon_auto_feedback_2
} = res.helperAndCustomerService;
const icon_kefu = res.button.icon_kefu;

const { px2dp } = ScreenUtils;
@SmoothPushPreLoadHighComponentFirstDelay
@observer
export default class MyHelperPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            typeList: [],
            visible: false
        };
    }

    $navigationBarOptions = {
        title: '帮助中心',
        show: true // false则隐藏导航
    };
    // 常见问题列表
    renderHotQuestionList = () => {
        const typeList = this.state.typeList
        return (
            <View style={{
                width: ScreenUtils.width,
                paddingLeft:px2dp(15),
                paddingRight:px2dp(15)
            }}>
               <View style={{
                   backgroundColor:'white',
                   marginTop: px2dp(25),
                   borderRadius: px2dp(5)
               }}>
                   {
                       typeList.length?
                           <View style={styles.title}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <View style={{ width: 2, height: 8, backgroundColor: '#FF0050', borderRadius: 1 }}/>
                                  <UIText value={'常见问题'}
                                          style={{
                                              marginLeft: 10,
                                              fontSize: DesignRule.fontSize_threeTitle_28,
                                              color: DesignRule.textColor_mainTitle,
                                              fontWeight: '600'
                                          }}/>
                              </View>
                               <TouchableWithoutFeedback onPress={this.jumpToAll}>
                                   <View style={{ flexDirection: 'row',alignItems: 'center' }}>
                                       <UIText value={'查看全部'}
                                               style={{
                                                   fontSize: DesignRule.fontSize_24,
                                                   color: DesignRule.textColor_instruction,
                                               }}/>
                                       <Image source={res.button.arrow_right} style={{ width:4,height:8,marginLeft:6 }}/>
                                   </View>
                               </TouchableWithoutFeedback>
                           </View>
                           : null
                   }
                   {this.state.typeList.map((item, index) => {
                       return (
                           <View key={index} style={styles.hotQuestionStyle}>
                               {
                                   index !=0?
                                       <View style={{
                                           borderBottomWidth: 0.5,
                                           borderColor: '#dedede',}}
                                       >
                                       </View>
                                       :null
                               }
                                <View style={styles.hotQuestionItemStyle}>
                                    <UIText value={item.name}
                                            numberOfLines={1}
                                            style={{
                                                fontSize: DesignRule.fontSize_threeTitle,
                                                color: DesignRule.textColor_secondTitle,
                                            }}/>
                                    <Image source={res.button.arrow_right} style={{ width:4,height:8,marginLeft:6 }}/>
                                </View>
                           </View>
                       );
                   })}
               </View>

            </View>
        );
    };
    renderBodyView = () => {
        let helperIcon = OssHelper('/app/bangzu_kefu.png');
        console.log('renderBodyView', helperIcon);
        return (
            <View style={{flex: 1}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{backgroundColor: DesignRule.bgColor}}>
                        <View style={{
                            flex:1,
                            width: ScreenUtils.width,
                            height:px2dp(157)
                        }}>
                            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                            colors={['#FC5D39', '#FF0050']}
                                            style={{
                                                padding:20,
                                                flex: 1
                                            }}
                            >
                                <UIText value={'你好,\n我们为你提供更多帮助...'}
                                        numberOfLines={2}
                                        style={{
                                            fontSize: 18,
                                            color: '#fff',
                                        }}/>
                            </LinearGradient>
                            <View style={{
                                width: ScreenUtils.width,
                                justifyContent: 'space-between',
                                paddingHorizontal: 15,
                                zIndex: 21,
                                position:'absolute',
                                left:0,
                                top:px2dp(87)
                            }}>
                                <View style={{
                                    alignItems: 'center',
                                    height: 87,
                                    flexDirection: 'row',
                                    backgroundColor: 'white',
                                    borderRadius:5,
                                }}>
                                    <NoMoreClick activeOpacity={0.6} onPress={() => this.questionfeedBack(3)}
                                                 style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                        <Image source={icon_auto_feedback_2} style={{width: 37, height: 37}}/>
                                        <Text style={styles.textFontstyle} allowFontScaling={false}>查看订单</Text>
                                    </NoMoreClick>
                                    <NoMoreClick activeOpacity={0.6} onPress={() => this.questionfeedBack(2)}
                                                 style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                        <Image source={icon_feedback_2} style={{width: 37, height: 37}}/>
                                        <Text style={styles.textFontstyle} allowFontScaling={false}>问题反馈</Text>
                                    </NoMoreClick>
                                    <NoMoreClick activeOpacity={0.6} onPress={() => this.questionfeedBack(1)}
                                                 style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                        <Image source={icon_tuikuan_2} style={{width: 37, height: 37}}/>
                                        <Text style={styles.textFontstyle} allowFontScaling={false}>售后进度</Text>
                                    </NoMoreClick>
                                </View>
                            </View>
                        </View>
                    </View>
                    {this.renderHotQuestionList()}
                </ScrollView>
                <View style={{height: 20, backgroundColor: DesignRule.bgColor}}/>
                {/*联系客服按钮*/}
                <View style={{alignItems: 'center'}}>
                    <View style={{
                        width: ScreenUtils.width,
                        justifyContent: 'space-between',
                        paddingHorizontal: 15,
                        zIndex: 21
                    }}>

                        <NoMoreClick style={{
                            height: ScreenUtils.autoSizeWidth(40),
                            borderRadius: ScreenUtils.autoSizeWidth(20),
                            overflow: 'hidden'
                        }}
                                     onPress={() => this.jumpQYIMPage()}>
                            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                            colors={['#FC5D39', '#FF0050']}
                                            style={{
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                flex: 1
                                            }}
                            >
                                <Image source={icon_kefu} style={{height: 23, width: 23}} resizeMode={'contain'}/>

                                <Text style={{
                                    fontFamily: 'PingFangSC-Regular',
                                    fontSize: 13,
                                    color: 'white',
                                    marginLeft: 4
                                }} allowFontScaling={false}>在线客服</Text>
                            </LinearGradient>
                        </NoMoreClick>
                    </View>
                    <Text style={{
                        fontSize: 10,
                        color: DesignRule.textColor_secondTitle,
                        marginVertical: 5
                    }}>服务时间：9:00-22:00</Text>
                </View>
            </View>
        );
    };
    jumpQYIMPage = () => {
        track(trackEvent.ClickOnlineCustomerService
            , {customerServiceModuleSource: 1});

        let params = {
            urlString: '',
            title: '平台客服',
            shopId: '',
            chatType: beginChatType.BEGIN_FROM_OTHER,
            data: {}
        };
        QYChatTool.beginQYChat(params);
    };

    jump2Telephone() {
        track(trackEvent.ClickPhoneCustomerService
            , {customerServiceModuleSource: 1});
        Linking.openURL('tel:' + '400-9696-365').catch(e => console.log(e));
        this.setState({visible: false});
    }

    showAlert() {
        this.setState({visible: true});
    }

    orderListq(list) {
        if (StringUtils.isNoEmpty(list)) {
            this.$navigate(RouterMap.HelperQuestionListPage, {list});
        }
    }
    jumpToAll(){
       console.log(11111)
    }
    questionfeedBack(type) {
        if (!user.isLogin) {
            this.gotoLoginPage();
            return;
        }
        if (type === 1) {
            this.$navigate(RouterMap.AfterSaleListPage);
        } else if (type === 2) {
            this.$navigate(RouterMap.HelperFeedbackPage);
        } else if (type === 3) {
            this.$navigate(RouterMap.MyOrdersListPage, {index: 0});
        }

    }

    gotoquestionDetail(id) {
        console.log(id);
        this.$navigate(RouterMap.HelperQuestionDetail, {id: id});
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
            console.log('componentDidMount', list);
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
        paddingLeft:15,
        paddingRight:15,
        flex:1
    },
    hotQuestionItemStyle:{
        paddingLeft:5,
        paddingRight:5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection:'row',
        height:40,
    },
    hot2ViewStyle: {
        display: 'flex',
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
    },
    title:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
        flex:1,
        flexDirection:'row',
        paddingRight:10,
    }
});

