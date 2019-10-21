/**
 * @author xzm
 * @date 2019/10/21
 */

import React, {PureComponent} from 'react';
import {
    View,
    Image,
    TouchableWithoutFeedback,
    StyleSheet,
    Animated,
    Easing,
    ImageBackground
} from 'react-native';
import _ from 'lodash';
import ScreenUtils from '../../../utils/ScreenUtils';
import LottieView from 'lottie-react-native';
import res from '../res';
import eggJson from '../res/egg.json';
import MarketingApi from '../api/MarketingApi';
import DesignRule from '../../../constants/DesignRule';
import {MRText} from '../../../components/ui';
import LinearGradient from 'react-native-linear-gradient';
import {marketingUtils} from '../MarketingUtils';

const {px2dp} = ScreenUtils;
const {title, bedplate, egg, firework, hammer, award_bg,award_no} = res;

const status = {
    wait: 1,
    breaking: 2,
    success: 3,
    fail: 4
}

export default class SmashEggView extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            transformView: new Animated.Value(0),
            eggState: status.wait,
            awardName: '',
            url: null
        }
        this.rotateAnimated = Animated.timing(
            this.state.transformView,
            {
                toValue: 1,
                duration: 1500,
                easing: Easing.in,
            }
        );

        this.handleBreakEgg = _.throttle(this._breakEgg, 1000, {trailing: false})
    }

    componentDidMount() {
        this._startAnimated();
    }

    _startAnimated = () => {
        this.state.transformView.setValue(0);
        this.rotateAnimated.start(() => this._startAnimated());
    }

    _breakEgg = () => {
        if (this.state.eggState !== status.wait) {
            return;
        }
        this.setState({
            eggState: status.breaking
        });
        MarketingApi.getLotteryResultV2({
            activityNo: 'LTAT1910090001'
        }).then((data) => {
            this.setState({
                eggState: status.success,
                productImage: data.data.imgUrl,
                awardName: data.data.name
            })
        }).catch((err) => {
            this.setState({
                eggState: status.fail
            })
        })
    }

    //砸金蛋view
    _waitOrBreakingRender = () => {

        const rotate = this.state.transformView.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['0deg', '30deg', '0deg']
        });

        return (
            <TouchableWithoutFeedback onPress={() => {
                this.handleBreakEgg()
            }}>
                <View style={styles.content}>
                    <Image style={styles.title} source={title}/>
                    <Image style={styles.firework} source={firework}/>
                    <ImageBackground style={styles.egg} source={egg}>
                        {this.state.eggState == status.breaking ?
                            <LottieView source={eggJson} style={styles.lottie} loop={false} speed={0.8}
                                        autoPlay={true}/> : null}
                    </ImageBackground>
                    <Image style={styles.bedplate} source={bedplate}/>
                    <Animated.Image
                        style={[styles.hammer, {
                            transform: [
                                {
                                    rotateZ: rotate
                                },
                                {translateX: px2dp(-81 / 2)},
                                {translateY: px2dp(-87 / 2)}
                            ]
                        }]} source={hammer}/>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    //获取奖品view
    _successRender = () => {
        const uri = this.state.productImage;
        return (
            <View>
                <ImageBackground style={styles.awardContentBg} source={award_bg}>
                    <MRText style={styles.tip}>
                        稍后将发放至您的账户
                    </MRText>
                    <View style={styles.awardContent}>
                        <Image style={styles.awardImg} source={{uri}}/>
                        <MRText style={styles.awardName}>{this.state.awardName}</MRText>
                    </View>
                </ImageBackground>
                <LinearGradient style={styles.getButton}
                                start={{x: 0, y: 0}}
                                end={{x: 0, y: 1}}
                                colors={['#FFEB8E', '#FFCB69']}>
                    <MRText style={styles.btnText}>
                        立即领取
                    </MRText>
                </LinearGradient>
            </View>
        )
    }

    //获取奖品失败view
    _failRender=()=>{
        return (
            <View>
                <Image source={award_no}
                       style={styles.noAward}/>
                <MRText style={styles.failText}>真可惜，离中奖只差一步</MRText>
            </View>
        )
    }

    render() {
        const {eggState} = this.state;
        let content;
        if ((eggState === status.wait) || (eggState === status.breaking)) {
            content = this._waitOrBreakingRender();
        } else if (eggState === status.success) {
            content = this._successRender();
        } else {
            content = this._failRender();
        }

        return(
            <View>
                {content}
                <TouchableWithoutFeedback onPress={()=>marketingUtils.closeModal()}>
                    <View style={styles.closeWrapper}>
                        <Image source={res.button.tongyong_btn_close_white} style={styles.closeIcon}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const awardWidth = DesignRule.width - px2dp(25);
const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        width: px2dp(330),
        height: px2dp(60),
        zIndex: 10
    },
    firework: {
        width: px2dp(350),
        height: px2dp(172),
        zIndex: 10
    },
    egg: {
        width: px2dp(186),
        height: px2dp(218),
        marginTop: px2dp(-100),
        zIndex: 10
    },
    bedplate: {
        width: px2dp(214),
        height: px2dp(86),
        marginTop: px2dp(-40)
    },
    hammer: {
        width: px2dp(81),
        height: px2dp(87),
        zIndex: 20,
        position: 'absolute',
        top: px2dp(167),
        right: px2dp(40)
    },
    lottie: {
        width: px2dp(170),
        height: px2dp(220)
    },
    awardContentBg: {
        width: awardWidth,
        height: awardWidth,
        alignItems: 'center'
    },
    tip: {
        color: DesignRule.white,
        fontSize: DesignRule.fontSize_secondTitle,
        marginTop: awardWidth * 0.3,
    },
    awardContent: {
        width: DesignRule.width * 0.64,
        flex: 1,
        marginBottom: px2dp(25),
        marginTop: px2dp(12),
        backgroundColor: DesignRule.white,
        alignItems: 'center'
    },
    awardImg: {
        width: px2dp(135),
        height: px2dp(135),
        marginTop: px2dp(5)
    },
    awardName: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_secondTitle,
        marginTop: px2dp(5)
    },
    getButton:{
        width:px2dp(130),
        height:px2dp(40),
        marginTop:px2dp(30),
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'center',
        borderRadius:px2dp(20)
    },
    btnText:{
        color:DesignRule.mainColor,
        fontSize:px2dp(17)
    },
    noAward:{
        width:px2dp(230),
        height:px2dp(261)
    },
    failText:{
        color:DesignRule.white,
        fontSize:DesignRule.fontSize_threeTitle,
        alignSelf:'center',
        marginTop:px2dp(15)
    },
    closeIcon:{
        width:px2dp(24),
        height:px2dp(24),
    },
    closeWrapper:{
        position:'absolute',
        top:-30,
        left:20
    }
})
