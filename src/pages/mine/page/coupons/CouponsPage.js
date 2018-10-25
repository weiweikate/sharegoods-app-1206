import React from 'react';
import {
    View, StyleSheet
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MyCouponsItems from './../../components/MyCouponsItems';
import TabBar from 'react-native-underline-tabbar';
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
        console.log('justone',this.params.justOne);
    }

    _render() {
        return (
            <View style={styles.container}>
                <ScrollableTabView
                    onChangeTab={(obj) => {
                        this.setState({ selectTab: obj.i });
                    }}
                    style={{ width: ScreenUtils.width, justifyContent: 'center', height: 60 }}
                    //进界面的时候打算进第几个
                    initialPage={0}
                    tabBarActiveTextColor='#D51243'
                    tabBarInactiveTextColor='#999999'
                    tabBarTextStyle={{ fontSize: 15, color: 'white' }}
                    renderTabBar={() => <TabBar
                        tabBarUnderlineColor='#D51243'
                        backgroundColor='white'
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignContent: 'center',
                            borderWidth: 0.5
                        }}/>}
                >
                    <MyCouponsItems tabLabel={{ label: '未使用' }} pageStatus={0} nav={this.props.navigation}
                                    selectTab={this.state.selectTab} isgiveup={this.params.fromOrder}
                                    fromOrder={this.params.fromOrder} justOne={this.params.justOne}
                                    productIds={this.params.orderParam} giveupUse={() => {
                        this.params.callBack('giveUp'), this.$navigateBack();
                    }} useCoupons={(data) => {
                        this.params.callBack(data), this.$navigateBack();
                    }}/>
                    <MyCouponsItems tabLabel={{ label: '已使用' }} pageStatus={1} nav={this.props.navigation}
                                    selectTab={this.state.selectTab} isgiveup={false}/>
                    <MyCouponsItems tabLabel={{ label: '已失效' }} pageStatus={2} nav={this.props.navigation}
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
