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
                //增加两个字段
                itemObj.type = itemObj.activityType;//当前分组类型
                itemObj.middleTitle = '';
                itemObj.key = index;
                itemObj.data = itemObj.products;
                itemObj.data.map((goodItem, goodItemIndex) => {
                    // 有一个showPrice 搞活动显示的价格，有就重置掉price，没有你就老实的用原来的 OJBK?
                    goodItem.price = goodItem.showPrice ? goodItem.showPrice : goodItem.price;
                    goodItem.sectionType = itemObj.activityType;//当前组所属类型 8 经验值 null是其他
                    goodItem.isSelected = false;
                    goodItem.key = `${index}_${goodItemIndex}`;
                    goodItem.nowTime = itemObj.nowTime;//系统当前时间戳
                    goodItem.activityCode = itemObj.activityCode;
                    goodItem.topSpace = itemObj.activityType == 8 ? 0 : 10;

                    let tempSpecContent = '规格:';
                    goodItem.specifies.map((specify, specifyIndex) => {
                        if (specifyIndex === 0) {
                            tempSpecContent += specify.paramValue;
                        } else {
                            tempSpecContent += '-' + specify.paramValue;
                        }
                    });
                    goodItem.specifyContent = tempSpecContent;

                    tempAllData.push(itemObj);
                });
            })
        }
        // alert(JSON.stringify(tempAllData))
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

    // _renderBuy = () => {
    //     return (
    //         <View style={styles.listBackground}/>
    //     );
    // };

    _listItemRender = ({ itemData }) => {
        // return null;
        alert(JSON.stringify(itemData.item))
        return (
            <View style={styles.itemWrapper}>
                <UIImage source={{ uri: itemData.item.imgUrl ? itemData.item.imgUrl : '' }}
                         style={[styles.validProductImg]}/>
                <View>
                    <MRText numberOfLines={1}
                            style={styles.itemTitle}
                            ellipsizeMode={'tail'}>
                        {itemData.item.productName ? itemData.item.productName : ''}
                    </MRText>
                    <MRText numberOfLines={1}
                            ellipsizeMode={'tail'}
                            style={styles.contentStyle}>
                        {itemData.item.specifyContent ? itemData.item.specifyContent : ''}
                    </MRText>

                </View>
            </View>
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
                        <MRText style={this.state.page === 0 ? styles.selectStyle : styles.noSelectStyle}>已购商品</MRText>
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
        padding: px2dp(5)
    },
    validProductImg: {
        width: px2dp(80),
        height: px2dp(80)
    },
    itemTitle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_mediumBtnText
    },
    contentStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_threeTitle
    }
});


