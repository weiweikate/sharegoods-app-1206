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
    ImageBackground
} from 'react-native';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils'
const { px2dp } = ScreenUtils
import signInImageBg from './res/qiandao_img_bg_nor.png';

//import HomeAPI from '../api/HomeAPI';

export default class SignInPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            signInCount:0
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

            </View>
        );
    }

    _signInInfoRender(){
        return (
            <View>

            </View>
        );
    }

    _smallLineRenderWithColor(color){
        return(<View style={{color:color,height:px2dp(2),width:px2dp(15)}}/>)
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
        marginTop:px2dp(20)
    },
    signInCountTextStyle:{
        color:'#666666',
        fontSize:px2dp(12),
        alignSelf:'center',
        marginTop:px2dp(10)
    },
    signInInfoWrapper:{
        width:ScreenUtils.width - px2dp(30),
        height:px2dp(101),
        borderRadius:px2dp(5),
        backgroundColor:'#d4c59e',
        justifyContent:'space-around'
    }
});
