//我的晋升情况
import React from 'react';
import {
    View,
    // Image,
    Dimensions,
    StyleSheet,
    ScrollView,
    RefreshControl,
    ImageBackground,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import { PageLoadingState, renderViewByLoadingState } from '../../../../components/pageDecorator/PageState';
import MineApi from '../../api/MineApi';
import HTML from 'react-native-render-html';
// 图片资源
import DesignRule from '../../../../constants/DesignRule';
import BasePage from '../../../../BasePage';
// import {
//     NoMoreClick
// } from '../../../../components/ui';
import { NavigationActions } from 'react-navigation';
import ScreenUtils from '../../../../utils/ScreenUtils';
import res from '../../res';
// import ImageLoad from '@mr/image-placeholder';
import AvatarImage from '../../../../components/ui/AvatarImage';
import { MRText as Text } from '../../../../components/ui';
import Carousel from 'react-native-snap-carousel';

// 常量
// const iconbg = res.homeBaseImg.home_jingshnegqingk_icon;
// const CCZImg = res.myData.ccz_03;
// const ProgressImg = res.myData.jdt_05;
// const arrowRightImg = res.myData.black_right_arrow;
// import LinearGradient from 'react-native-linear-gradient';
// import StringUtils from '../../../../utils/StringUtils';
import { SmoothPushPreLoadHighComponent } from '../../../../comm/components/SmoothPushHighComponent';

const { px2dp } = ScreenUtils;

const headerBgHeight = px2dp(182) + ScreenUtils.statusBarHeight + 30;
const headerHeight = ScreenUtils.headerHeight;
const offset = headerBgHeight - headerHeight;
const {myData} = res;
const angleArr = [myData.icon_v0Angle,myData.icon_v1Angle,myData.icon_v2Angle,myData.icon_v3Angle,myData.icon_v4Angle,myData.icon_v5Angle];
const dotArr = [myData.icon_v0Dot,myData.icon_v1Dot,myData.icon_v2Dot,myData.icon_v3Dot,myData.icon_v4Dot,myData.icon_v5Dot,];
const vipBgArr = [myData.icon_v0Bg,myData.icon_v1Bg,myData.icon_v2Bg,myData.icon_v3Bg,myData.icon_v4Bg,myData.icon_v5Bg,];
const vipLevelArr = [myData.icon_v0,myData.icon_v1,myData.icon_v2,myData.icon_v3,myData.icon_v4,myData.icon_v5,];
const levelName = [
    {name:'黄金',level:'V0'},
    {name:'铂金',level:'V1'},
    {name:'黑金',level:'V2'},
    {name:'钻石',level:'V3'},
    {name:'达人',level:'V4'},
    {name:'名人',level:'V5'}];

let userLevel = 0;

@SmoothPushPreLoadHighComponent
export default class MyPromotionPage extends BasePage {

    $navigationBarOptions = {
        show: true, // false则隐藏导航
        title: '我的晋升'
    };

    $NavBarRightPressed = () => {
        this.$navigate('mine/ExpDetailPage', {
            experience: this.state.experience,
            levelExperience: this.state.levelExperience
        })
    };

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._reload
            }
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            slider1ActiveSlide: 0,
            loadingState: PageLoadingState.loading,
            levelName: '',
            experience: 0,
            refreshing: false,
            nextExperience: '',
            loading: true,
            netFailedInfo: null,
            headImg: null,
            realName: null,
            changeHeader: true
        };
    }

    componentDidMount() {
        userLevel = 0;
        this.$NavigationBarResetRightTitle('经验明细');
        // InteractionManager.runAfterInteractions(this.loadPageData);
        this.loadPageData();
    }

    loadPageData = () => {
        // 当前等级
        MineApi.getUserLevelInfo().then(response => {
            console.log(response);
            // console.warn(JSON.stringify(response,null,4));
            const { data } = response;
            this.setState({
                loading: false,
                refreshing: false,
                netFailedInfo: null,
                levelName: data.levelName,
                levelRemark: data.levelRemark,
                experience: data.experience || 0,
                levelExperience: data.levelExperience || 0,
                headImg: data.headImg,
                realName: data.nickname,
                loadingState: PageLoadingState.success,
                ...data
            });
        }).catch(err => {
            this.setState({
                loading: false,
                refreshing: false,
                netFailedInfo: err,
                loadingState: PageLoadingState.fail
            });
            if (err.code === 10009) {
                this.gotoLoginPage();
            }
        });
        MineApi.getNextLevelInfo().then(resp => {
            const { data } = resp;
            this.setState({
                nextArr: data.content
            });
        });
    };

    renderHeader = () => {
        for(let i = 0;i < levelName.length;i++){
            if(levelName[i].level === this.state.levelRemark){
                userLevel = i;
            }
        }
        const EXPNum = this.state.levelExperience - this.state.experience;
        const storeStar = 3;
        const starsArr = [];
        if (storeStar && typeof storeStar === 'number') {
            for (let i = 0; i < storeStar; i++) {
                i <= 2 && starsArr.push(i);
            }
        }

        return(
            <View>
                <Carousel
                    data={levelName}
                    renderItem={this.renderLevelCard}
                    sliderWidth={ScreenUtils.width}
                    itemWidth={px2dp(345)}
                    inactiveSlideScale={1}
                    inactiveSlideOpacity={1}
                    enableMomentum={true}
                    activeSlideAlignment={'center'}
                    containerCustomStyle={styles.slider}
                    contentContainerCustomStyle={styles.sliderContentContainer}
                    onSnapToItem={(index) => {
                        this.setState({slider1ActiveSlide:index});
                        this.carousel.snapToItem( index,true)}
                    }
                />
                <Carousel
                    ref = {(c)=> { this.carousel  = c }}
                    data={levelName}
                    renderItem={this.progressView}
                    sliderWidth={ScreenUtils.isIOS ? 0.1 : 1}
                    itemWidth={ScreenUtils.width}
                    inactiveSlideScale={1}
                    inactiveSlideOpacity={1}
                    enableMomentum={true}
                    activeSlideAlignment={'start'}
                    containerCustomStyle={[styles.slider,{ marginTop: -10}]}
                    contentContainerCustomStyle={styles.sliderContentContainer}
                />
                <View style={{flex:1, height:30,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{color:'#999999',fontSize:10}}>距下一等级还差
                        <Text style={{color:'#333333',fontSize:16}}> {EXPNum} </Text>
                        经验值
                    </Text>
                </View>
            </View>
        )
    };

    renderLevelCard = ({ item, index })=>{
        let color = index === 2 || index === 4 || index === 5 ? '#FFE6B1' : DesignRule.textColor_mainTitle;

        let icon = (this.state.headImg && this.state.headImg.length > 0) ?
            <AvatarImage source={{ uri: this.state.headImg }} style={styles.userIconNavStyle}
                         borderRadius={px2dp(13)}/> : <Image source={res.homeBaseImg.mine_user_icon} style={styles.userIconNavStyle}
                                                             borderRadius={px2dp(13)}/>;

                                                             return (
            <View style={{alignItems: 'center'}} key={index + 'LevelCard'}>
                <ImageBackground source={vipBgArr[index]} style={{
                    width: px2dp(335), height: px2dp(190),
                    flexDirection: 'row', paddingTop: ScreenUtils.statusBarHeight, borderRadius: 15
                }}>
                    <View style={{flex: 2}}>
                        <View style={{flexDirection: 'row'}}>
                            <Image source={vipLevelArr[index]} style={{width: 28, height: 28, marginLeft: px2dp(20)}}/>
                            <View style={{marginLeft: 10, justifyContent: 'flex-end'}}>
                                <Text style={{
                                    color: color,
                                    fontSize: 16,
                                    fontWeight: '600',
                                    position: 'absolute',
                                    bottom: -4.5,
                                }}>
                                    {`${item.name}评鉴官`}
                                </Text>
                            </View>
                        </View>
                        <Text style={{
                            marginTop: px2dp(10),
                            marginLeft: px2dp(20),
                            fontSize: DesignRule.fontSize_22,
                            color: DesignRule.textColor_mainTitle
                        }}>
                            {`经验值${parseInt(this.state.levelExperience)}`}
                        </Text>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View style={{flexDirection: 'row', marginBottom: 20, alignItems: 'center'}}>
                                <View style={{alignItems:'center', justifyContent:'center',
                                    marginLeft: px2dp(20), backgroundColor: 'white',
                                    borderRadius:14,width:px2dp(28),height:px2dp(28)}}>
                                {icon}
                                </View>
                                <Text style={{
                                    marginLeft: 10,
                                    fontSize: DesignRule.fontSize_24,
                                    color: DesignRule.textColor_mainTitle}}>
                                    {this.state.realName && this.state.realName.length > 0 ? this.state.realName : ''}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {userLevel <= index ? <ImageBackground style={{
                        width: 70,
                        height: 24,
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}source={userLevel == index ? angleArr[index] : angleArr[2]}>
                        <Text style={{
                            fontSize: DesignRule.fontSize_24,
                            color: DesignRule.color_fff}}>
                            {userLevel == index ? '当前等级' : '待升级'}
                        </Text>
                    </ImageBackground> : null}
                </ImageBackground>
            </View>
        )
    }

    progressView = ({item,index}) => {
        let num = 1;
        const progress = index < userLevel ? 100 : index > userLevel ? 0 :
            (this.state.experience / this.state.levelExperience) < 1 ? (this.state.experience / this.state.levelExperience) * 100 : 100;
        // console.log(progress);

        return (
            <View key={index + 'progressView'}
                style={{flex: 1, flexDirection: 'row', height: 16, alignItems: 'center',marginLeft:10,marginRight:10}}>

                {index > 0 ? <Image source={dotArr[this.state.slider1ActiveSlide - num]} style={{width:10, height:10}}/>
                    : <View style={{width:10, height:10}}/>}
                {index > 0 ?
                    <View style={{flex: 1, height: 4, backgroundColor: 'rgba(0,0,0,0.1)', marginLeft: 20, marginRight: 20, borderRadius: 6}}>
                        <View style={{flex: 1, width: index == 5 ? `${progress}%` : index > userLevel ? '0%' : '100%',
                            height: 4, backgroundColor: '#FFD57D', borderRadius: 6}}/>
                    </View>
                    : <View style={{flex:1, height:4}}/>}
                <Image source={dotArr[this.state.slider1ActiveSlide]} style={{width:10, height:10}}/>
                {index < 5 ?
                    <View style={{flex: 1, height: 4, backgroundColor: 'rgba(0,0,0,0.1)', marginLeft: 20, marginRight: 20, borderRadius: 6}}>
                        <View style={{flex: 1, width:`${progress}%`,height: 4, backgroundColor: '#FFD57D', borderRadius: 6}}/>
                    </View>
                    : <View style={{flex:1, height:4}}/>}
                {index < 5 ? <Image source={dotArr[this.state.slider1ActiveSlide + num]} style={{width:10, height:10}}/>
                    : <View style={{width:10, height:10}}/>}
            </View>
        )
    }

    renderWelfare() {
        // const arr = ['分红增加', '分红增加', '分红增加', '分红增加'];
        return (
            <View>
                {/*<View style={{ justifyContent: 'center', height: 44, backgroundColor: '#fff' }}>*/}
                {/*<Text style={{*/}
                {/*marginLeft: 14,*/}
                {/*fontSize: 14,*/}
                {/*color: DesignRule.textColor_mainTitle*/}
                {/*}}>预计晋升后可获得哪些福利？</Text>*/}
                {/*</View>*/}
                {/*{this.renderSepLine()}*/}
                {this.state.nextArr ? <HTML html={this.state.nextArr} imagesMaxWidth={ScreenUtils.width}
                                            containerStyle={{ backgroundColor: '#fff' }}
                                            imagesInitialDimensions={{ width: ScreenUtils.width, height: 0 }}
                                            baseFontStyle={{
                                                lineHeight: 25,
                                                color: DesignRule.textColor_secondTitle,
                                                fontSize: 13
                                            }}/> : null}
            </View>
        );
    }

    renderSepLine = () => {
        return (<View style={{
            height: 2,
            borderWidth: 0.5,
            borderColor: '#fdfcfc'
        }}/>);
    };

    _onRefresh = () => {
        this.setState({
            refreshing: true
        }, this.loadPageData);
    };


    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        if (Y < offset) {
            this.st = Y / offset;

            this.setState({
                changeHeader: this.st > 0.7 ? false : true
            });
        } else {
            this.st = 1;
            this.setState({
                changeHeader: false
            });
        }
    };

    // 主题内容
    renderBodyView = () => {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={200}
                onScroll={this._onScroll.bind(this)}
                refreshControl={<RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    colors={[DesignRule.mainColor]}
                />}>
                {this.renderHeader()}
                {this.renderWelfare()}
            </ScrollView>
        );
    };

    // 重新加载
    _reload = () => {
        this.setState({
            loading: true,
            netFailedInfo: null,
            loadingState: PageLoadingState.loading
        }, this.loadPageData);
    };

    renderContianer() {
        let controlParams = this.$getPageStateOptions ? this.$getPageStateOptions() : null;
        return (
            controlParams ? renderViewByLoadingState(controlParams, () => {
                return this.renderView();
            }) : this.renderView()
        );
    }


    _render() {
        return (<View style={{ flex: 1}}>
            {this.renderContianer()}
            {/*{this._navRender()}*/}
        </View>);

    }

    renderView() {
        return (
            <View style={styles.container}>
                {this.renderBodyView()}
                {this.renderFooter()}
            </View>
        );
    }

    _onPressInvite = () => {
        this.$navigate('mine/InviteFriendsPage');
    };

    // 去购物
    _onGoShop = () => {
        let resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Tab' })//要跳转到的页面名字
            ]
        });
        this.props.navigation.dispatch(resetAction);
    };

    renderFooter() {
        return (
            <View style={{ flexDirection: 'column', height: 48.5 }}>
                <View
                    style={{ height: 0.5, width: ScreenUtils.width, backgroundColor: DesignRule.lineColor_inGrayBg }}/>
                <View style={{
                    width: Dimensions.get('window').width, height: 48, position: 'absolute', bottom: 0,
                    alignItems: 'center', justifyContent: 'center', flexDirection: 'row'
                }}>
                    <TouchableWithoutFeedback onPress={this._onPressInvite}>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                            backgroundColor: '#fff',
                            height: 48
                        }}>
                            <Text style={{ fontSize: 14, color: '#000' }} allowFontScaling={false}>分享好友</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={this._onGoShop}>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: DesignRule.mainColor,
                            flex: 1,
                            height: 48
                        }}>
                            <Text style={{ fontSize: 14, color: '#fff' }} allowFontScaling={false}>浏览秀购</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        marginBottom: ScreenUtils.safeBottom
    },
    headerBg: {
        marginTop: 26,
        marginLeft: 10,
        marginRight: 10,
        width: 105 / 375 * ScreenUtils.width,
        height: 105 / 375 * ScreenUtils.width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    shopName: {
        fontSize: 11,
        color: 'white',
        marginLeft: 10
    },
    //白的面板背景
    whiteBg: {
        width: ScreenUtils.width - 22,
        height: 153 / 375 * (ScreenUtils.width - 22),
        position: 'absolute',
        bottom: 11,
        left: 11,
        backgroundColor: 'white',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
            width: 0,
            height: 0
        },
        // overflow: 'hidden',
        shadowRadius: 10,
        shadowOpacity: 1,
        borderRadius: 12
    },
    slider: {
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },
    userIconNavStyle: {
        width: px2dp(26),
        height: px2dp(26),
        borderRadius: px2dp(13),
    },
});
