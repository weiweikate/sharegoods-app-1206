import React from 'react';
import BasePage from '../../BasePage';
import WebViewBridge from '@mr/webview';
import { View} from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import CommShareModal from '../../comm/components/CommShareModal';
// import res from '../../comm/res';

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
        if(uri && uri.indexOf('?') > 0){
            realUri = uri + '&ts='+new Date().getTime();
        }else {
            realUri = uri + '?ts='+new Date().getTime();
        }
        this.state = {
            title: title,
            uri: realUri,
            shareParmas: {},
        };

        // this.webJson = {};
        // this.imageJson={};
        // this.miniProgramJson={};
        // this.type = 'nomal';
        // this.trackParmas=null;
        // this.trackEvent= null;
    }

    componentDidMount() {
        this.$NavigationBarResetTitle(this.state.title || '加载中...');
    }

    // $NavigationBarDefaultLeftPressed = () => {
    //     if (!this.canGoBack) {
    //         // this.webView.goBack();
    //         this.$navigateBack();
    //     } else {
    //         this.webView.goBack();
    //     }
    // };


    // $renderSecondLeftItem() {
    //     return (
    //         <TouchableOpacity
    //             style={{
    //                 height: 44,
    //                 width: 44,
    //                 left: 50,
    //                 top: ScreenUtils.statusBarHeight,
    //                 position: 'absolute',
    //                 justifyContent: 'center',
    //             }}
    //             onPress={this.$navigateBack.bind(this)}
    //         >
    //             <Image source={res.button.del_web} style ={{height: 22, width: 22}}/>
    //         </TouchableOpacity>
    //     );
    // }
    _postMessage = (msg) => {
        if (msg.action === 'share'){
            // this.webJson = msg.shareParmas;
            this.setState({shareParmas: msg.shareParmas});
            this.shareModal.open();
        }
    }

    _render() {
        return (
            <View style={{ height:ScreenUtils.height - ScreenUtils.headerHeight, overflow: 'hidden' }}>
                <WebViewBridge
                    style={{ flex: 1 }}
                    ref={(ref) => {
                        this.webView = ref;
                    }}
                    source={{ uri: this.state.uri }}
                    navigateAppPage={(r, p) => {
                        this.$navigate(r, p);
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
                    {...this.state.shareParmas}
                />
            </View>
        );
    }
}

