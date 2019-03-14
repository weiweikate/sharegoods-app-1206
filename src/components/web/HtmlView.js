import React from "react";
import BasePage from "../../BasePage";
import WebViewBridge from "@mr/webview";
import { View,
    Platform
} from 'react-native';
import CommShareModal from "../../comm/components/CommShareModal";
// import res from '../../comm/res';
import apiEnvironment from "../../api/ApiEnvironment";
import RouterMap from "../../navigation/RouterMap";
import { autorun } from "mobx";
import user from "../../model/user";
import { observer } from "mobx-react";
import DeviceInfo from 'react-native-device-info';

@observer
export default class RequestDetailPage extends BasePage {

    // 页面配置
    $navigationBarOptions = {
        title: this.params.title || "加载中..."
    };

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params || {};
        const { uri, title } = params;
        this.canGoBack = false;
        let realUri = "";
        let platform = Platform.OS;
        let app_version = DeviceInfo.getVersion();
        let app_name =  DeviceInfo.getBundleId();
        let parmasString = "platform="+platform +
            '&app_version='+app_version+
            '&app_name='+app_name +
            "&ts=" + new Date().getTime();
         //拼参数
        if (uri && uri.indexOf("?") > 0) {
            if (uri.charAt(uri.length-1,1) !== '?') {
                realUri = uri + "&"
            }else {
                realUri = uri;
            }
        } else {
            realUri = uri + "?"
        }
        realUri = realUri + parmasString;
        //如果没有http，就加上当前h5的域名
        if (realUri.indexOf("http") === -1) {
            realUri = apiEnvironment.getCurrentH5Url() + realUri;
        }
        this.state = {
            title: title,
            uri: realUri,
            shareParmas: {}
        };

    }

    autoRun = autorun(() => {
        user.token ? (this.webView && this.webView.reload()):null
    });

    componentDidMount() {
        this.$NavigationBarResetTitle(this.state.title || "加载中...");
    }

    _postMessage = (msg) => {
        if (msg.action === "share") {
            // this.webJson = msg.shareParmas;
            this.setState({ shareParmas: msg.shareParmas });
            this.shareModal.open();
            return;
        }

        if (msg.action === "backToHome") {
            this.$navigateBackToHome();
            return;
        }
    };

    _render() {
        return (
            <View style={{ flex: 1, overflow: "hidden" }}>
                <WebViewBridge
                    style={{ flex: 1 }}
                    ref={(ref) => {
                        this.webView = ref;
                    }}
                    originWhitelist={["(.*?)"]}
                    source={{ uri: this.state.uri }}
                    navigateAppPage={(r, p) => {
                        if (r.length > 0) {
                            let routerKey = r.split("/").pop();
                            r = RouterMap[routerKey] || r;
                        }
                        this.$navigate(r, p);
                    }}
                    onNavigationStateChange={event => {
                        this.canGoBack = event.canGoBack;
                        this.$NavigationBarResetTitle(this.state.title || event.title);
                    }}
                    onError={event => {
                        this.canGoBack = event.canGoBack;
                        this.$NavigationBarResetTitle("加载失败");
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

