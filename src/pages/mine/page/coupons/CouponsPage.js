import React from 'react';
import {
    View, StyleSheet
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MyCouponsItems from './../../components/MyCouponsItems';
import User from '../../../../model/user';

export default class CouponsPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            selectTab: 10,
            modalVisible: true
        };
    }

    $navigationBarOptions = {
        title: '优惠券',
        show: true // false则隐藏导航
    };

    componentDidMount() {
        if (!User.isLogin) {
            //this.$navigate('login/login/LoginPage');
        }
        console.log(this.params.orderParam);
        console.log(typeof this.params.orderParam);
    }

    _render() {
        return (
            <View style={styles.container}>
                <ScrollableTabView
                    onChangeTab={(obj) => {
                        this.setState({ selectTab: obj.i });
                    }}
                    style={{
                        width: ScreenUtils.width,
                        justifyContent: 'center',
                        marginTop: 1,
                        backgroundColor: '#f7f7f7'
                    }}
                    //进界面的时候打算进第几个
                    initialPage={0}
                    tabBarBackgroundColor='#fff'
                    tabBarActiveTextColor='red'
                    tabBarInactiveTextColor='#999999'
                    locked={true}
                    tabBarTextStyle={{ fontSize: 15 }}
                    tabBarUnderlineStyle={{ backgroundColor: 'red', height: 2 }}
                    renderTabBar={() => <ScrollableTabBar style={{ borderWidth: 0.5 }}/>}
                >
                    <MyCouponsItems tabLabel={'未使用'} pageStatus={0} nav={this.props.navigation}
                                    selectTab={this.state.selectTab} isgiveup={this.params.fromOrder}
                                    fromOrder={this.params.fromOrder} justOne={this.params.justOne}
                                    productIds={this.params.orderParam} giveupUse={() => {
                        this.params.callBack('giveUp'), this.$navigateBack();
                    }} useCoupons={(data) => {
                        this.params.callBack(data), this.$navigateBack();
                    }}/>
                    <MyCouponsItems tabLabel={'已使用'} pageStatus={1} nav={this.props.navigation}
                                    selectTab={this.state.selectTab} isgiveup={false}/>
                    <MyCouponsItems tabLabel={'已失效'} pageStatus={2} nav={this.props.navigation}
                                    selectTab={this.state.selectTab} isgiveup={false}/>
                </ScrollableTabView>
            </View>
        );
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    }
});
