import React, { Component } from 'react';
import {
    StyleSheet, View, Text, Image, ScrollView,
    Dimensions, TouchableWithoutFeedback, RefreshControl,
    InteractionManager
} from 'react-native';
import { VictoryPie } from 'victory-native';
import MineApi from '../../api/MineApi';
import { PageLoadingState } from '../../../../components/pageDecorator/PageState';
import DesignRule from 'DesignRule';
import res from '../../res';
const Icon = res.myData.icon0;
const Icon1 = res.myData.icon1;
const Icon2 = res.myData.icon2;

const colors = [
    '#ea822a',
    '#dd572a',
    '#f6c400',
    '#fff600',
    '#a5c200',
    '#23d500',
    '#378fd3',
    '#15c696',
    '#c14de3',
    '#0ecce8'
];

const ScreenWidth = Dimensions.get('window').width;
const ArtWidth = 124 / 375 * ScreenWidth;
const InlineArtWidth = 21.5 / 375 * ScreenWidth;
const BtnWidth = (Dimensions.get('window').width - 44) / 2;
const BtnHeight = BtnWidth * 75 / 168;

export default class MyDataPage extends Component {

    // static jrPageOptions = {
    //     navigationBarOptions: {
    //         title: '我的数据',
    //     },
    //     renderByPageState: true,
    // };

    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            list: [],
            refreshing: false,
            netFailedInfo: null,
            loadingState: PageLoadingState.loading
        };
    }

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._reload
            }
        };
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(this.loadPageData);
    }

    loadPageData = () => {
        // 我的数据
        MineApi.getUserLevelInfo().then(response => {
            if (response.code === 10000) {
                response.data.list = response.data.list.map((item, index) => {
                    return {
                        ...item,
                        color: colors[index] || ('#' + Math.floor(Math.random() * 0xffffff).toString(16))
                    };
                });
                this.setState({
                    list: response.data.list,
                    total: response.data.total,
                    refreshing: false,
                    netFailedInfo: null,
                    loadingState: PageLoadingState.success
                });
            } else {
                //1
                this.setState({
                    list: [],
                    total: 0,
                    refreshing: false,
                    netFailedInfo: response,
                    loadingState: PageLoadingState.fail
                });
            }
        }).catch(error => {
            if (error.code === 10009) {
                this.$navigator('login/login/LoginPage', { callback: this.loadPageData() });
            }
        });
    };


    _onPressMyPromotion = () => {
        this.jr_navigate('mine/MyPromotionPage');
    };

    _onPressMyInvitation = () => {
        this.jr_navigate('mine/myData/InviteDataPage');
    };


    // 饼图
    _renderArt = () => {
        const colorScale = [];
        let data = this.state.list.map((item) => {
            colorScale.push(item.color);
            return { x: item.name, y: item.money, ...item };
        });
        if (!this.state.list || this.state.list.length === 0) {
            return <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>暂无交易数据</Text>
            </View>;
        }
        return (<View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 30 }}>
            <VictoryPie
                padding={{ top: 0, left: 0 }}
                colorScale={colorScale}
                data={data}
                innerRadius={InlineArtWidth}
                height={ArtWidth}
                width={Dimensions.get('window').width - 44}
                labels={(i) => {
                }}
            />
            <TouchableWithoutFeedback onPress={this._onPressTeam}>
                <View style={styles.falseBtn}/>
            </TouchableWithoutFeedback>
        </View>);
    };

    _renderBtn = (icon, title, onPress) => {
        return (<TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.btn}>
                <Image style={styles.icon} source={icon}/>
                <Text style={styles.desc}>{title}</Text>
            </View>
        </TouchableWithoutFeedback>);
    };

    // 重新加载
    _reload = () => {
        this.setState({
            netFailedInfo: null,
            loadingState: PageLoadingState.loading
        }, this.loadPageData);
    };

    _onRefresh = () => {
        this.setState({
            refreshing: true
        }, this.loadPageData);
    };

    _onPressTeam = () => {
        if (!this.state.list || this.state.list.length === 0) {
            return;
        }
        this.jr_navigate('mine/myData/TeamDataPage', {
            list: this.state.list,
            total: this.state.total
        });
    };

    render() {
        const list = this.state.list || [];
        return (
            <ScrollView style={styles.container}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                            colors={[DesignRule.mainColor]}
                        />}>
                <View style={styles.whitePanel}>
                    <TouchableWithoutFeedback onPress={this._onPressTeam}>
                        <View style={styles.row}>
                            <Image source={Icon}/>
                            <Text style={styles.title}>
                                团队交易数据
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.chart}>
                        {this._renderArt()}
                    </View>
                    <View style={{ marginTop: 1, backgroundColor: 'white' }}>
                        <View style={styles.lineRow}>
                            <View style={styles.line}/>
                            <Text style={styles.lineTitle}>
                                交易数据百分比
                            </Text>
                        </View>
                        <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                            {
                                list.map((item, index) => {
                                    const { name, color, money } = item;
                                    const scale = ((money / this.state.total) * 100).toFixed(2) + '%';
                                    return <View key={index} style={styles.itemRow}>
                                        <View style={[styles.block, {
                                            backgroundColor: color
                                        }]}/>
                                        <Text numberOfLines={1} style={styles.name}>
                                            {name}
                                        </Text>
                                        <Text numberOfLines={1} style={styles.value}>
                                            {scale || ' '}
                                        </Text>
                                    </View>;
                                })
                            }
                        </View>
                    </View>
                    <View style={styles.bottom}>

                        {this._renderBtn(Icon1, '我的晋升情况', this._onPressMyPromotion)}
                        {this._renderBtn(Icon2, '我的邀请数据', this._onPressMyInvitation)}

                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    whitePanel: {
        marginTop: 10,
        width: Dimensions.get('window').width - 32,
        marginLeft: 16
    },
    row: {
        marginHorizontal: 0,
        height: 44,
        flexDirection: 'row',
        paddingHorizontal: 15,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    title: {
        marginLeft: 5,
        fontSize: 15,
        color: DesignRule.textColor_mainTitle,
        flex: 1
    },
    chart: {
        width: Dimensions.get('window').width - 32,
        marginTop: 1,
        backgroundColor: 'white',
        borderRadius: 3
    },
    bottom: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btn: {
        width: BtnWidth,
        height: BtnHeight,
        borderRadius: 5,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginLeft: 16
    },
    desc: {
        fontSize: 13,
        color: DesignRule.mainColor,
        marginLeft: 10
    },
    lineRow: {
        flexDirection: 'row',
        height: 30,
        paddingHorizontal: 21,
        alignItems: 'center',
        marginTop: 5
    },
    line: {
        width: 4,
        height: 14,
        backgroundColor: DesignRule.mainColor
    },
    lineTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        color: DesignRule.textColor_mainTitle,
        marginLeft: 8
    },
    //item
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: (ScreenWidth - 32) / 2,
        paddingHorizontal: 21,
        height: 38
    },
    block: {
        width: 10,
        height: 10,
        backgroundColor: DesignRule.bgColor_blue
    },
    name: {
        fontSize: 12,
        color: DesignRule.textColor_secondTitle,
        marginLeft: 10,
        flex: 1
    },
    value: {
        fontSize: 12,
        color: DesignRule.textColor_secondTitle,
        textAlign: 'right'
    },
    falseBtn: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent'
    },
    noDataContainer: {
        height: 188,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDataText: {
        color: DesignRule.textColor_mainTitle,
        fontSize: 13
    }
});
