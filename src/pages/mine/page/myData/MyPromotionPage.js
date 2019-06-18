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
    TouchableWithoutFeedback
} from 'react-native';
import { PageLoadingState } from '../../../../components/pageDecorator/PageState';
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
// import AvatarImage from '../../../../components/ui/AvatarImage';
import { MRText as Text } from '../../../../components/ui';
import Carousel from 'react-native-snap-carousel';

// 常量
const HeaderBarBgImg = res.homeBaseImg.home_jingshenqingk_bg;
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
        // return {
        //     loadingState: this.state.loadingState,
        //     netFailedProps: {
        //         netFailedInfo: this.state.netFailedInfo,
        //         reloadBtnClick: this._reload
        //     }
        // };
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
        this.$NavigationBarResetRightTitle('经验明细');
        // InteractionManager.runAfterInteractions(this.loadPageData);
        // this.loadPageData();
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
        // const progress = this.state.experience / this.state.levelExperience;
        // const marginLeft = px2dp(315) * progress;
        // const headerWidth = px2dp(65);
        // const radius = marginLeft > 4 ? -0.5 : 4;


        const storeStar = 3;
        const starsArr = [];
        if (storeStar && typeof storeStar === 'number') {
            for (let i = 0; i < storeStar; i++) {
                i <= 2 && starsArr.push(i);
            }
        }

        return(
            <Carousel
                data={[1,2,3,4,5,6]}
                renderItem={this.renderLevelCard}
                sliderWidth={ScreenUtils.width}
                itemWidth={ScreenUtils.width-22}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                enableMomentum={true}
                activeSlideAlignment={'center'}
                containerCustomStyle={styles.slider}
                contentContainerCustomStyle={styles.sliderContentContainer}
            />
        )
    };

    renderLevelCard = ({ item, index })=>{
        return (
            <View style={{alignItems:'center'}}>
                <ImageBackground source={HeaderBarBgImg} style={{
                    width: ScreenUtils.width-30, height: px2dp(182) + ScreenUtils.statusBarHeight + 30,
                    flexDirection: 'row', paddingTop: ScreenUtils.statusBarHeight
                }}>
                    <Text>123123123</Text>
                </ImageBackground>
                <View style={{flex: 1, flexDirection: 'row', height: 16, alignItems: 'center'}}>
                    {index !== 0 ? <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: 'red'}}/> :
                        <View style={{width: 10,height: 10,}}/>}
                    {index !== 0 ? <View style={{flex: 1, height: 4, marginLeft:10,marginRight:10, borderRadius: 5, backgroundColor: 'red'}}/> :
                        <View style={{flex: 1, height: 4, marginLeft:10,marginRight:10}}/>}
                    <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: 'red'}}/>
                    {index !== 5 ? <View style={{flex: 1, height: 4, marginLeft:10,marginRight:10, borderRadius: 5, backgroundColor: 'red'}}/> :
                        <View style={{flex: 1, height: 4, marginLeft:10,marginRight:10}}/>}
                </View>
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
                {/*{this.renderWelfare()}*/}
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
        marginTop: 15,
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },
});
