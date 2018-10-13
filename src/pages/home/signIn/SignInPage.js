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
const days = [1,2,3,4,5,6,7];
const dates = ['09.18','09.19','09.20','09.21','09.22','09.23','09.24'];
import signInImageBg from './res/qiandao_img_bg_nor.png';
import showBeanIcon from './res/showbean_icon.png';
import couponBackground from './res/qiandao_bg_youhuiquan_nor.png';
const reminder = '注：100秀豆兑换1张券，无兑换限制，点击即可兑换';
//import HomeAPI from '../api/HomeAPI';

export default class SignInPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            signInCount:0,
            todaySignIn:true
        }
    }
    $navigationBarOptions = {
        title: '签到',
        show: true// false则隐藏导航
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

    showMore = ()=>{
        alert("跳转到规则页");
    }

    //**********************************ViewPart******************************************
    _signInButtonRender(){
        return (
            <View style={styles.signInButtonWrapper}>
                <Image style={styles.showBeanIconStyle} resizeMode={'stretch'} source={showBeanIcon}/>
                <Text style={styles.showBeanTextStyle}>
                    200
                </Text>
            </View>
        );
    }

    _smallLineRenderWithColor(color){
        return(<View style={{backgroundColor:color,height:px2dp(2),width:px2dp(15)}}/>);
    }

    _signInInfoRender(){
        let circlesView = days.map((item,index)=>{
            if(item < this.state.signInCount){
                if(item === 1){
                    return <SignInCircleView key={'circle'+index}  count={item} kind={'signedIn'}/>
                }else {
                    return (
                        <View key={'circle'+index}  style={styles.signInItemWrapper}>
                            <View style={{backgroundColor:'white',height:px2dp(2), flex: 1}}/>
                            <SignInCircleView count={item} kind={'signedIn'}/>
                        </View>
                    );
                }
            }

            if(item === this.state.signInCount){
                if(this.state.todaySignIn){
                    return (
                        <View key={'circle'+index} style={styles.signInItemWrapper}>
                            <View style={{backgroundColor:'white',height:px2dp(2), flex: 1}}/>
                            <SignInCircleView count={item} kind={'signingIn'}/>
                        </View>
                    );
                }else {
                    return (
                        <View key={'circle'+index}  style={styles.signInItemWrapper}>
                            <View style={{backgroundColor:'white',height:px2dp(2), flex: 1}}/>
                            <SignInCircleView count={item} kind={'signedIn'}/>
                        </View>
                    );
                }

            }

            if(item > this.state.signInCount){
                if(item === 1){
                    return <SignInCircleView key={'circle'+index}  count={item} kind={'noSignIn'}/>
                }else {
                    return (
                        <View key={'circle'+index}  style={styles.signInItemWrapper}>
                            <View style={{backgroundColor:'#c6b478',height:px2dp(2),flex:1}}/>
                            <SignInCircleView count={item} kind={'noSignIn'}/>
                        </View>
                    );
                }
            }
        });

        let datesView = dates.map((item,index)=>{
            return(
                <Text key={'date'+index} style={styles.dateTextStyle}>
                    {item}
                </Text>
            );
        })

        return (
            <View style={styles.signInInfoWrapper}>
                <View style={styles.circleWrapper}>
                    {this._smallLineRenderWithColor(this.state.signInCount === 0 ?'#c6b478' : 'white')}
                    {circlesView}
                    {this._smallLineRenderWithColor(this.state.signInCount === 7 ?'white' : '#c6b478')}
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
        return(
            <View style={styles.container}>
                <ImageBackground
                    source={signInImageBg}
                    style={styles.headerImageStyle}
                    resizeMode={'stretch'}>
                    {this._signInButtonRender()}
                    <Text style={styles.signInCountTextStyle}>
                        {`累计签到${this.state.signInCount}天`}
                    </Text>
                </ImageBackground>
                {this._signInInfoRender()}
                {this._couponRender()}
                <Text style={styles.reminderStyle}>
                    {reminder}
                </Text>
                <View style={{flex:1}}/>
                <TouchableWithoutFeedback onPress={()=>{alert('bb')}}>
                    <View>
                        <Text style={styles.couponsTextStyle}>
                            已有3张现金券>
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
