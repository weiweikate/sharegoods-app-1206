import React from 'react';
import {
    StyleSheet
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MyCouponsItems from './../../components/MyCouponsItems';
import User from '../../../../model/user';
import DesignRule from '../../../../constants/DesignRule';

export default class CouponsPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true
        };
    }

    $navigationBarOptions = {
        title: '优惠券',
        show: true // false则隐藏导航
    };

    componentDidMount() {
        if (!User.isLogin) {
            this.gotoLoginPage();
        }
    }

    _render() {
        return (
            <ScrollableTabView
                style={styles.container}
                renderTabBar={this._renderTabBar}
                //进界面的时候打算进第几个
                initialPage={0}>
                <MyCouponsItems tabLabel={'未使用'} pageStatus={0} nav={this.props.navigation}
                                isgiveup={this.params.fromOrder}
                                fromOrder={this.params.fromOrder} justOne={this.params.justOne}
                                orderParam={this.params.orderParam}
                                giveupUse={() => {
                                    this.params.callBack('giveUp');
                                    this.$navigateBack();
                                }}
                                useCoupons={(data) => {
                                    this.params.callBack(data);
                                    this.$navigateBack();
                                }}/>
                <MyCouponsItems tabLabel={'已使用'} pageStatus={1} nav={this.props.navigation}
                                isgiveup={false}/>
                <MyCouponsItems tabLabel={'已失效'} pageStatus={2} nav={this.props.navigation}
                                isgiveup={false}/>
            </ScrollableTabView>
        );
    }

    _renderTabBar = () => {
        return <DefaultTabBar
            backgroundColor={'white'}
            activeTextColor={DesignRule.mainColor}
            inactiveTextColor={DesignRule.textColor_instruction}
            textStyle={styles.tabBarText}
            underlineStyle={styles.tabBarUnderline}
            style={styles.tabBar}
            tabStyle={styles.tab}
        />;
    };

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: ScreenUtils.safeBottom
    },
    tabBar: {
        width: ScreenUtils.width,
        height: 48,
        borderWidth: 0.5,
        borderColor: DesignRule.lineColor_inWhiteBg
    },
    tab: {
        paddingBottom: 0
    },
    tabBarText: {
        fontSize: 15
    },
    tabBarUnderline: {
        width: 48,
        height: 2,
        marginHorizontal: (ScreenUtils.width - 48 * 3) / 6,
        backgroundColor: DesignRule.mainColor,
        borderRadius: 1
    }
});
