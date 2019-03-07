import React from 'react';
import BasePage from '../../BasePage';
import WebViewBridge from '@mr/webview';
import { View } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import CommShareModal from '../../comm/components/CommShareModal';
// import res from '../../comm/res';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import apiEnvironment from '../../api/ApiEnvironment';

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
        if (uri && uri.indexOf('?') > 0) {
            realUri = uri + '&ts=' + new Date().getTime();
        } else {
            realUri = uri + '?ts=' + new Date().getTime();
        }
        if (realUri.indexOf('http') === -1){
            realUri =  apiEnvironment.getCurrentH5Url() + realUri;
        }
        this.state = {
            title: title,
            uri: realUri,
            shareParmas: {}
        };
    }

    componentDidMount() {
        this.$NavigationBarResetTitle(this.state.title || '加载中...');
    }

    _postMessage = (msg) => {
        if (msg.action === 'share') {
            // this.webJson = msg.shareParmas;
            this.setState({ shareParmas: msg.shareParmas });
            this.shareModal.open();
            return;
        }

        if (msg.action === 'backToHome') {
            this.$navigateBackToHome();
            return;
        }
    };

    _render() {
        let height = ScreenUtils.height - ScreenUtils.headerHeight;
        if (ScreenUtils.isAllScreenDevice && !ScreenUtils.getBarShow()) {
            height = ExtraDimensions.get('REAL_WINDOW_HEIGHT') - ScreenUtils.headerHeight;
        } else if (ScreenUtils.isAllScreenDevice && ScreenUtils.getBarShow()) {
            if (ScreenUtils.getHasNotchScreen()) {
                height = ScreenUtils.height - 44;
            } else {
                height = ScreenUtils.height - 44 - ExtraDimensions.get('STATUS_BAR_HEIGHT');
            }
        }
        return (
            <View style={{ height, overflow: 'hidden' }}>
                <WebViewBridge
                    style={{ flex: 1 }}
                    ref={(ref) => {
                        this.webView = ref;
                    }}
                    originWhitelist={['(.*?)']}
                    source={{ uri: this.state.uri }}
                    navigateAppPage={(r, p) => {
                        if (r === 'login/login/LoginPage') {
                            this.$navigate(r, {
                                ...p, callback: () => {
                                    this.webView && this.webView.reload();
                                }
                            });
                        } else {
                            this.$navigate(r, p);
                        }
                    }}
                    onNavigationStateChange={event => {
                        this.canGoBack = event.canGoBack;
                        this.$NavigationBarResetTitle(this.state.title || event.title);
                    }}
                    onError={event => {
                        this.canGoBack = event.canGoBack;
                        this.$NavigationBarResetTitle('加载失败');
                    }}

                    // onLoadStart={() => this._onLoadStart()}
                    onLoadEnd={(event) => {
                        this.canGoBack = event.canGoBack;
                    }}
                    postMessage={msg => this._postMessage(msg)}
                />
                <CommShareModal
                    ref={(ref) => this.shareModal = ref}
                    reloadWeb={() => {
                        this.webView && this.webView.reload();
                    }}
                    {...this.state.shareParmas}
                />
            </View>
        );
    }
}

