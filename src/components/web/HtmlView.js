import React from 'react';
import BasePage from '../../BasePage';
import WebViewBridge from '@mr/webview';
import { BackHandler, Image, Platform, TouchableOpacity, View } from 'react-native';
import CommShareModal from '../../comm/components/CommShareModal';
// import res from '../../comm/res';
import apiEnvironment from '../../api/ApiEnvironment';
import RouterMap, { routeNavigate, GoToTabItem } from '../../navigation/RouterMap';
import { autorun } from 'mobx';
import user from '../../model/user';
import { observer } from 'mobx-react';
import DeviceInfo from 'react-native-device-info';
import res from '../../comm/res';
import ScreenUtils from '../../utils/ScreenUtils';
import Manager, { AdViewBindModal } from './WebModalManager';
import SmoothPushHighComponent from '../../comm/components/SmoothPushHighComponent';
import ShareUtil from '../../utils/ShareUtil';
import { homeType } from '../../pages/home/HomeTypes';
import LuckyIcon from '../../pages/guide/LuckyIcon';
import GroupSelectModel from '../../pages/mine/page/spellGroup/components/GroupSelectModel';

const moreIcon = res.button.message_three;
const btn_group = res.button.btn_group;
const share_group = res.button.share_group;

@SmoothPushHighComponent
@observer
export default class RequestDetailPage extends BasePage {

    // 页面配置
    $navigationBarOptions = {
        title: this.params.title || '加载中...',
        show: !(this.props.params || {}).unShow
    };

    constructor(props) {
        super(props);
        const params = this.props.params || this.params || {};
        let { uri, title } = params;
        uri = decodeURIComponent(uri);
        this.canGoBack = false;
        let realUri = '';
        let platform = Platform.OS;
        this.openShareModal = params.openShareModal || false;
        let app_version = DeviceInfo.getVersion();
        let app_name = DeviceInfo.getBundleId();
        let parmasString = 'platform=' + platform +
            '&app_version=' + app_version +
            '&app_name=' + app_name +
            '&ts=' + new Date().getTime();
        //拼参数
        if (uri && uri.indexOf('?') > 0) {
            if (uri.charAt(uri.length - 1, 1) !== '?') {
                realUri = uri + '&';
            } else {
                realUri = uri;
            }
        } else {
            realUri = uri + '?';
        }
        realUri = realUri + parmasString;
        if (realUri.indexOf('http') === -1 && realUri.charAt(0) !== '/') {
            realUri = '/' + realUri;
        }
        //如果没有http，就加上当前h5的域名
        if (realUri.indexOf('http') === -1) {
            realUri = apiEnvironment.getCurrentH5Url() + realUri;
        }

        this.state = {
            title: title,
            uri: realUri,
            shareParmas: {},
            hasRightItem: false
        };
        this.manager = new Manager();
        this.WebAdModal = observer(AdViewBindModal(this.manager));
    }

    $NavigationBarDefaultLeftPressed = () => {
        if (this.webType === 'exitShowAlert') {
            this.manager.showAd(() => {
                this.handleBackPress();
            });
        } else {
            this.handleBackPress();
        }
    };

    $NavBarRenderRightItem = () => {
        if (this.state.hasRightItem === true) {
            return (
                <TouchableOpacity onPress={this.showMore} style={{
                    width: ScreenUtils.px2dp(40),
                    height: ScreenUtils.px2dp(44),
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image source={moreIcon} style={{ width: 22 }}
                           resizeMode={'contain'}/>
                </TouchableOpacity>
            );
        } else if (this.state.hasRightItem === 'showGroupRightItem') {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            routeNavigate(RouterMap.SpellGroupList);
                        }}
                        style={{
                            width: ScreenUtils.px2dp(40),
                            height: ScreenUtils.px2dp(44),
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Image source={btn_group} style={{ width: 22, height: ScreenUtils.px2dp(44) }}
                               resizeMode={'contain'}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={this.showMore}
                        style={{
                            width: ScreenUtils.px2dp(40),
                            height: ScreenUtils.px2dp(44),
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Image source={share_group} style={{ width: 22, height: ScreenUtils.px2dp(44) }}
                               resizeMode={'contain'}/>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return <View/>;
        }

    };
    showMore = () => {
        this.webView && this.webView.sendToBridge(JSON.stringify({ action: 'clickRightItem' }));
    };

    clickShareBtn = () => {
        this.webView && this.webView.sendToBridge(JSON.stringify({ action: 'clickShareBtn' }));
    };

    autoRun = autorun(() => {
        user.token ? (this.webView && this.webView.reload()) : null;
    });

    componentDidMount() {
        let isFirst = true;
        this.willFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
                if (!isFirst) {
                    this.webView && this.webView.sendToBridge(JSON.stringify({ action: 'entry' }));
                }
                isFirst = false;
            }
        );

        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
            }
        );
        this.$NavigationBarResetTitle(this.state.title || '加载中...');
    }

    handleBackPress = () => {
        if (this.canGoBack) {
            this.webView && this.webView.goBack();
        } else {
            this.$navigateBack();
        }
        return true;
    };

