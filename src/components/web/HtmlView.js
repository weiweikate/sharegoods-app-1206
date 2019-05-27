import React from 'react';
import BasePage from '../../BasePage';
import WebViewBridge from '@mr/webview';
import {
    View,
    Platform,
    Image,
    TouchableOpacity,
    BackHandler
} from 'react-native';
import CommShareModal from '../../comm/components/CommShareModal';
// import res from '../../comm/res';
import apiEnvironment from '../../api/ApiEnvironment';
import RouterMap from '../../navigation/RouterMap';
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

const moreIcon = res.button.message_three;

@SmoothPushHighComponent
@observer
export default class RequestDetailPage extends BasePage {

    // 页面配置
    $navigationBarOptions = {
        title: this.params.title || '加载中...'
    };

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params || {};
        const { uri, title } = params;
        this.canGoBack = false;
        let realUri = '';
        let platform = Platform.OS;
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
                    <Image source={moreIcon}/>
                </TouchableOpacity>
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
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
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
            this.webView.goBack();
        } else {
            this.$navigateBack();
        }
        return true;
    };

    componentWillUnmount() {
        this.willBlurSubscription && this.willBlurSubscription.remove();
    }

    successCallBack = (type)=>{
        if(type === 'reload'){
            this.webView && this.webView.reload();
        }
        if(type === 'shareSuccess'){
            this.webView && this.webView.sendToBridge(JSON.stringify({ action: 'shareSuccess' }));
        }
    };

    _postMessage = (msg) => {
        if (msg.action === 'share') {
            // this.webJson = msg.shareParmas;
            this.setState({ shareParmas:msg.shareParams || msg.shareParmas }, () => {
                this.shareModal && this.shareModal.open();
            });
            return;
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

        if (msg.action === 'exitShowAlert') {
            this.webType = 'exitShowAlert';
            let parmas = msg.params || {};
            this.manager.getAd(parmas.showPage, parmas.showPageValue, homeType.Alert);
            return;
        }

        if (msg.action === 'showFloat') {
            let parmas = msg.params || {};
            this.luckyIcon && this.luckyIcon.getLucky(parmas.showPage, parmas.showPageValue);
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
                    originWhitelist={['(.*?)']}
                    source={{ uri: this.state.uri }}
                    navigateAppPage={(r, p) => {
                        if (r.length > 0) {
                            let routerKey = r.split('/').pop();
                            r = RouterMap[routerKey] || r;
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

                    // onLoadStart={() => this._onLoadStart()}
                    onLoadEnd={(event) => {
                        if (event && event.nativeEvent) {
                            this.canGoBack = event.nativeEvent.canGoBack;
                            this.$NavigationBarResetTitle(this.state.title || event.nativeEvent.title);
                        }
                    }}
                    postMessage={msg => this._postMessage(msg)}
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
                }} />
            </View>
        );
    }
}

