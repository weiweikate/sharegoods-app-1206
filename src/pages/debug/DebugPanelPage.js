/**
 * Created by nuomi on 2018/7/18.
 */
import React from 'react';
import {
    View,
    Text,
    Platform,
    StyleSheet,
    ScrollView,
    Dimensions,
    Button,
    TouchableHighlight
} from 'react-native';
import GeneralButton from '../../components/pageDecorator/BaseView/GeneralButton';

//const {commModule} = NativeModules;
import user from '../../model/user';
import apiEnvironment from '../../api/ApiEnvironment';
import { NavigationActions } from 'react-navigation';
import { observer } from 'mobx-react';
import BasePage from '../../BasePage';

@observer
export default class DebugPanelPage extends BasePage {

    // 页面配置
    $navigationBarOptions = {
        title: '环境配置'
    };

    constructor(props) {
        super(props);
        this.state = {
            key: this.props.navigation.state.key,
            nickName: 'test',
            loadingState: 'fail',
            hostName: apiEnvironment.getCurrentHostName(),
            hostUrl: apiEnvironment.getCurrentHostUrl(),
            hostAllCase: Object.keys(apiEnvironment.getAllHostCase())
        };
        console.log(111111, this.props.navigation.state.key);
    }

    changeState = () => {
        this.setState({
            nickName: 'sssss'
        });
        this.$navigateBack(-2);
    };
    // 点击切换环境
    onClickChange = async envType => {
        const host = apiEnvironment.isHostExistWithEnvType(envType);
        if (!host) {
            alert('当前环境host暂未配置~\n暂不支持设置');
            return;
        }
        await user.clearUserInfo();
        await apiEnvironment.saveEnv(envType);
        this.setState({
            hostName: apiEnvironment.getCurrentHostName(),
            hostUrl: apiEnvironment.getCurrentHostUrl()
        });
        console.log({
            hostName: apiEnvironment.getCurrentHostName(),
            hostUrl: apiEnvironment.getCurrentHostUrl()
        });
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Tab' })]
        });
        this.props.navigation.dispatch(resetAction);

    };

    // 跳转HTTP请求历史记录页面
    goToFetchHistoryPage = () => {
        this.props.navigation.navigate('debug/FetchHistoryPage');
    };

    // 跳转到user
    goToUserPage = () => {
        this.props.navigation.navigate('debug/UserInfoPage');
    };

    // 跳转到工具调试页面
    goToToolDebugging = () => {
        this.props.navigation.navigate('debug/ToolDebugPage');
    };
    goToDemo = () => {
        this.props.navigation.navigate('debug/DemoListPage');
    };


    // 打开ios沙盒目录预览
    openIOSDiskDir = () => {
        //Platform.OS === 'ios' && commModule && commModule.openSandBoxPreview();
    };

    /* -----------------渲染切换按钮以及切换按钮内部逻辑------------------------------*/
    renderChangeEnvButton = Arr =>
        Arr.map(item => (
            <GeneralButton
                key={item.title}
                style={styles.buttonStyle}
                title={item.title}
                click={() => {
                    this.onClickChange(item.envType);
                }}
            />
        ));

    // 渲染行
    renderRow = params => (
        <View key={params.index} style={[styles.rowCell, { justifyContent: 'space-between' }]}>
            <Text style={styles.descText}>{params.title}</Text>
            <Text selectable numberOfLines={0} style={styles.urlText}>
                {params.value}
            </Text>
        </View>
    );

    renderLinks = Arr =>
        Arr.map((item, index) => {
            item.index = index;
            return this.renderRow(item);
        });


    renderEventRows = EventArr =>
        EventArr.map(item => {
            const { title, onPress } = item;
            return (
                <View key={item.title} style={styles.rowCell}>
                    <TouchableHighlight
                        style={{ flex: 1 }}
                        underlayColor="#e6e6e6"
                        onPress={onPress}
                    >
                        <View style={styles.eventRowsContainer}>
                            <Text style={{ color: '#474747' }}>{title}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            );
        });

    _render() {
        const TopTitle =
            '不同Host接口下，数据信息可能不同。' +
            '\n切换Host会自动清空必要缓存以及cookie数据。' +
            '\n部分Host下仅支持内网wifi访问。' +
            '\n部分Host中，新增功能可能无法正常使用';

        const InfoArr = [
            { title: '当前Api环境为:', value: this.state.hostName },
            { title: 'Host:', value: this.state.hostUrl }
        ];

        const changeEnvButtonsArr = this.state.hostAllCase.map((envType) => {
            const allCase = apiEnvironment.getAllHostCase();
            return {
                title: allCase[envType].name,
                envType
            };
        });

        const EventArr = [
            { title: 'PageDecorator Demo', onPress: this.goToDemo },
            { title: 'HTTP请求历史记录', onPress: this.goToFetchHistoryPage },
            { title: '查看当前USER信息', onPress: this.goToUserPage },
            { title: '支付调试面板', onPress: this.goToToolDebugging }
        ];
        if (Platform.OS === 'ios') {
            EventArr.unshift({
                title: '查看磁盘缓存', onPress: this.openIOSDiskDir
            });
        }
        console.log(333);

        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    ref={scv => {
                        this.scrollView = scv;
                    }}
                    style={styles.container}
                >
                    <View style={[styles.rowCell, styles.topDescTextContainer]}>
                        <Text style={styles.topDescText}>{TopTitle}</Text>
                    </View>
                    <View>
                        <Button onPress={this.changeState} title={this.state.nickName}/>
                    </View>
                    {this.renderLinks(InfoArr)}
                    {this.renderEventRows(EventArr)}
                    <View style={styles.buttonsContainer}>
                        {this.renderChangeEnvButton(changeEnvButtonsArr)}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    // 红色提醒文字描述
    topDescTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        minHeight: 110
    },
    topDescText: {
        textAlign: 'center',
        color: 'red',
        lineHeight: 20
    },
    // 行样式
    rowCell: {
        minHeight: 55,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'space-between',
        borderBottomColor: '#dedede'
    },
    // 按钮容器
    buttonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 25
    },
    descText: {
        width: 140,
        marginLeft: 15,
        color: '#474747'
    },
    urlText: {
        flex: 1,
        marginRight: 15,
        color: '#474747',
        textAlign: 'right'
    },
    eventRowsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 15
    },
    // 按钮样式
    buttonStyle: {
        width: (Dimensions.get('window').width - 48) / 2,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 12,
        backgroundColor: '#F00006'
    }
});
