import React, {Component} from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    ScrollView,
    InteractionManager,
} from 'react-native';
import API from "../../api/index";
import {PageLoadingState} from '../../components/pageDecorator/PageState';
import NetImg from '../../components/pageDecorator/BaseView/source/no_data.png';

export default class DemoListPage extends Component {

    // 页面配置
    static $PageOptions = {
        navigationBarOptions: {
            title: 'demo',
            // show: false
        },
        // 是否启动状态管理
        renderByPageState: true,
    };

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            // 网络请求失败配置
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                style: netStyles.container,
                source: NetImg,
                reloadBtnClick: () => {
                    console.log('reload');
                    this.setState({
                        netFailedInfo: null,
                        loadingState: PageLoadingState.loading,
                    }, this.loadPageData);
                },
            },
            // 数据加载配置
            loadingProps: {},
            // 数据为空配置
            emptyProps: {},
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            refreshing: false,
            netFailedInfo: null,
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(this.loadPageData);
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text>这是个demo</Text>
                <View>
                    <Button onPress={this.showToast} title={'show toast'} />
                </View>
                <View>
                    <Button onPress={this.hideToast} title={'hide toast'} />
                </View>
                {/*<View>
                    <Button onPress={this.loadData} title={'load data'}></Button>
                </View>*/}
            </ScrollView>
        );
    }

    showToast = () => {
        // 默认2.5s
        this.$toastShow('我会在三秒后消失的', {
            duration: 3, toastHiddenCallBack: () => {
                console.log('ok');
            }
        });
    };
    hideToast = () => {
        this.$toastDismiss();
    };
    loadPageData = () => {

        API.apiDemoList({a: 1}).then(result => {
            console.log('response success', result);
            let data = result.data || [];
            // 为了demo效果 延时加载
            setTimeout(() => {
                if (data.length) {
                    this.setState({
                        netFailedInfo: null,
                        loadingState: PageLoadingState.success,
                    });
                } else {
                    // 数据为空
                    this.setState({
                        netFailedInfo: null,
                        loadingState: PageLoadingState.empty,
                    });
                }

            }, 1000);
        }).catch(error => {
            console.log('response error', error);
            // 为了demo效果 延时加载
            setTimeout(() => {
                this.setState({
                    netFailedInfo: error,
                    loadingState: PageLoadingState.fail,
                });
            }, 1000);
        });
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
const netStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#999999',
    }
});
