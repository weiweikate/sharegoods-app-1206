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
    InteractionManager,
    TouchableWithoutFeedback
} from 'react-native';
// import storeModel from '../../../spellShop/model/storeModel';
import { PageLoadingState } from '../../../../components/pageDecorator/PageState';
import MineApi from '../../api/MineApi';
// 图片资源
import HeaderBarBgImg from './res/txbg_02.png';
import WhiteBtImg from './res/dz_03-02.png';
import RingImg from './../../res/homeBaseImg/bg_03.png';
import CCZImg from './res/ccz_03.png';
import ProgressImg from './res/jdt_05.png';
// import {NavigationActions} from "react-navigation";
import BasePage from '../../../../BasePage';
// 常量
const SCREEN_WIDTH = Dimensions.get('window').width;


export default class MyPromotionPage extends BasePage {

    $navigationBarOptions = {
        show: true, // false则隐藏导航
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
        InteractionManager.runAfterInteractions(this.loadPageData);
    }

    loadPageData = () => {
        // 当前等级
        MineApi.getUserLevelInfo().then(response => {
            console.log(response);
            if (response.code === 10000) {
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
            } else {
                this.setState({
                    loading: false,
                    refreshing: false,
                    netFailedInfo: response,
                    loadingState: PageLoadingState.fail
                });
            }
        }).catch(err => {
            if (err.code === 10001) {
                this.props.navigation.navigate('login/login/LoginPage');
            }

        });
    };


    _imgLoadFail = (url, error) => {
        console.warn(url + '\n' + error);
    };


    renderHeader = () => {

        const progress = this.state.levelExperience / this.state.experience;
        const marginLeft = 315 / 375 * SCREEN_WIDTH * progress;
        const headerWidth = 65 / 375 * SCREEN_WIDTH;
        const radius = marginLeft > 4 ? 0 : 4;


        // const storeStar = storeModel.storeStar;
        const storeStar = 3;
        const starsArr = [];
        if (storeStar && typeof storeStar === 'number') {
            for (let i = 0; i < storeStar; i++) {
                i <= 2 && starsArr.push(i);
            }
        }

        return <View style={{ height: 182 / 375 * SCREEN_WIDTH + 115 }}>
            <ImageBackground source={HeaderBarBgImg} style={{
                width: SCREEN_WIDTH, height: 182 / 375 * SCREEN_WIDTH,
                flexDirection: 'row'
            }}>
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
                    marginLeft: 16
                }}>
                    <View style={{
                        justifyContent: 'center', alignItems: 'center', marginTop: 10, width: 89,
                        height: 20,
                        borderRadius: 10,
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: '#ffffff'
                    }}>
                        <Text style={styles.shopName}>{this.state.levelName || ' '}</Text>
                    </View>
                </View>
            </ImageBackground>
            <ImageBackground source={WhiteBtImg} style={styles.whiteBg}>
                <View style={{ height: 43, marginHorizontal: 0, flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={CCZImg} style={{ marginLeft: 17, marginRight: 6 }}/>
                    <Text style={{
                        fontFamily: 'PingFang-SC-Medium',
                        fontSize: 15,
                        color: '#000000'
                    }}>成长值</Text>
                </View>

                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{
                        marginTop: 10,
                        color: '#e60012',
                        fontSize: 10,
                        fontFamily: 'PingFang-SC-Medium'
                    }}>{this.state.levelExperience || 0}<Text style={{
                        color: '#666666'
                    }}>
                        /{this.state.experience}
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
                            backgroundColor: '#dddddd',
                            borderBottomLeftRadius: radius,
                            borderTopLeftRadius: radius
                        }}/>
                    </ImageBackground>
                    {/*315 8*/}
                    {/*<Image source={ProgressImg} style={{marginTop: 5}}/>*/}

                    <Text style={{
                        marginTop: 10,
                        color: '#222222',
                        fontSize: 11,
                        fontFamily: 'PingFang-SC-Medium'
                    }}>距离晋升还差<Text style={{
                        color: '#000',
                        fontSize: 15
                    }}>
                        {this.state.experience - this.state.levelExperience}
                    </Text>分</Text>
                </View>
            </ImageBackground>
        </View>;
    };

    renderWelfare() {
        const arr = ['分红增加', '分红增加', '分红增加', '分红增加'];
        return (
            <View>
                <View style={{ justifyContent: 'center', height: 44, backgroundColor: '#fff' }}>
                    <Text style={{
                        marginLeft: 14,
                        fontFamily: 'PingFang-SC-Medium',
                        fontSize: 14,
                        color: '#222222'
                    }}>预计晋升后可获得哪些福利？</Text>
                </View>
                {this.renderSepLine()}
                {arr.map((item, index) => {
                    return <View key={index} style={{ justifyContent: 'center', height: 44, backgroundColor: '#fff' }}>
                        <Text style={{
                            marginLeft: 14,
                            fontFamily: 'PingFang-SC-Medium',
                            fontSize: 13,
                            color: '#666666'
                        }}>{item}</Text>
                    </View>;
                })}
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
        // this.jr_navigate('mine/myData/InvitationPage');
    };

    // 去购物
    _onGoShop = () => {
        // const resetAction=NavigationActions.reset({
        //     index: 0,
        //     actions: [NavigationActions.navigate({routeName: 'Tab'})]
        // });
        // this.props.navigation.dispatch(resetAction);
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
                        backgroundColor: '#E60012',
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
        flex: 1
    },
    headerBg: {
        marginTop: 16,
        marginLeft: 16,
        marginRight: 23,
        width: 105 / 375 * SCREEN_WIDTH,
        height: 105 / 375 * SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    shopName: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#ffffff'
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
