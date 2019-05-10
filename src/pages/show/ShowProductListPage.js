/**
 * @author xzm
 * @date 2019/5/7
 */

import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    Image,
    RefreshControl
} from 'react-native';
import BasePage from '../../BasePage';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import ScreenUtils from '../../utils/ScreenUtils';
import backIconImg from '../../comm/res/button/icon_header_back.png';
import { MRText, UIImage } from '../../components/ui';
import DesignRule from '../../constants/DesignRule';
import ShowApi from './ShowApi';
import EmptyUtils from '../../utils/EmptyUtils';

const { px2dp } = ScreenUtils;

export default class ShowProductListPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            catData: [],
            isRefresh: true
        };
    }

    $navigationBarOptions = {
        show: null
    };

    componentDidMount() {
        this._loadCatData();
    }

    _loadCatData = () => {
        this.setState({
            isRefresh: true
        });
        ShowApi.carList().then((data) => {
            if (data.data) {
                this.setState({
                    catData: this.packingShopCartGoodsData(data.data),
                    isRefresh: false
                });
            } else {
                this.setState({
                    catData: [],
                    isRefresh: false
                });
            }

        }).catch((error) => {
            this.setState({
                catData: [],
                isRefresh: false
            });
        });
    };


    packingShopCartGoodsData = (response) => {
        let originData = response;
        let tempAllData = [];
        //有效商品
        if (response === null) {
            return tempAllData;
        }
        let effectiveArr = originData.shoppingCartGoodsVOS;
        if (effectiveArr && effectiveArr instanceof Array && effectiveArr.length > 0) {
            effectiveArr.map((itemObj, index) => {
                Array.prototype.push.apply(tempAllData, itemObj.products);
            });
        }
        return tempAllData;

    };

    _changeTabIndex = (index) => {
        const page = this.state.page;
        if (typeof index === 'object') {
            if (index.i !== page) {
                this.setState({
                    page: index.i
                });
            }
        } else {
            if (index !== page) {
                this.setState({
                    page: index
                });
            }
        }
    };

    _listItemRender = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={()=>{
                let spus = this.params.spus;
                if(!EmptyUtils.isEmptyArr(spus)){
                    if(spus.indexOf(item.spuCode) !== -1){
                        this.$toastShow('这个商品已经选过了哦')
                        return
                    }
                }

                let callBack = this.params.callBack;
                callBack && callBack(item);
                this.$navigateBack();
            }}>
                <View style={styles.itemWrapper}>
                    <UIImage source={{ uri: item.imgUrl ? item.imgUrl : '' }}
                             style={[styles.validProductImg]}/>
                    <View style={{ height: px2dp(70) }}>
                        <MRText numberOfLines={1}
                                style={styles.itemTitle}
                                ellipsizeMode={'tail'}>
                            {item.productName ? item.productName : ''}
                        </MRText>
                        <View style={{ flex: 1 }}/>
                        <View style={{ flexDirection: 'row', alignItems: 'center' ,marginLeft:px2dp(10)}}>
                            <MRText style={{ fontSize: px2dp(10), color: DesignRule.mainColor }}>￥</MRText>
                            <MRText style={styles.priceText}>
                                {item.showPrice ? item.showPrice : item.price}
                            </MRText>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    _renderCar = () => {
        const { statusBarHeight } = ScreenUtils;

        return (
            <View style={styles.listBackground}>
                <FlatList style={styles.container}
                          renderItem={this._listItemRender}
                          data={this.state.catData}
                          refreshControl={
                              <RefreshControl
                                  refreshing={this.state.isRefresh}
                                  onRefresh={() => {
                                      this._loadCatData();
                                  }}
                                  progressViewOffset={statusBarHeight + 44}
                                  colors={[DesignRule.mainColor]}
                                  title="下拉刷新"
                                  tintColor={DesignRule.textColor_instruction}
                                  titleColor={DesignRule.textColor_instruction}
                              />
                          }
                />
            </View>
        );
    };

    _headerRender = () => {
        return (
            <View style={styles.header}>
                <View style={styles.flex}>
                    <TouchableOpacity style={styles.backImg} onPress={() => this._onLeftPressed()}>
                        <Image source={backIconImg} style={styles.img}/>
                    </TouchableOpacity>
                </View>
                <TouchableWithoutFeedback onPress={() => {
                    this._changeTabIndex(0);
                }}>
                    <View>
                        <MRText style={styles.titleText}>购物车商品</MRText>
                    </View>
                </TouchableWithoutFeedback>
                {/*<View style={{ width: 40 }}/>*/}
                {/*<TouchableWithoutFeedback onPress={() => {*/}
                {/*this._changeTabIndex(1);*/}
                {/*}}>*/}
                {/*<View>*/}
                {/*<MRText style={this.state.page === 1 ? styles.selectStyle : styles.noSelectStyle}>购物车商品</MRText>*/}
                {/*</View>*/}
                {/*</TouchableWithoutFeedback>*/}

                <View style={styles.flex}/>
            </View>
        );
    };

    _render() {
        return (
            <View style={styles.contain}>
                {this._headerRender()}
                <ScrollableTabView
                    style={styles.tab}
                    page={this.state.page}
                    renderTabBar={() => <DefaultTabBar style={styles.tabBar}/>}
                    tabBarUnderlineStyle={styles.underline}
                    onChangeTab={(number) => this._changeTabIndex(number)}
                    showsVerticalScrollIndicator={false}
                >
                    {/*{this._renderBuy()}*/}
                    {this._renderCar()}
                </ScrollableTabView>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    contain: {
        flex: 1
    },
    tabBar: {
        height: 0,
        borderWidth: 0
    },
    underline: {
        height: 0
    },
    tab: {
        height: 0,
        borderWidth: 0
    },
    header: {
        height: ScreenUtils.headerHeight,
        paddingTop: ScreenUtils.statusBarHeight,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    backImg: {
        height: 44,
        width: 45,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    img: {
        height: 15,
        width: 15
    },
    flex: {
        flex: 1
    },
    selectStyle: {
        color: DesignRule.mainColor,
        fontSize: DesignRule.fontSize_secondTitle
    },
    noSelectStyle: {
        color: DesignRule.textColor_secondTitle,
        fontSize: DesignRule.fontSize_threeTitle
    },
    listBackground: {
        flex: 1,
        backgroundColor: DesignRule.bgColor,
        paddingTop: 10
    },
    itemWrapper: {
        backgroundColor: DesignRule.white,
        borderRadius: px2dp(5),
        flexDirection: 'row',
        marginBottom: px2dp(10),
        padding: px2dp(5),
        marginHorizontal: DesignRule.margin_page,
        width: (DesignRule.width - DesignRule.margin_page * 2)
    },
    validProductImg: {
        width: px2dp(60),
        height: px2dp(60)
    },
    itemTitle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_mediumBtnText,
        width: DesignRule.width - px2dp(115)
    },
    contentStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_threeTitle
    },
    priceText: {
        color: DesignRule.mainColor,
        fontSize: px2dp(18),
    },
    titleText:{
        color:DesignRule.textColor_mainTitle,
        fontSize:DesignRule.fontSize_mainTitle
    }
});


