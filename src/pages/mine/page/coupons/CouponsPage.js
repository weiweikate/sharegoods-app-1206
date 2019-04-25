import React from 'react';
import {
    StyleSheet, View, Image, TouchableOpacity, Platform
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MyCouponsItems from './../../components/MyCouponsItems';
import User from '../../../../model/user';
import DesignRule from '../../../../constants/DesignRule';
import NavigatorBar from '../../../../components/pageDecorator/NavigatorBar/NavigatorBar';
import Modal from '../../../../comm/components/CommModal';
import { MRText as Text, NoMoreClick } from '../../../../components/ui';
import res from './../../res';
import { observer } from 'mobx-react/native';
import couponsModel from './../../model/CouponsModel';
import bridge from '../../../../utils/bridge';

const topUp = res.couponsImg.youhuiquan_icon_topArrow;
const topDown = res.couponsImg.youhuiquan_icon_topArrowed;

@observer
export default class CouponsPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            titleName: '我的优惠券',
            CONFIG: [{ name: '全部', type: null }, { name: '1元代金券', type: 99 }, { name: '满减券', type: 1 },
                { name: '抵价券', type: 2 }, { name: '折扣券', type: 3 }, { name: '抵扣券', type: 4 },
                { name: '兑换券', type: 5 }, { name: '靓号券', type: 7 }],
            selectIndex: 0,
            selectTab: 0
        };
        couponsModel.clearData();
    }

    $navigationBarOptions = {
        title: '我的优惠券',
        show: true // false则隐藏导航
    };

    componentDidMount() {
        if (!User.isLogin) {
            this.gotoLoginPage();
        }
    }

    $NavBarRenderTitle = () => {
        if (!!this.params.fromOrder || !!this.params.justOne) {
            return <Text style={[styles.title]} allowFontScaling={false} numberOfLines={1}>优惠券</Text>;
        } else {
            return (
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                    this.setState({ modalVisible: true });
                }} disabled={!!this.params.fromOrder || !!this.params.justOne}>
                    <Text style={{
                        fontSize: 18,
                        color: DesignRule.textColor_mainTitle,
                        backgroundColor: 'transparent'
                    }}>{this.state.titleName}</Text>
                    <Image source={this.state.modalVisible ? topDown : topUp}
                           style={{ width: 10, height: 6, marginLeft: 2 }} resizeMode={'contain'}/>
                </TouchableOpacity>
            );
        }
    };

    renderModals() {
        return (
            <Modal
                visible={this.state.modalVisible}
                transparent={true}
                animationType='fade'
                onRequestClose={() => {
                }}
                style={{ flex: 1 }}
                ref="modal">
                <NoMoreClick onPress={() => {
                    this.setState({ modalVisible: false });
                }} activeOpacity={1}>
                    <View style={{
                        marginTop: Platform.OS === 'ios' ? 0 : ScreenUtils.statusBarHeight > 30 ? -ScreenUtils.statusBarHeight : 0
                    }}>
                        <NavigatorBar renderTitle={this.$NavBarRenderTitle} leftPressed={() => {
                            if (this.state.modalVisible) {
                                this.setState({ modalVisible: false });
                                return;
                            }
                            this.props.navigation.goBack();
                        }}/>
                        <View style={{ height: 10, backgroundColor: 'white' }}/>
                        <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={styles.outterStyle}>
                                {this.state.CONFIG.map((item, i) => {
                                    return (
                                        <NoMoreClick key={i} style={styles.noMoreStyle}
                                                     activeOpacity={1}
                                                     onPress={() => this.selectCouType(item, i)}>
                                            <View
                                                style={[styles.innerStyle, { backgroundColor: i === this.state.selectIndex ? DesignRule.textColor_redWarn : DesignRule.white }]}>
                                                <Text style={{
                                                    color: i === this.state.selectIndex ? DesignRule.white : DesignRule.textColor_secondTitle,
                                                    fontSize: 15
                                                }} allowFontScaling={false}>{item.name}</Text>
                                            </View>
                                        </NoMoreClick>
                                    );
                                })
                                }
                            </View>
                        </View>
                    </View>
                </NoMoreClick>
            </Modal>
        );
    }

    selectCouType = (item, i) => {
        this.setState({
            modalVisible: false,
            titleName: (i === 0 ? '我的优惠券' : item.name),
            selectIndex: i
        });
        couponsModel.changeType(item);
        bridge.showLoading();
        this.selctType.onRefresh(couponsModel.params);
    };

    _render() {
        return (
            <View style={{ flex: 1, backgroundColor: DesignRule.bgColor }}>
                {this.renderModals()}
                <ScrollableTabView
                    onChangeTab={(obj) => {
                        this.setState({ selectTab: obj.i });
                    }}
                    style={styles.container}
                    scrollWithoutAnimation={true}
                    renderTabBar={this._renderTabBar}
                    //进界面的时候打算进第几个
                    initialPage={0}>
                    <MyCouponsItems tabLabel={'未使用'} pageStatus={0} nav={this.props.navigation}
                                    isgiveup={this.params.fromOrder} selectTab={this.state.selectTab}
                                    fromOrder={this.params.fromOrder} justOne={this.params.justOne}
                                    orderParam={this.params.orderParam}
                                    giveupUse={() => {
                                        this.params.callBack('giveUp');
                                        this.$navigateBack();
                                    }}
                                    useCoupons={(data) => {
                                        this.params.callBack(data);
                                        this.$navigateBack();
                                    }} ref={(e) => this.selctType = e}/>
                    <MyCouponsItems tabLabel={'已使用'} pageStatus={1} nav={this.props.navigation}
                                    isgiveup={false} ref={(e) => this.selctType = e} selectTab={this.state.selectTab}/>
                    <MyCouponsItems tabLabel={'已失效'} pageStatus={2} nav={this.props.navigation}
                                    isgiveup={false} ref={(e) => this.selctType = e} selectTab={this.state.selectTab}/>
                </ScrollableTabView>
            </View>
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
    },
    outterStyle: {
        width: ScreenUtils.width,
        backgroundColor: 'white',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    noMoreStyle: {
        width: ScreenUtils.width / 3,
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerStyle: {
        borderColor: DesignRule.lineColor_inWhiteBg,
        width: 104,
        height: 34,
        borderRadius: 5,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        color: DesignRule.textColor_mainTitle,
        backgroundColor: 'transparent'
    }
});
