/**
 * Created by chenweiwei on 2019/8/20.
 */
import React from 'react';
import {Image,ScrollView, StyleSheet, View} from 'react-native';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import HTML from 'react-native-render-html';
import MineApi from '../../api/MineApi';
import DesignRule from '../../../../constants/DesignRule';
import {MRText as Text, NoMoreClick} from '../../../../components/ui';
import RouterMap, {routeNavigate} from '../../../../navigation/RouterMap';
import UIText from '../../../../components/ui/UIText';
import res from '../../res';
import CustomerServiceButton from '../../components/CustomerServiceButton';
import LinearGradient from 'react-native-linear-gradient';
const {px2dp} = ScreenUtils;
export default class HelperCenterQuestionDetail extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            useless:0,
            useful:0,
            hasFeedBackNoHelp:false,
            hasFeedBackUseHelp:false,
            content:'',
            title:'',
        };
    }

    $navigationBarOptions = {
        title: '问题详情',
        show: true // false则隐藏导航
    };

    componentDidMount() {
        this.getDetail()
    }

    renderRightButton = () =>{
        const {
            // useful,
            hasFeedBackUseHelp
        } = this.state
        return (
            <Text style={[
                    styles.buttonText,
                    { color: hasFeedBackUseHelp? 'white': DesignRule.mainColor}
                  ]}
                  allowFontScaling={false}>
                有用
                {/*{`有用(${useful})`}*/}
            </Text>
        )
    }
    _render() {

        const {
            hasFeedBackNoHelp,
            hasFeedBackUseHelp,
            // useless,
            title,
            content
        } = this.state
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}
                            style={{
                                backgroundColor:"transparent",
                                borderRadius:px2dp(5),
                                overflow:'hidden'
                            }}
                >
                    <View style={{
                            paddingTop:10,
                            borderRadius:px2dp(5),
                            backgroundColor:"#fff",
                            paddingHorizontal:px2dp(12),
                          }}
                    >
                        <View style={styles.title}>
                            <Image source={res.helperAndCustomerService.icon_question_label}
                                   style={{width:16, height:16}}
                            />
                            <UIText value={title}
                                    style={{
                                        marginLeft:8,
                                        fontSize: DesignRule.fontSize_threeTitle_28,
                                        color: DesignRule.textColor_mainTitle,
                                        fontWeight: '600'
                                    }}/>
                        </View>
                        {content ?
                            <View>
                                <HTML html={content} imagesMaxWidth={ScreenUtils.width-px2dp(54)}
                                      baseFontStyle={{
                                          lineHeight: 20,
                                          fontSize:13,
                                          color:'#666666',
                                      }}
                                      containerStyle={{
                                          backgroundColor: 'transparent',
                                      }}/>
                            </View>
                            : null
                        }
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            marginTop:20,
                            paddingBottom:20,
                        }}>
                            <NoMoreClick activeOpacity={0.6}
                                         onPress={() => this.feedbackClick(1)}
                                         style={[
                                             styles.btn,
                                             {marginRight:25},
                                             hasFeedBackNoHelp? styles.btnLeftActive:styles.btnLeft
                                         ]}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    {color: !hasFeedBackNoHelp? '#999999' : 'white'}
                                ]}
                                      allowFontScaling={false}
                                >
                                    没有帮助
                                    {/*{`没有帮助(${useless})`}*/}
                                </Text>
                            </NoMoreClick>
                            <NoMoreClick activeOpacity={0.6}
                                         onPress={() => this.feedbackClick(2)}
                                         style={[
                                             styles.btn,
                                             hasFeedBackUseHelp? styles.rightActiveButton:styles.btnRight
                                         ]}
                            >
                                {
                                    hasFeedBackUseHelp?
                                        <LinearGradient  start={{x: 0, y: 0}}
                                                         end={{x: 1, y: 0}}
                                                         colors={['#FC5D39', '#FF0050']}
                                                         style={{
                                                             alignItems: 'center',
                                                             flexDirection: 'row',
                                                             justifyContent: 'center',
                                                             flex: 1,
                                                             width:120,
                                                             borderRadius: 16,
                                                         }}
                                        >
                                            {this.renderRightButton()}
                                        </LinearGradient>:
                                        <View>
                                            {this.renderRightButton()}
                                        </View>
                                }
                            </NoMoreClick>
                        </View>
                    </View>
                    {/*联系客服按钮*/}
                    <View style={{
                        backgroundColor: DesignRule.bgColor,
                        paddingTop:30,
                        paddingBottom:30,
                        justifyContent:'center',
                        alignItems:'center'
                    }}>
                        <CustomerServiceButton />
                    </View>
                </ScrollView>
            </View>
        );
    }

    // 获取反馈的详情
    getDetail = () =>{
        const {
            vote,
            title,
            content,
            voteResult,
            useful=0,
            useless=0
        } = (this.params.detail || {})
        this.setState({
            useless,
            useful,
            hasFeedBackNoHelp:vote && ( voteResult==0 ),
            hasFeedBackUseHelp:vote && ( voteResult==1 ),
            content,
            title,
        })
    }

    feedbackClick = (type=2)=>{
        // hadHelp 0为没有用 1为有用
        MineApi.addHelpCenterResponse({
            helpDetailId: this.params.detail.id,
            type: type==1? 0:1
        }).then(res => {
            this.$toastShow('感谢您的反馈');
            this.params.refreshList()
            const key = {
                1:'hasFeedBackNoHelp',
                2:'hasFeedBackUseHelp'
            }[type]
            let datas = res.data || {}
            this.setState({
                [key]:true,
                useless:datas.useless,
                useful:datas.useful
            })
        }).catch(err => {
            if (err.code === 10009) {
                routeNavigate(RouterMap.LoginPage);
            } else {
                this.params.refreshList()
                this.$toastShow('' + err.msg);
            }
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor,
        marginBottom: ScreenUtils.safeBottom,
        paddingTop:10,
        paddingHorizontal:px2dp(15),
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        flexDirection:'row'
    },
    btn: {
        width: 120,
        height: 32,
        borderRadius: 16,
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnLeft: {
        borderColor:"#979797",
        backgroundColor:'#fff'
    },
    btnLeftActive:{
        borderColor:"#ccc",
        backgroundColor:'#ccc'
    },
    btnRight: {
        borderColor:DesignRule.mainColor,
    },
    rightActiveButton : {
        borderColor:'transparent'
    },
    buttonText:{
        fontSize: 13,
    }
});
