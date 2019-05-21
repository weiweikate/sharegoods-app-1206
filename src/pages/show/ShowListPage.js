import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    BackHandler,
    InteractionManager,
    DeviceEventEmitter
} from 'react-native';
import BasePage from '../../BasePage';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import ScreenUtils from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;
import backIconImg from '../../comm/res/button/icon_header_back.png';
import DesignRule from '../../constants/DesignRule';
import { observer } from 'mobx-react';
import {
    MRText as Text,
    AvatarImage,
    UIImage
} from '../../components/ui';
import ShowActivityViewIOS from './ShowActivityView';

import user from '../../model/user';
import res from '../mine/res';
import EmptyUtils from '../../utils/EmptyUtils';
import MessageApi from '../message/api/MessageApi';
import ShowFoundView from './ShowFoundView';
import ShowMaterialView from './ShowMaterialView';
import apiEnvironment from '../../api/ApiEnvironment';
import CommShareModal from '../../comm/components/CommShareModal';

const {
    mine_user_icon,
    mine_message_icon_gray
} = res.homeBaseImg;
@observer
export default class ShowListPage extends BasePage {

    $navigationBarOptions = {
        title: '',
        show: false
    };

    static navigationOptions = {};

    state = {
        page: 0,
        left: false,
        pageFocused: false,
        needsExpensive: false,
        showEditorIcon: true,
        hasMessage: false,
        detail:null
    };

    handleBackPress = () => {
        if (this.state.left) {
            return false;
        } else {
            this.$navigate('HomePage');
            return true;
        }
    };

    constructor(props) {
        super(props);
        this.lastStopScrollTime = -1;
    }

    componentDidMount() {
        this.setState({ left: this.params.fromHome });
        this.didBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);