    componentWillUnmount() {
        this.willBlurSubscription && this.willBlurSubscription.remove();
        this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    successCallBack = (type) => {
        if (type === 'reload') {
            this.webView && this.webView.reload();
        }
        if (type === 'shareSuccess') {
            this.webView && this.webView.sendToBridge(JSON.stringify({ action: 'shareSuccess' }));
        }
    };

    _onLoadStart() {
        this.state.hasRightItem = false;
        this.$renderSuperView();//为了触发render
    }

    _postMessage = (msg) => {
        if (msg.action === 'share') {
            // this.webJson = msg.shareParmas;
            if ((msg.shareParams && msg.shareParams.type && msg.shareParams.type === 'Group') ||
                (msg.shareParmas && msg.shareParmas.type && msg.shareParmas.type === 'Group')) {

                this.setState({ shareParmas: msg.shareParams || msg.shareParmas }, () => {
                    this.SelectModel && this.SelectModel.onOpen();
                });
                return;
            } else {
                this.setState({ shareParmas: msg.shareParams || msg.shareParmas }, () => {
                    this.shareModal && this.shareModal.open();
                });
                return;
            }
        }

        if (msg.action === 'onShare') {
            let { data, api, trackParmas, trackEvent } = msg.onShareParmas || {};
            ShareUtil.onShare(data, api, trackParmas, trackEvent, this.successCallBack);
            return;
        }

        if (msg.action === 'backToHome') {
            this.$navigateBackToHome();
            return;
        }

        if (msg.action === 'showRightItem') {
            this.state.hasRightItem = true;
            this.$renderSuperView();//为了触发render
            return;
        }

        //拼团h5页面 导航栏右边按钮样式替换
        if (msg.action === 'showGroupRightItem') {
            this.state.hasRightItem = 'showGroupRightItem';
            this.$renderSuperView();//为了触发render
            return;
        }


        if (msg.action === 'exitShowAlert') {
            this.webType = 'exitShowAlert';
            let parmas = msg.params || {};
            this.manager.getAd(parmas.showPage, parmas.showPageValue, homeType.Alert, this.currentUrl);
            return;
        }

        if (msg.action === 'showFloat') {
            let parmas = msg.params || {};
            this.luckyIcon && this.luckyIcon.getLucky(parmas.showPage, parmas.showPageValue, this.currentUrl);
            return;
        }

        if (msg.action === 'changeTitle') {
            let parmas = msg.params || {};
            this.state.title = parmas.title;
            this.$NavigationBarResetTitle(parmas.title);
            return;
        }
    };

    _render() {
        let WebAdModal = this.WebAdModal;
        return (
            <View style={{ flex: 1, overflow: 'hidden' }}>
                <WebViewBridge
                    style={{ flex: 1 }}
                    ref={(ref) => {
                        this.webView = ref;
                    }}
                    mixedContentMode={'always'}
                    originWhitelist={['(.*?)']}
                    source={{ uri: this.state.uri }}
                    navigateAppPage={(r, p) => {
                        if (r.length > 0) {
                            let routerKey = r.split('/').pop();
                            r = RouterMap[routerKey] || r;
                            if (routerKey === 'Mine') {
                                GoToTabItem(4);
                                return;
                            } else if (routerKey === 'SpellGroupList') {
                                routeNavigate(r);
                                return;
                            }
                        }
                        this.$navigate(r, p);
                    }}
                    onScrollBeginDrag={() => {//这个方法原生还没桥接过来
                        this.luckyIcon && this.luckyIcon.close();
                    }}
                    onNavigationStateChange={event => {
                        this.canGoBack = event.canGoBack;
                        this.$NavigationBarResetTitle(this.state.title || event.title);
                    }}
                    onError={event => {
                        if (event && event.nativeEvent) {
                            this.canGoBack = event.nativeEvent.canGoBack;
                        }
                        this.$NavigationBarResetTitle('加载失败');
                    }}


                    onLoadStart={() => this._onLoadStart()}
                    onLoadEnd={(event) => {
                        if (this.openShareModal) {
                            this.openShareModal = false;
                            this.webView && this.webView.sendToBridge(JSON.stringify({ action: 'openShareModal' }));
                        }
                        if (event && event.nativeEvent) {
                            this.canGoBack = event.nativeEvent.canGoBack;
                            this.$NavigationBarResetTitle(this.state.title || event.nativeEvent.title);
                            this.currentUrl = event.nativeEvent.url;
                        }
                    }}
                    postMessage={msg => this._postMessage(msg)}
                />
                <GroupSelectModel
                    ref={(ref) => {
                        this.SelectModel = ref;
                    }}
                    data={this.state.shareParmas}
                    createAD={(data) => {
                        console.log('createAD', data);
                        this.setState({
                            shareParmas: data
                        }, () => {
                            this.shareModal && this.shareModal.open();
                        });
                    }}
                    inviteShare={(data) => {
                        console.log('inviteShare', data);
                        this.setState({
                            shareParmas: data
                        }, () => {
                            this.shareModal && this.shareModal.open();
                        });
                    }}

                />
                <CommShareModal
                    ref={(ref) => this.shareModal = ref}
                    successCallBack={this.successCallBack}
                    clickShareBtn={() => {
                        this.clickShareBtn && this.clickShareBtn();
                    }}
                    {...this.state.shareParmas}
                />
                <WebAdModal/>
                <LuckyIcon ref={(ref) => {
                    this.luckyIcon = ref;
                }}/>
            </View>
        );
    }
}

