//我的晋升情况
import React from 'react';
import {
    View,
    Text,
    Image,
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
import HeaderBarBgImg from './res/bg2.png';
import WhiteBtImg from './res/dz_03-02.png';
import RingImg from './../../res/homeBaseImg/bg_03.png';
import CCZImg from './res/ccz_03.png';
import ProgressImg from './res/jdt_05.png';
// import {NavigationActions} from "react-navigation";
import BasePage from '../../../../BasePage';
import {UIImage} from '../../../../components/ui';
import { NavigationActions } from 'react-navigation';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import res from '../../../../comm/res';
// 常量
const SCREEN_WIDTH = Dimensions.get('window').width;


export default class MyPromotionPage extends BasePage {

    $navigationBarOptions = {
        show: false, // false则隐藏导航
        title: '我的晋升情况'
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
            realName: null
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
                this.props.navigation.navigate('login/login/LoginPage');
            }
        });
        MineApi.getNextLevelInfo().then(res => {
            const { data } = res;
            this.setState({
                nextArr: data.content
            });
        });
    };


    _imgLoadFail = (url, error) => {
        console.warn(url + '\n' + error);
    };


    renderHeader = () => {
        const progress = this.state.experience / this.state.levelExperience;
        const marginLeft = 315 / 375 * SCREEN_WIDTH * progress;
        const headerWidth = 65 / 375 * SCREEN_WIDTH;
        const radius = marginLeft > 4 ? 0 : 4;


        const storeStar = 3;
        const starsArr = [];
        if (storeStar && typeof storeStar === 'number') {
            for (let i = 0; i < storeStar; i++) {
                i <= 2 && starsArr.push(i);
            }
        }

        return <View style={{ height: 182 / 375 * SCREEN_WIDTH + 115 + ScreenUtils.statusBarHeight + 10}}>
            <ImageBackground source={HeaderBarBgImg} style={{
                width: SCREEN_WIDTH, height: 182 / 375 * SCREEN_WIDTH+ScreenUtils.statusBarHeight+10,
                flexDirection: 'row',paddingTop:ScreenUtils.statusBarHeight,
            }}>
                <UIImage source={res.button.white_back_img} style={{marginLeft:15,width:15,height:15}} onPress={()=>this.$navigateBack()}/>
                <ImageBackground source={RingImg}
                                 style={styles.headerBg}>
                    {
                        this.state.headImg ?
                            <Image style={{ width: headerWidth, height: headerWidth, borderRadius: headerWidth / 2 }}
                                   onError={({ nativeEvent: { error } }) => this._imgLoadFail(this.state.headImg, error)}
                                   source={{ uri: this.state.headImg }}/> : null
                    }
                </ImageBackground>
                <View style={{
                    height: 105 / 375 * SCREEN_WIDTH,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 16,
                    marginLeft: 10
                }}>
                    <View style={{
                        justifyContent: 'center', alignItems: 'center', marginTop: 10, width: 89,
                        height: 20,
                        borderRadius: 10,
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: 'white'
                    }}>
                        <Text style={styles.shopName}>{this.state.levelName || ' '}</Text>
                    </View>
                </View>
            </ImageBackground>
            <ImageBackground source={WhiteBtImg} style={styles.whiteBg}>
                <View style={{ height: 43, marginHorizontal: 0, flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={CCZImg} style={{ marginLeft: 17, marginRight: 6 }}/>
                    <Text style={{
                        fontSize: 15,
                        color: DesignRule.textColor_mainTitle
                    }}>成长值</Text>
                </View>

                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{
                        marginTop: 10,
                        color: '#f00006',
                        fontSize: 10,
                    }}>{this.state.experience || 0}<Text style={{
                        color: DesignRule.textColor_secondTitle
                    }}>
                        /{this.state.levelExperience}
                    </Text></Text>

                    <ImageBackground source={ProgressImg} style={{
                        overflow: 'hidden',
                        marginTop: 5,
                        height: 8,
                        width: 315 / 375 * SCREEN_WIDTH
                    }}>
                        <View style={{
                            marginRight: -1,
                            marginLeft: marginLeft,
                            height: 8,
                            borderRadius: 4,
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
                        fontSize: 11,
                    }}>距离晋升还差<Text style={{
                        color: '#000',
                        fontSize: 15
                    }}>
                        {(this.state.levelExperience - this.state.experience) > 0 ? this.state.levelExperience - this.state.experience : 0}
                    </Text>分</Text>
                </View>
            </ImageBackground>
        </View>;
    };

    renderWelfare() {
        // const arr = ['分红增加', '分红增加', '分红增加', '分红增加'];
        return (
            <View style={{ marginBottom: 50 }}>
                <View style={{ justifyContent: 'center', height: 44, backgroundColor: '#fff' }}>
                    <Text style={{
                        marginLeft: 14,
                        fontSize: 14,
                        color: DesignRule.textColor_mainTitle
                    }}>预计晋升后可获得哪些福利？</Text>
                </View>
                {this.renderSepLine()}
                {this.state.nextArr ? <HTML html={this.state.nextArr} imagesMaxWidth={ScreenUtils.width}
                                            containerStyle={{ backgroundColor: '#fff' }}
                                            imagesInitialDimensions={ScreenUtils.width}
                                            baseFontStyle={{ lineHeight: 25, color: DesignRule.textColor_secondTitle, fontSize: 13 }}/> : null}
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

    // 主题内容
    renderBodyView = () => {
        return (
            <ScrollView showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />}>
                {this.renderHeader()}
                {this.renderWelfare()}
                <View style={{ backgroundColor: '#f7f7f7', height: 2 }}/>
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
        this.props.navigation.navigate('mine/InviteFriendsPage');
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
                        <Text style={{ fontSize: 14, color: '#000' }}>邀请好友</Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={this._onGoShop}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f00006',
                        flex: 1,
                        height: 48
                    }}>
                        <Text style={{ fontSize: 14, color: '#fff' }}>去购物</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: ScreenUtils.safeBottom,
    },
    headerBg: {
        marginTop:26,
        marginLeft: 10,
        marginRight: 10,
        width: 105 / 375 * SCREEN_WIDTH,
        height: 105 / 375 * SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    shopName: {
        fontSize: 13,
        color: 'white'
    },
    //白的面板背景
    whiteBg: {
        width: SCREEN_WIDTH - 22,
        height: 153 / 375 * (SCREEN_WIDTH - 22),
        position: 'absolute',
        bottom: 11,
        left: 11,
        backgroundColor: 'transparent',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
            width: 0,
            height: 0
        },
        overflow: 'hidden',
        shadowRadius: 10,
        shadowOpacity: 1,
        borderRadius: 12
    }
});