                this.pageFocused = false;
                const { state } = payload;
                if (state && state.routeName === 'HomePage') {
                    this.setState({ isShow: false });
                }
                this.setState({
                    pageFocused: false
                });
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
                const { state } = payload;
                if (state && (state.routeName === 'ShowListPage' || state.routeName === 'show/ShowListPage')) {
                    this.setState({
                        pageFocused: true
                    });
                }
            }
        );
        this.setState({ needsExpensive: true });

        this.listener = DeviceEventEmitter.addListener('contentViewed', this.loadMessageCount);
        this.publishListener = DeviceEventEmitter.addListener('PublishShowFinish', (value) => {
            this._gotoPage(2);
            this.foundList && this.foundList.addDataToTop(value);
        });
    }

    componentWillUnmount() {
        this.didBlurSubscription && this.didBlurSubscription.remove();
        this.didFocusSubscription && this.didFocusSubscription.remove();
        this.listener && this.listener.remove();
        this.publishListener && this.publishListener.remove();
    }


    _gotoPage(number) {
        this.setState({ page: number });
    }

    _onChangeTab(number) {
        this.setState({ page: number.i });
    }

    _onLeftPressed() {
        this.props.navigation.goBack(null);
    }

    jumpToServicePage = () => {
        if (!user.isLogin) {
            this.$navigate('login/login/LoginPage');
            return;
        }
        this.$navigate('message/MessageCenterPage');
    };


    // _press = ({ nativeEvent }) => {
    //     let data = nativeEvent;
    //     // data.click = data.click + 1;
    //     // this.recommendModules.recommendList.replace
    //     this.$navigate('show/ShowDetailPage', { id: data.id, code: data.code });
    // };

    loadMessageCount = () => {
        if (user.token) {
            InteractionManager.runAfterInteractions(() => {
                MessageApi.getNewNoticeMessageCount().then(result => {
                    if (!EmptyUtils.isEmpty(result.data)) {
                        this.setState({
                            hasMessage: result.data.shopMessageCount || result.data.noticeCount || result.data.messageCount
                        });
                    }
                }).catch((error) => {
                    this.setState({
                        hasMessage: false
                    });
                });
            });
        } else {
            this.setState({
                hasMessage: false
            });
        }
    };


    _render() {
        const { page, left, needsExpensive,detail } = this.state;
        let HotView = null;
        if (needsExpensive) {
            HotView = require('./ShowHotView').default;
        }
        let icon = (user.headImg && user.headImg.length > 0) ?
            <AvatarImage source={{ uri: user.headImg }} style={styles.userIcon}
                         borderRadius={px2dp(15)}/> : <Image source={mine_user_icon} style={styles.userIcon}
                                                             borderRadius={px2dp(15)}/>;

        let message = (
            <View>
                <UIImage source={mine_message_icon_gray}
                         style={{ height: px2dp(21), width: px2dp(21) }}
                         onPress={() => this.jumpToServicePage()}/>
                {this.state.hasMessage ? <View style={{
                    width: 10,
                    height: 10,
                    backgroundColor: DesignRule.mainColor,
                    position: 'absolute',
                    top: -3,
                    right: -3,
                    borderRadius: 5
                }}/> : null}

            </View>
        );
        return <View style={styles.container}>
            <View style={styles.header}>
                {
                    left
                        ?
                        <TouchableOpacity style={styles.backImg} onPress={() => this._onLeftPressed()}>
                            <Image source={backIconImg} style={styles.img}/>
                        </TouchableOpacity>
                        :
                        null
                }
                <View style={[{ marginLeft: left ? px2dp(10) : px2dp(15) }]}>
                    {icon}
                </View>
                <View style={{ flex: 1 }}/>
                <View style={styles.titleView}>
                    <TouchableOpacity style={styles.items} onPress={() => this._gotoPage(0)}>
                        <Text style={[page === 0 ? styles.activityIndex : styles.index]}
                              allowFontScaling={false}>推荐</Text>
                        {page === 0 ? <View style={styles.line}/> : null}
                    </TouchableOpacity>
                    <View style={{ width: px2dp(20) }}/>
                    <TouchableOpacity style={[{ marginRight: px2dp(20) }, styles.items]}
                                      onPress={() => this._gotoPage(1)}>
                        <Text style={page === 1 ? styles.activityIndex : styles.index}
                              allowFontScaling={false}>素材圈</Text>
                        {page === 1 ? <View style={styles.line}/> : null}
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.items, { marginRight: px2dp(20) }]}
                                      onPress={() => this._gotoPage(2)}>
                        <Text style={page === 2 ? styles.activityIndex : styles.index}
                              allowFontScaling={false}>发现</Text>
                        {page === 2 ? <View style={styles.line}/> : null}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.items} onPress={() => this._gotoPage(3)}>
                        <Text style={page === 3 ? styles.activityIndex : styles.index}
                              allowFontScaling={false}>活动</Text>
                        {page === 3 ? <View style={styles.line}/> : null}
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}/>
                <View style={{ marginRight: px2dp(15) }}>
                    {message}
                </View>
            </View>
            <ScrollableTabView
                ref={(ref) => this.scrollableTabView = ref}
                style={styles.tab}
                page={this.state.page}
                renderTabBar={() => <DefaultTabBar style={styles.tabBar}/>}
                tabBarUnderlineStyle={styles.underline}
                onChangeTab={(number) => this._onChangeTab(number)}
                showsVerticalScrollIndicator={false}
            >
                <View key={1} style={styles.container} tabLabel="">
                    {
                        needsExpensive
                            ?
                            <HotView navigate={this.$navigate} pageFocus={this.state.pageFocused} onShare={(item)=>{
                                this.setState({detail:item.detail},()=>{
                                    this.shareModal && this.shareModal.open();
                                });

                            }}/>
                            :
                            null
                    }
                </View>
                <View key={2} style={styles.container} tabLabel="   ">
                    {
                        needsExpensive
                            ?
                            <ShowMaterialView navigate={this.$navigate}
                                              onShare={(item)=>{
                                this.setState({detail:item.detail},()=>{
                                    this.shareModal && this.shareModal.open();
                                });

                            }}/>
                            :
                            null

                    }
                </View>

                <View key={3} style={styles.container} tabLabel="   ">
                    {
                        needsExpensive
                            ?
                            <ShowFoundView ref={(ref)=>{this.foundList = ref}} navigate={this.$navigate} pageFocus={this.state.pageFocused}/>
                            :
                            null
                    }
                </View>

                <View key={4} style={styles.container} tabLabel="   ">
                    {
                        needsExpensive
                            ? <ShowActivityViewIOS    ref ={(ref)=>{this.activityList = ref}}
                                                      clickItem={(index,data)=>{
                                                          const  navigate  = this.$navigate;
                                                          let params = {
                                                              data,
                                                              ref: this.activityList,
                                                              index
                                                          };
                                                          if(data.showType === 1){
                                                              navigate('show/ShowDetailPage', params);
                                                          }else {
                                                              navigate('show/ShowRichTextDetailPage', params);
                                                          }
                                                      }}
                                                      navigate={this.$navigate}/> : null
                    }
                </View>
            </ScrollableTabView>
            {detail ?
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                type={'Show'}
                                trackEvent={'ArticleShare'}
                                trackParmas={{ articeCode: detail.code, articleTitle: detail.title }}
                                imageJson={{
                                    imageUrlStr: detail.resource[0]?detail.resource[0].url:null,
                                    titleStr: detail.showType === 1 ? detail.content : detail.title,
                                    QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/discover/newDetail/${detail.showNo}?upuserid=${user.code || ''}`,
                                    headerImage: user.headImg,
                                    userName: (detail.userInfoVO && detail.userInfoVO.userName)? detail.userInfoVO.userName: ''
                                }}
                                webJson={{
                                    title:detail.showType === 1 ? detail.content : detail.title,//分享标题(当为图文分享时候使用)
                                    linkUrl:`${apiEnvironment.getCurrentH5Url()}/discover/newDetail/${detail.showNo}?upuserid=${user.code || ''}`,//(图文分享下的链接)
                                    thumImage:''//(分享图标小图(https链接)图文分享使用)
                                }}
                                miniProgramJson={{
                                    title: detail.title,
                                    dec: '分享小程序子标题',
                                    thumImage: 'logo.png',
                                    hdImageURL: detail.resource[0]?detail.resource[0].url : null,
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/discover/newDetail/${detail.showNo}?upuserid=${user.code || ''}`,
                                    miniProgramPath: `/pages/discover/discover-detail/discover-detail?articleId=${detail.id}&inviteId=${user.code || ''}`
                                }}
                /> :null}

        </View>;
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1
    },
    underline: {
        height: 0
    },
    tab: {
        height: 0,
        borderWidth: 0
    },
    tabBar: {
        height: 0,
        borderWidth: 0
    },
    header: {
        height: ScreenUtils.headerHeight,
        paddingTop: ScreenUtils.statusBarHeight,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    backImg: {
        height: 44,
        width: 45,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    img: {
        height: 15,
        width: 15
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    items: {
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    index: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(13),
        fontWeight: '600'
    },
    activityIndex: {
        color: DesignRule.mainColor,
        fontSize: px2dp(15),
        fontWeight: '600'
    },
    line: {
        backgroundColor: DesignRule.mainColor,
        width: 20,
        height: 2,
        borderRadius: 1
    },
    userIcon: {
        width: px2dp(30),
        height: px2dp(30),
        borderRadius: px2dp(15)
    }
});
