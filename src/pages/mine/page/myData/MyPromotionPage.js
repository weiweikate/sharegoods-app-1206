//我的晋升情况
import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    ScrollView,
    RefreshControl,
    ImageBackground,
    TouchableWithoutFeedback
} from 'react-native';
import { PageLoadingState, renderViewByLoadingState } from '../../../../components/pageDecorator/PageState';
import MineApi from '../../api/MineApi';
import HTML from 'react-native-render-html';
// 图片资源
import DesignRule from '../../../../constants/DesignRule';
import BasePage from '../../../../BasePage';
import { UIImage,NoMoreClick } from '../../../../components/ui';
import { NavigationActions } from 'react-navigation';
import ScreenUtils from '../../../../utils/ScreenUtils'
import res from '../../res';
import ImageLoad from '@mr/image-placeholder';
import { MRText as Text } from '../../../../components/ui';
// 常量
const SCREEN_WIDTH = Dimensions.get('window').width;
const HeaderBarBgImg = res.homeBaseImg.home_jingshenqingk_bg;
const iconbg = res.homeBaseImg.home_jingshnegqingk_icon;
const CCZImg = res.myData.ccz_03;
const ProgressImg = res.myData.jdt_05;
const arrowRightImg= res.myData.black_right_arrow
import LinearGradient from 'react-native-linear-gradient';

const { px2dp } = ScreenUtils;

const headerBgHeight = px2dp(182) + ScreenUtils.statusBarHeight + 30;
const headerHeight = ScreenUtils.headerHeight;
const offset = headerBgHeight - headerHeight;

export default class MyPromotionPage extends BasePage {

