/**
 * @author xzm
 * @date 2018/10/12
 */
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import SignInCircleView from './components/SignInCircleView';
const { px2dp } = ScreenUtils;
import signInImageBg from './res/qiandao_img_bg_nor.png';
import showBeanIcon from './res/showbean_icon.png';
import couponBackground from './res/qiandao_bg_youhuiquan_nor.png';
const reminder = '注：100秀豆兑换1张券，无兑换限制，点击即可兑换';
import HomeAPI from '../api/HomeAPI';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import user from '../../../model/user'
import { observer } from 'mobx-react/native';

@observer
export default class SignInPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            signInData:null
        }
    }
    $navigationBarOptions = {
        title: '签到',
        show: true// false则隐藏导航
    };

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this.loadPageData
            }
        };
    };

    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity onPress={this.showMore}>
                <Text style={styles.rightItemStyle}>
                    签到规则
                </Text>
            </TouchableOpacity>
        );
    };

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
        this.getSignData();
    }

    getSignData = () => {
        HomeAPI.querySignList().then((data) => {
            this.setState({
                signInData:  data.data,
                loading: false,
                refreshing: false,
                netFailedInfo: null,
                loadingState: PageLoadingState.success,
            });
        }).catch((error) => {
            this.setState({
                loading: false,
                refreshing: false,
                netFailedInfo: error,
                loadingState: PageLoadingState.fail
            });
        });
    }

    showMore = ()=>{
        alert("跳转到规则页");
    }

    //**********************************ViewPart******************************************
    _signInButtonRender(){
        return (
            <View style={styles.signInButtonWrapper}>
                <Image style={styles.showBeanIconStyle} resizeMode={'stretch'} source={showBeanIcon}/>
                <Text style={styles.showBeanTextStyle}>
                    {user.userScore ? user.userScore : 0}
                </Text>
            </View>
        );
    }

    _smallLineRenderWithColor(color){
        return(<View style={{backgroundColor:color,height:px2dp(2),width:px2dp(15)}}/>);
    }

    _signInInfoRender(){
        let circlesView = this.state.signInData.map((item,index)=>{
            let kind;
            if(index <3){
                if(item.continuous > 0){
                    kind = 'signedIn';
                }else {
                    kind = 'noSignIn';
                }
            }else if(index === 3){
                if(item.continuous > 0){
                    kind = 'signingIn';
                }else {
                    kind = 'willSignIn';
                }
            }else if(index > 3){
                kind = 'willSignIn';
            }
            if(index === 0){
                return <SignInCircleView key={'circle'+index}  count={item.reward >= 0 ? item.reward : item.canReward} kind={kind}/>
            }else {
                return (
                    <View key={'circle'+index}  style={styles.signInItemWrapper}>
                        <View style={{backgroundColor:index<4 ?'white' : '#c6b478',height:px2dp(2), flex: 1}}/>
                        <SignInCircleView count={item.reward || item.reward >= 0 ? item.reward : item.canReward} kind={kind}/>
                    </View>
                );
            }
        });

        let datesView = this.state.signInData.map((item,index)=>{
            return(
                <Text key={'date'+index} style={styles.dateTextStyle}>
                    {item.signDate.replace('-','.')}
                </Text>
            );
        })

        return (
            <View style={styles.signInInfoWrapper}>
                <View style={styles.circleWrapper}>
                    {this._smallLineRenderWithColor('white')}
                    {circlesView}
                    {this._smallLineRenderWithColor('#c6b478')}
                </View>
                <View style={styles.dateWrapper}>
                    {datesView}
                </View>
            </View>
        );
    }

    _couponRender(){
        return(
            <ImageBackground source={couponBackground} style={styles.couponBgStyle}>
                <Text style={{color:'#D51243',fontSize:px2dp(36),marginLeft:px2dp(30)}}>
                    1<Text style={{color:'#D51243',fontSize:px2dp(14)}}>元</Text>
                </Text>
                <View style={styles.couponTextWrapper}>
                    <Text style={styles.couponNameTextStyle}>
                        现金抵扣卷
                    </Text>
                    <Text style={styles.couponTagTextStyle}>
                        全程通用/无时间限制
                    </Text>
                </View>
                <View style={{ flex: 1}}/>
                <View style={styles.convertWrapper}>
                    <Text style={{color:'#222222',fontSize:px2dp(12),includeFontPadding:false}}>
                        消耗秀豆
                    </Text>
                    <Text style={{color:'#D51243',fontSize:px2dp(12),includeFontPadding:false}}>
                        -- 100 --
                    </Text>
                    <TouchableWithoutFeedback onPress={()=>{alert('aa')}}>
                        <View style={styles.convertButtonStyle}>
                            <Text style={styles.convertTextStyle}>
                                立即兑换
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </ImageBackground>
        )
    }

    _render(){
        let count;
        if(this.state.signInData[3].continuous){
            count = this.state.signInData[3].continuous;
        }else {
            count = this.state.signInData[2].continuous ? this.state.signInData[2].continuous : 0;
        }
        return(
            <View style={styles.container}>
                <ImageBackground
                    source={signInImageBg}
                    style={styles.headerImageStyle}
                    resizeMode={'stretch'}>
                    {this._signInButtonRender()}
                    <Text style={styles.signInCountTextStyle}>
                        {`累计签到${count}天`}
                    </Text>
                </ImageBackground>
                {this.state.signInData ? this._signInInfoRender() : null}
                {this._couponRender()}
                <Text style={styles.reminderStyle}>
                    {reminder}
                </Text>
                <View style={{flex:1}}/>
                <TouchableWithoutFeedback onPress={()=>{alert('bb')}}>
                    <View>
                        <Text style={styles.couponsTextStyle}>
                            已有{user.tokenCoin ? user.tokenCoin : 0}张现金券>
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rightItemStyle: {
        color: '#222222',
        fontSize: px2dp(12),
    },
    headerImageStyle: {
        width: ScreenUtils.width,
        height: px2dp(178),
    },
    signInButtonWrapper:{
        backgroundColor:'#b61944',
        width:px2dp(82),
        height:px2dp(82),
        borderRadius:px2dp(41),
        borderColor:'#e8cbd3',
        borderWidth:px2dp(4),
        alignSelf:'center',
        marginTop:px2dp(20),
        justifyContent:'center',
        alignItems:'center'
    },
    signInCountTextStyle:{
        color:'#666666',
        fontSize:px2dp(12),
        alignSelf:'center',
        marginTop:px2dp(10)
    },
    signInInfoWrapper:{
        width:ScreenUtils.width - px2dp(30),
        height:px2dp(110),
        borderRadius:px2dp(5),
        backgroundColor:'#d4c59e',
        justifyContent:'space-between',
        paddingVertical:px2dp(25),
        marginTop:px2dp(-30),
        marginLeft:px2dp(15)
    },
    circleWrapper:{
        flexDirection:'row',
        alignItems:'center',
    },
    signInItemWrapper:{
        flexDirection:'row',
        alignItems:'center',
        flex:1
    },
    dateWrapper:{
        flexDirection:'row',
        paddingHorizontal:px2dp(15),
        justifyContent:'space-between'
    },
    dateTextStyle:{
        color:'white',
        fontSize:px2dp(11)
    },
    showBeanIconStyle:{
        width:px2dp(30),
        height:px2dp(30)
    },
    showBeanTextStyle:{
        color:'white',
        fontSize:px2dp(22)
    },
    couponBgStyle:{
        height:px2dp(94),
        width:ScreenUtils.width-px2dp(30),
        marginLeft:px2dp(15),
        alignItems:'center',
        marginTop:px2dp(15),
        flexDirection:'row'
    },
    couponNameTextStyle:{
        color:'#222222',
        fontSize:px2dp(14)
    },
    couponTagTextStyle:{
        color:'#666666',
        fontSize:px2dp(12)
    },
    couponTextWrapper:{
        paddingVertical:px2dp(26),
        justifyContent:'space-between',
        marginLeft:px2dp(30)
    },
    convertWrapper:{
        alignItems:'center',
        marginRight:px2dp(10),
        height:px2dp(94)-px2dp(30),
        justifyContent:'space-between',
    },
    convertButtonStyle:{
        height:px2dp(20),
        width:px2dp(68),
        borderRadius:px2dp(10),
        backgroundColor:'#b61944',
        justifyContent:'center',
        alignItems:'center'
    },
    convertTextStyle:{
        color:'white',
        fontSize:px2dp(12)
    },
    reminderStyle:{
        color:'#999999',
        fontSize:px2dp(11),
        marginTop:px2dp(10),
        marginLeft:px2dp(15)
    },
    couponsTextStyle:{
        color:'#999999',
        fontSize:px2dp(11),
        alignSelf:'center',
        marginBottom:px2dp(15),
        includeFontPadding:false
    }

});
