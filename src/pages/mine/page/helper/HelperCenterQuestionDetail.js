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

export default class HelperCenterQuestionDetail extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            noHelpNum: 0,
            useHelpNum: 0,
            hasFeedBackNoHelp:false,
            hasFeedBackUseHelp:false,
        };
    }

    $navigationBarOptions = {
        title: '问题详情',
        show: true // false则隐藏导航
    };

    componentDidMount() {
        this.getDetail()
        this.getFeedBackNum();
    }

    renderRightButton = () =>{
        const {
            useHelpNum,
            hasFeedBackUseHelp
        } = this.state
        return (
            <Text style={[
                    styles.buttonText,
                    { color: hasFeedBackUseHelp? 'white': DesignRule.mainColor}
                  ]}
                  allowFontScaling={false}>{`有用(${useHelpNum})`}
            </Text>
        )
    }
    _render() {

        const {
            content,
            hasFeedBackNoHelp,
            hasFeedBackUseHelp,
            noHelpNum,
            title
        } = this.state

        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}
                            style={{
                                paddingTop:10,
                                paddingBottom:10,
                                paddingHorizontal:15,
                            }}
                >
                   <View style={{
                            backgroundColor:"#fff",
                            borderRadius:5,
                            paddingHorizontal:12,
                            paddingTop:10,
                            paddingBottom:15,
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
                           <HTML html={content} imagesMaxWidth={ScreenUtils.width}
                                 baseFontStyle={{
                                     lineHeight: 20,
                                     fontSize:13,
                                     color:'#666666',
                                 }}
                                 containerStyle={{
                                     backgroundColor: '#fff',
                                 }}/>
                           : null
                       }
                       <View style={{
                           alignItems: 'center',
                           justifyContent: 'space-between',
                           flexDirection: 'row',
                           paddingHorizontal: 40,
                           marginTop:20
                       }}>
                           <NoMoreClick activeOpacity={0.6}
                                        onPress={() => this.feedbackClick(1)}
                                        style={[
                                            styles.btn,
                                            hasFeedBackNoHelp? styles.btnLeftActive:styles.btnLeft
                                        ]}
                           >
                               <Text style={[
                                        styles.buttonText,
                                        {color: !hasFeedBackNoHelp? '#999999' : 'white'}
                                       ]}
                                    allowFontScaling={false}
                               >
                                   {`没有帮助(${noHelpNum})`}
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
                </ScrollView>
                {/*联系客服按钮*/}
                <CustomerServiceButton/>
            </View>
        );
    }

    // 获取反馈的详情
    getDetail(){
        MineApi.findHelpQuestionById({
            id: this.params.id
        }).then(res => {
            let data = res.data || {};
            this.setState({
                title: data.title,
                content: data.content,
            });
        }).catch(err => {
            console.log(err);
        })
    }

    // 获取反馈的数量
    getFeedBackNum(){
        MineApi.findQuestionEffectById({
            id: this.params.id
        }).then(res => {
            const {
                isHelp=0,
                notHelp=0,
                type
            } = (res.data || {})
            this.setState({
                useHelpNum: isHelp>9999 ? '9999+':isHelp,
                noHelpNum: notHelp>9999 ? '9999+':notHelp,
                hasFeedBackNoHelp: type === 0? true:false,
                hasFeedBackUseHelp:type === 1? true:false,
            });
        }).catch(err => {
            console.log(err);
        });
    }

    feedbackClick(type=2){
        const reqUrl = {
            1:'updateHelpQuestionToClick',
            2:'updateHelpQuestionToClick'
        }[type]
        // hadHelp 0为没有用 1为有用
        MineApi[reqUrl]({
            id: this.params.id,
            hadHelp: type==1? 0:1
        }).then(res => {
            this.$toastShow('' + res.data);
            this.getFeedBackNum();
        }).catch(err => {
            if (err.code === 10009) {
                routeNavigate(RouterMap.LoginPage);
            }
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor,
        marginBottom: ScreenUtils.safeBottom
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
