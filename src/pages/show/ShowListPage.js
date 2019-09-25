import React from 'react';
import {
    BackHandler,
    DeviceEventEmitter,
    Image,
    InteractionManager,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import BasePage from '../../BasePage';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from '../../constants/DesignRule';
import { observer } from 'mobx-react';
import { AvatarImage, MRText as Text, UIImage } from '../../components/ui';
import ShowActivityViewIOS from './ShowActivityView';

import user from '../../model/user';
import res from '../mine/res';
import EmptyUtils from '../../utils/EmptyUtils';
import ShareUtil from '../../utils/ShareUtil';
import MessageApi from '../message/api/MessageApi';
import ShowFoundView from './ShowFoundView';
import ShowMaterialView from './ShowMaterialView';
import apiEnvironment from '../../api/ApiEnvironment';
// import CommShareModal from '../../comm/components/CommShareModal';
import CommShowShareModal from '../../comm/components/CommShowShareModal';

import WhiteModel from './model/WhiteModel';
import ShowListIndexModel from './model/ShowListIndexModel';
import { IntervalMsgView, IntervalType } from '../../comm/components/IntervalMsgView';
import RouterMap, { routeNavigate } from '../../navigation/RouterMap';
import { track, trackEvent } from '../../utils/SensorsTrack';
import ShowUtils from './utils/ShowUtils';

const { px2dp } = ScreenUtils;

const {
    mine_message_icon_gray
} = res.homeBaseImg;
const { icon_header_back } = res.button;

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
        detail: null
    };

    handleBackPress = () => {
        if (this.state.left) {
            return false;
        } else {
            this.$navigateBackToHome();
            return true;
        }
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setState({ left: this.params.fromHome });
        this.didBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);

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
                if (user.isLogin) {
                    WhiteModel.saveWhiteType();
                }
                this.loadMessageCount();
                const { state } = payload;
                if (state && (state.routeName === 'ShowListPage' || state.routeName === 'show/ShowListPage')) {
                    this.setState({
                        pageFocused: true
                    });

                    track(trackEvent.ViewXiuChang, {
                        xiuChangListType: ShowListIndexModel.pageIndex + 1
                    });
                }
            }
        );
        this.setState({ needsExpensive: true });

        this.listener = DeviceEventEmitter.addListener('contentViewed', this.loadMessageCount);
        this.publishListener = DeviceEventEmitter.addListener('PublishShowFinish', (index) => {
            if (index !== -1) {
                this._gotoPage(index);
            }
        });
        this.listenerRetouchShow = DeviceEventEmitter.addListener('retouch_show', this.retouchShow);
    }

    componentWillUnmount() {
        this.didBlurSubscription && this.didBlurSubscription.remove();
        this.didFocusSubscription && this.didFocusSubscription.remove();
        this.listener && this.listener.remove();
        this.publishListener && this.publishListener.remove();
        this.listenerRetouchShow && this.listenerRetouchShow.remove();
    }

    retouchShow = () => {
        switch (ShowListIndexModel.pageIndex) {
            case 0:
                this.attention && this.attention.scrollToTop();
                break;
            case 1:
                this.hotList && this.hotList.scrollToTop();
                break;
            case 2:
                this.materialList && this.materialList.scrollToTop();
                break;
            case 3:
                this.foundList && this.foundList.scrollToTop();
                break;
            case 4:
                this.activityList && this.activityList.scrollToTop();
                break;
        }
    };


    _gotoPage(number) {
        // this.setState({ page: number });
        ShowListIndexModel.setIndex(number);
    }

    _onChangeTab(number) {
        ShowListIndexModel.setIndex(number.i);

        // this.setState({ page: number.i });
    }

    _onLeftPressed() {
        this.props.navigation.goBack(null);
    }

    jumpToServicePage = () => {
        if (!user.isLogin) {
            routeNavigate(RouterMap.LoginPage);
            return;
        }
        routeNavigate(RouterMap.MessageCenterPage);
    };

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


    _setDetail = (detail, showText) => {
        this.setState({ detail: null }, () => {
            this.setState({
                detail,
                showText
            }, () => {
                this.shareModal && this.shareModal.open();
            });
        });
    };

    _goMyDynamicPage = () => {
        if (!user.isLogin) {
            this.$navigate(RouterMap.LoginPage);
            return;
        }
        this.$navigate(RouterMap.MyDynamicPage, { userType: WhiteModel.userStatus === 2 ? 'mineWriter' : 'mineNormal' });
    };

    _render() {
        const { left, needsExpensive, detail } = this.state;
        let HotView = null;
        let AttentionView = null;
        if (needsExpensive) {
            HotView = require('./ShowHotView').default;
            AttentionView = Platform.OS === 'ios' ? HotView : require('./ShowAttentionPage').default;
        }
        let icon = (user.headImg && user.headImg.length > 0) ?
            <AvatarImage source={{ uri: user.headImg }} style={styles.userIcon}
                         borderRadius={px2dp(15)}/> :
            <Image source={res.placeholder.avatar_default} style={styles.userIcon}
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
                        <TouchableOpacity activeOpacity={0.7} style={styles.backImg}
                                          onPress={() => this._onLeftPressed()}>
                            <Image source={icon_header_back} style={{ width: 30, height: 30 }}/>
                        </TouchableOpacity>
                        :
                        null
                }
                <TouchableWithoutFeedback onPress={this._goMyDynamicPage}>
                    <View style={[{ marginLeft: left ? px2dp(5) : px2dp(15) }]}>
                        {icon}
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ flex: 1 }}/>
                <View style={styles.titleView}>
                    <TouchableOpacity activeOpacity={0.7} style={[styles.items, { marginRight: px2dp(20) }]}
                                      onPress={() => this._gotoPage(0)}>
                        <Text style={[ShowListIndexModel.pageIndex === 0 ? styles.activityIndex : styles.index]}
                              allowFontScaling={false}>关注</Text>
                        {ShowListIndexModel.pageIndex === 0 ? <View style={styles.line}/> : null}
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} style={styles.items} onPress={() => this._gotoPage(1)}>
                        <Text style={[ShowListIndexModel.pageIndex === 1 ? styles.activityIndex : styles.index]}
                              allowFontScaling={false}>推荐</Text>
                        {ShowListIndexModel.pageIndex === 1 ? <View style={styles.line}/> : null}
                    </TouchableOpacity>
                    <View style={{ width: px2dp(20) }}/>
                    <TouchableOpacity activeOpacity={0.7} style={[{ marginRight: px2dp(20) }, styles.items]}
                                      onPress={() => this._gotoPage(2)}>
                        <Text style={ShowListIndexModel.pageIndex === 2 ? styles.activityIndex : styles.index}
                              allowFontScaling={false}>素材圈</Text>
                        {ShowListIndexModel.pageIndex === 2 ? <View style={styles.line}/> : null}
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.7} style={[styles.items, { marginRight: px2dp(20) }]}
                                      onPress={() => this._gotoPage(3)}>
                        <Text style={ShowListIndexModel.pageIndex === 3 ? styles.activityIndex : styles.index}
                              allowFontScaling={false}>发现</Text>
                        {ShowListIndexModel.pageIndex === 3 ? <View style={styles.line}/> : null}
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.7} style={styles.items} onPress={() => this._gotoPage(4)}>
                        <Text style={ShowListIndexModel.pageIndex === 4 ? styles.activityIndex : styles.index}
                              allowFontScaling={false}>活动</Text>
                        {ShowListIndexModel.pageIndex === 4 ? <View style={styles.line}/> : null}
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
                initialPage={1}
                page={ShowListIndexModel.pageIndex}
                renderTabBar={() => <DefaultTabBar style={styles.tabBar}/>}
                tabBarUnderlineStyle={styles.underline}
                onChangeTab={(number) => this._onChangeTab(number)}
                showsVerticalScrollIndicator={false}
            >
                <View key={0} style={styles.container} tabLabel="">
                    {
                        needsExpensive
                            ?
                            <AttentionView ref={(ref) => {
                                this.attention = ref;
                            }}
                                           type={'attention'}
                                           uri={'/social/show/content/page/query/attention@GET'}
                                           hasBanner={false}
                                           navigate={this.$navigate}
                                           pageFocus={this.state.pageFocused}
                                           onShare={(item, showText) => {
                                               this._setDetail(item.detail, showText);
                                           }}/>
                            :
                            null
                    }
                </View>
                <View key={1} style={styles.container} tabLabel="">
                    {
                        needsExpensive
                            ?
                            <HotView ref={(ref) => {
                                this.hotList = ref;
                            }}
                                     hasBanner={true}
                                     type={'recommend'}
                                     uri={'/social/show/content/page/query@GET'}
                                     navigate={this.$navigate}
                                     pageFocus={this.state.pageFocused}
                                     onShare={(item, showText) => {
                                         this._setDetail(item.detail, showText);
                                     }}/>
                            :
                            null
                    }
                </View>
                <View key={2} style={styles.container} tabLabel="   ">
                    {
                        needsExpensive
                            ?
                            <ShowMaterialView
                                ref={(ref) => {
                                    this.materialList = ref;
                                }}
                                navigate={this.$navigate}
                                onShare={(item, showText) => {
                                    this._setDetail(item.detail, showText);
                                }}/>
                            :
                            null

                    }
                </View>

                <View key={3} style={styles.container} tabLabel="   ">
                    {
                        needsExpensive
                            ?
                            <ShowFoundView ref={(ref) => {
                                this.foundList = ref;
                            }} navigate={this.$navigate} pageFocus={this.state.pageFocused}/>
                            :
                            null
                    }
                </View>

                <View key={4} style={styles.container} tabLabel="   ">
                    {
                        needsExpensive
                            ? <ShowActivityViewIOS ref={(ref) => {
                                this.activityList = ref;
                            }}
                                                   clickItem={(index, data) => {
                                                       const navigate = this.$navigate;
                                                       let params = {
                                                           data,
                                                           ref: this.activityList,
                                                           index
                                                       };
                                                       if (data.showType === 1) {
                                                           navigate(RouterMap.ShowDetailPage, params);
                                                       } else if (data.showType === 3) {
                                                           navigate(RouterMap.ShowVideoPage, { code: data.showNo });
                                                       } else if (data.showType === 4) {
                                                           navigate(RouterMap.TagDetailPage, {
                                                               tagId: data.tagId,
                                                               name: data.tagName
                                                           });
                                                       } else {
                                                           navigate(RouterMap.ShowRichTextDetailPage, params);
                                                       }
                                                       const { showNo, userInfoVO } = data;
                                                       const { userNo } = userInfoVO || {};
                                                       track(trackEvent.XiuChangEnterClick, {
                                                           xiuChangListType: 4,
                                                           articleCode: showNo,
                                                           author: userNo,
                                                           xiuChangEnterBtnName: '秀场列表'
                                                       });
                                                   }}
                                                   navigate={this.$navigate}/> : null
                    }
                </View>
            </ScrollableTabView>
            <IntervalMsgView pageType={IntervalType.xiuChang}/>
            {detail ?
                <CommShowShareModal ref={(ref) => this.shareModal = ref}
                                    shareName={detail && detail.userInfoVO && detail.userInfoVO.userName}
                                    type={ShareUtil.showSharedetailDataType(detail && detail.showType, this.state.showText)}
                                    trackEvent={trackEvent.XiuChangShareClick}
                                    trackParmas={{
                                        articleCode: detail.code,
                                        author: (detail.userInfoVO || {}).userNo,
                                        xiuChangBtnLocation: '1',
                                        xiuChangListType: ShowListIndexModel.pageIndex + 1
                                    }}
                                    imageJson={{
                                        imageType: 'show',
                                        imageUrlStr: ShowUtils.getCover(detail),
                                        titleStr: detail.showType === 1 ? detail.content : detail.title,
                                        QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/discover/newDetail/${detail.showNo}?upuserid=${user.code || ''}`,
                                        headerImage: (detail.userInfoVO && detail.userInfoVO.userImg) ? detail.userInfoVO.userImg : null,
                                        userName: (detail.userInfoVO && detail.userInfoVO.userName) ? detail.userInfoVO.userName : '',
                                        dec: '好物不独享，内有惊喜福利~'
                                    }}
                                    taskShareParams={{
                                        uri: `${apiEnvironment.getCurrentH5Url()}/discover/newDetail/${detail.showNo}?upuserid=${user.code || ''}`,
                                        code: detail.showType === 1 ? 22 : 25,
                                        data: detail.showNo
                                    }}
                                    webJson={{
                                        title: detail.title || '秀一秀 赚到够',//分享标题(当为图文分享时候使用)
                                        linkUrl: `${apiEnvironment.getCurrentH5Url()}/discover/newDetail/${detail.showNo}?upuserid=${user.code || ''}`,//(图文分享下的链接)
                                        thumImage: ShowUtils.getCover(detail),//(分享图标小图(https链接)图文分享使用)
                                        dec: '好物不独享，内有惊喜福利~'
                                    }}
                /> : null}

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
        paddingLeft: 10,
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
        justifyContent: 'center',
        height: 44
    },
    index: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(13),
        fontWeight: '500'
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
        borderRadius: 1,
        position: 'absolute',
        bottom: 0
    },
    userIcon: {
        width: px2dp(30),
        height: px2dp(30),
        borderRadius: px2dp(15)
    }
});