    $navigationBarOptions = {
        show: false, // false则隐藏导航
        title: '我的晋升'
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
                realName: data.realName,
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
        const progress = this.state.experience / this.state.levelExperience;
        const marginLeft = px2dp(315) * progress;
        const headerWidth = px2dp(65);
        const radius = marginLeft > 4 ? -0.5 : 4;


        const storeStar = 3;
        const starsArr = [];
        if (storeStar && typeof storeStar === 'number') {
            for (let i = 0; i < storeStar; i++) {
                i <= 2 && starsArr.push(i);
            }
        }

        return <View style={{ height: px2dp(182) + 115 + ScreenUtils.statusBarHeight }}>

            <ImageBackground source={HeaderBarBgImg} style={{
                width: SCREEN_WIDTH, height: px2dp(182) + ScreenUtils.statusBarHeight + 30,
                flexDirection: 'row', paddingTop: ScreenUtils.statusBarHeight
            }}>


                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 25, marginBottom: 40 }}>
                    <ImageLoad style={{ width: headerWidth, height: headerWidth, borderRadius: headerWidth / 2 }}
                               borderRadius={headerWidth / 2}
                               source={{ uri: this.state.headImg }}/>
                    <View style={{
                        justifyContent: 'center',
                        marginLeft: 10
                    }}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:ScreenUtils.width-130}}>
                            <Text style={{
                                fontSize: 15,
                                color: 'white'
                            }} allowFontScaling={false}>{this.state.levelName ? `${this.state.levelName}品鉴官` : ''}</Text>
                            {parseInt(this.state.experience)<1?null
                                :
                                <NoMoreClick style={{backgroundColor:'white',width:65,height:19,borderRadius:9,alignItems:'center',justifyContent:'center',flexDirection:'row'}}
                                             onPress={()=>this.$navigate('mine/ExpDetailPage',{
                                                 experience:this.state.experience,
                                                 levelExperience:this.state.levelExperience
                                             })}>
                                    <Text style={{fontSize:10,color:"#000000",marginRight:4}}>经验明细</Text>
                                    <Image source={arrowRightImg}/>
                                </NoMoreClick>
                            }

                        </View>

                        <ImageBackground style={{
                            justifyContent: 'center', alignItems: 'center', marginTop: 10,
                            height: 15,
                            width: 35
                        }} source={iconbg}>
                            <Text style={styles.shopName}
                                  allowFontScaling={false}>{this.state.levelRemark || ' '}</Text>
                        </ImageBackground>
                    </View>
                </View>
            </ImageBackground>
            <View style={styles.whiteBg}>
                <View style={{ height: 43, marginHorizontal: 0, flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={CCZImg} style={{ marginLeft: 17, marginRight: 6 }}/>
                    <Text style={{
                        fontSize: 15,
                        color: DesignRule.textColor_mainTitle
                    }} allowFontScaling={false}>经验值</Text>
                </View>

                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{
                        marginTop: 10,
                        color: '#f00006',
                        fontSize: 10
                    }} allowFontScaling={false}>{this.state.experience || 0}<Text style={{
                        color: DesignRule.textColor_secondTitle
                    }}>
                        /{this.state.levelExperience}
                    </Text></Text>

                    <ImageBackground source={ProgressImg} style={{
                        overflow: 'hidden',
                        marginTop: 5,
                        height: 8,
                        width: px2dp(315),
                        borderRadius: 4
                    }}>
                        <View style={{
                            marginRight: -0.5,
                            marginLeft: marginLeft,
                            height: 8,
                            borderBottomRightRadius: 4,
                            borderTopRightRadius: 4,
                            backgroundColor: DesignRule.lineColor_inGrayBg,
                            borderBottomLeftRadius: radius,
                            borderTopLeftRadius: radius
                        }}/>
                    </ImageBackground>
                    {/*315 8*/}
                    {/*<Image source={ProgressImg} style={{marginTop: 5}}/>*/}

                    <Text style={{
                        marginTop: 10,
                        color: DesignRule.textColor_mainTitle,
                        fontSize: 12
                    }} allowFontScaling={false}>距离晋升还差
                        <Text style={{
                            color: DesignRule.textColor_mainTitle,
                            fontSize: 12
                        }}>
                            {(this.state.levelExperience - this.state.experience) > 0 ? `${this.state.levelExperience - this.state.experience}Exp` : '0Exp'}
                        </Text>
                        {(this.state.levelExperience - this.state.experience) > 0 ? null :
                            <Text style={{ color: DesignRule.mainColor, fontSize: 11 }}
                                  allowFontScaling={false}>(Exp已满)</Text>
                        }
                    </Text>
                </View>
            </View>
        </View>;
    };

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


        this.headerBg.setNativeProps({
            opacity: this.st
        });
    };

    _navRender = () => {

        let title = !this.state.changeHeader || this.state.loadingState === PageLoadingState.fail ? <Text style={{
            color: DesignRule.white,
            alignSelf: 'center',
            fontSize: 17,
            includeFontPadding: false
        }} allowFontScaling={false}>我的晋升</Text> : null;
        return (
            <View style={{
                width: SCREEN_WIDTH,
                height: ScreenUtils.headerHeight,
                paddingTop: ScreenUtils.statusBarHeight,
                position: 'absolute', top: 0,
                left: 0,
                flexDirection: 'row',
                alignItems: 'center'
            }}>

                <LinearGradient ref={(ref) => {
                    this.headerBg = ref;
                }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FF1C89', '#FF156E']} style={{
                    width: SCREEN_WIDTH,
                    height: ScreenUtils.headerHeight,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    opacity: this.state.loadingState === PageLoadingState.fail ? 1 : 0
                }}/>
                <View style={{ flex: 1 }}>
                    <UIImage source={res.button.white_back}
                             style={{ width: 10, height: 18, marginLeft: 15 }}
                             onPress={() => this.$navigateBack()}/>
                </View>
                {title}
                <View style={{ flex: 1 }}/>
            </View>
        );
    };

    // 主题内容
    renderBodyView = () => {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
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
                return this._render();
            }) : this._render()
        );
    }


    render() {
        return (<View style={{ flex: 1 }}>
            {this.renderContianer()}
            {this._navRender()}
        </View>);

    }

    _render() {
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
        marginBottom: ScreenUtils.safeBottom
    },
    headerBg: {
        marginTop: 26,
        marginLeft: 10,
        marginRight: 10,
        width: 105 / 375 * SCREEN_WIDTH,
        height: 105 / 375 * SCREEN_WIDTH,
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
        width: SCREEN_WIDTH - 22,
        height: 153 / 375 * (SCREEN_WIDTH - 22),
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
    }
});
