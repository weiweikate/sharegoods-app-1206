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
export default class HelperCenterQuestionDetail extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            noHelpNum: 0,
            useHelpNum: 0,
            type: null
        };
    }

    $navigationBarOptions = {
        title: '问题详情',
        show: true // false则隐藏导航
    };

    componentDidMount() {
        MineApi.findHelpQuestionById({id: this.params.id}).then(res => {
            let data = res.data || {};
            this.setState({
                title: data.title,
                content: data.content,
                type: data.type
            });
        }).catch(err => {
            console.log(err);
        });
        this.loadPageData();
    }

    _render() {
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
                           <UIText value={this.state.title}
                                   style={{
                                       marginLeft:8,
                                       fontSize: DesignRule.fontSize_threeTitle_28,
                                       color: DesignRule.textColor_mainTitle,
                                       fontWeight: '600'
                                   }}/>
                       </View>
                       {this.state.content ?
                           <HTML html={this.state.content} imagesMaxWidth={ScreenUtils.width}
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
                           <NoMoreClick activeOpacity={0.6} onPress={() => this.feedbackNoUse()} style={{
                               width: 120,
                               height: 32,
                               borderRadius: 16,
                               borderWidth: 1,
                               borderColor: this.state.type === null || this.state.type === 1 ? DesignRule.mainColor : 'white',
                               backgroundColor: this.state.type === null || this.state.type === 1 ? 'white' : DesignRule.mainColor,
                               alignItems: 'center',
                               justifyContent: 'center'
                           }}>
                               <Text style={{
                                   fontSize: 13,
                                   color: this.state.type === null || this.state.type === 1 ? DesignRule.mainColor : 'white'
                               }}
                                     allowFontScaling={false}>{`没啥帮助?  (${this.state.noHelpNum > 9999 ? '9999+' : this.state.noHelpNum})`}</Text>
                           </NoMoreClick>
                           <NoMoreClick activeOpacity={0.6} onPress={() => this.feedbackGoodUse()} style={{
                               width: 120,
                               height: 32,
                               borderRadius: 16,
                               backgroundColor: this.state.type === null || this.state.type === 0 ? 'white' : DesignRule.mainColor,
                               borderColor: this.state.type === null || this.state.type === 0 ? DesignRule.mainColor : 'white',
                               borderWidth: 1,
                               alignItems: 'center',
                               justifyContent: 'center'
                           }}>
                               <Text style={{
                                   fontSize: 13,
                                   color: this.state.type === null || this.state.type === 0 ? DesignRule.mainColor : 'white'
                               }}
                                     allowFontScaling={false}>{`有用  (${this.state.useHelpNum > 9999 ? '9999+' : this.state.useHelpNum})`}</Text>
                           </NoMoreClick>
                       </View>
                   </View>
                </ScrollView>
                {/*联系客服按钮*/}
                <CustomerServiceButton/>
            </View>
        );
    }

    loadPageData() {
        MineApi.findQuestionEffectById({id: this.params.id}).then(res => {
            console.log(res);
            this.setState({
                useHelpNum: res.data.isHelp,
                noHelpNum: res.data.notHelp,
                type: res.data.type
            });
        }).catch(err => {
            console.log(err);
        });
    }

    feedbackNoUse() {
        MineApi.updateHelpQuestionToClick({id: this.params.id, hadHelp: 0}).then(res => {
            this.$toastShow('' + res.data);
            this.loadPageData();
        }).catch(err => {
            if (err.code === 10009) {
                routeNavigate(RouterMap.LoginPage);
            }
        });
    }

    feedbackGoodUse() {
        MineApi.updateHelpQuestionToClick({id: this.params.id, hadHelp: 1}).then(res => {
            this.$toastShow('' + res.data);
            this.loadPageData();
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
    }
});
