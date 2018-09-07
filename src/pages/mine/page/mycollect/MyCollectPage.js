/**
 * Created by xiangchen on 2018/7/10.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import UIText from '../../../../components/ui/UIText';
import UIImage from '../../../../components/ui/UIImage';
import { color } from '../../../../constants/Theme';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { SwipeRow } from 'react-native-swipe-list-view';
import RefreshList from '../../../../components/ui/RefreshList';
import NoMessage from '../../../../comm/res/empty_list_message.png';
import user from '../../../../model/user';
import { observer } from 'mobx-react/native';

@observer
export default class MyCollectPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            selectAll: false,
            currentPage: 1,
            isEmpty: true,
            totalPrice: 0,
            selectGoodsNum: 0
        };
    }

    static $PageOptions = {
        navigationBarOptions: {
            title: '店铺收藏'
        },
        renderByPageState: true
    };
    //**********************************ViewPart******************************************
    //删除收藏
    deleteFromShoppingCartByProductId = (index) => {
        if (user.isLogin) {
        } else {
            let arrData = [];
            for (let i = 0; i < this.state.viewData.length; i++) {
                if (index != i) {
                    arrData.push(this.state.viewData[i]);
                }
            }
            this.setState({ viewData: arrData });
            this.updateShoppingCartItemsByProductId(index, -1);
        }
    };
    isValidItem = (index) => {
        let validCode = 4;
        return this.state.viewData[index].status == validCode;
    };
    renderItem = ({ item, index }) => {
        return (
            this.isValidItem(index) ? this.renderValidItem({ item, index }) : this.renderInvalidItem({ item, index })
        );

    };

    renderValidItem = ({ item, index }) => {

        return (
            <View>
                <SwipeRow disableRightSwipe={true} leftOpenValue={75} rightOpenValue={-75} style={{
                    height: 100,
                    flexDirection: 'row',
                    backgroundColor: color.white,
                    alignItems: 'center'
                }}>
                    <View style={styles.standaloneRowBack}>
                        <UIText style={styles.backTextWhite} value={'删除'} onPress={() => {
                            this.deleteFromShoppingCartByProductId(index);
                        }}/>
                    </View>
                    <View style={[styles.standaloneRowFront, { height: 100 }]}>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            height: 100,
                            width: ScreenUtils.width,
                            alignItems: 'center'
                        }}>
                            <UIImage style={{ height: 80, width: 80, marginLeft: 15, marginTop: 11, borderRadius: 10 }}
                                     onPress={() => this.go2PruductDetailPage(item.id)}
                                     source={{ uri: this.state.viewData[index].pictureUrl }}/>
                            <View style={{ flex: 1, marginTop: 11 }}>
                                <View style={{ height: 31, justifyContent: 'flex-start' }}>
                                    <Text style={{
                                        flex: 1,
                                        flexWrap: 'wrap',
                                        color: color.black_222,
                                        fontSize: 13,
                                        marginLeft: 10,
                                        marginRight: 10
                                    }} numberOfLines={2}>{this.state.viewData[index].context}</Text>

                                </View>
                                <View style={{
                                    backgroundColor: color.blue_4a9,
                                    borderRadius: 5,
                                    marginLeft: 10,
                                    height: 15,
                                    width: 30,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{ fontSize: 10, margin: 2 }}>包邮</Text>
                                </View>
                                <View style={{
                                    height: 30,
                                    marginLeft: 10,
                                    marginRight: 10,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    marginTop: 10
                                }}>

                                    <UIText value={StringUtils.formatMoneyString(this.state.viewData[index].price)}
                                            style={{ color: color.red, fontSize: 13, marginRight: 10 }}/>
                                    <UIText
                                        value={StringUtils.formatMoneyString(this.state.viewData[index].original_price)}
                                        style={{
                                            color: color.black_999,
                                            fontSize: 13,
                                            textDecorationLine: 'line-through'
                                        }}/>

                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SwipeRow>
                <View style={{ height: 2, backgroundColor: color.page_background }}/>
            </View>
        );
    };
    renderInvalidItem = ({ item, index }) => {
        return (
            <View>
                <SwipeRow disableRightSwipe={true} leftOpenValue={75} rightOpenValue={-75}
                          style={{ height: 100, flexDirection: 'row', backgroundColor: color.white }}>
                    <View style={[styles.standaloneRowBack, { height: 100 }]}>
                        <UIText style={styles.backTextWhite} value={'删除'} onPress={() => {
                            this.deleteFromShoppingCartByProductId(index);
                        }}/>
                    </View>
                    <View style={[styles.standaloneRowFront, { height: 100 }]}>
                        <View style={{
                            width: 38,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: '#999999',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 12
                        }}>
                            <UIText value={'失效'}
                                    style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 12, color: '#ffffff' }}/>
                        </View>
                        <UIImage source={{ uri: this.state.viewData[index].pictureUrl }}
                                 style={{ width: 80, height: 80, marginLeft: 7, marginRight: 16, borderRadius: 10 }}/>
                        <View style={{
                            flex: 1,
                            height: 100,
                            justifyContent: 'space-between',
                            marginTop: 30,
                            paddingRight: 15
                        }}>
                            <View>
                                <UIText value={this.state.viewData[index].context}
                                        style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 13, color: '#999999' }}/>
                            </View>
                        </View>
                    </View>
                </SwipeRow>
                <View style={{ height: 2, backgroundColor: color.page_background }}/>
            </View>
        );
    };

    renderBodyView = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <RefreshList
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyIcon={NoMessage}
                    emptyTip={'暂无数据'}
                />

            </View>
        );
    };
    onLoadMore = () => {
        this.setState({
            currentPage: this.state.currentPage + 1
        });
        this.getDataFromNetwork();
    };
    onRefresh = () => {
        this.setState({
            currentPage: 1
        });
        this.getDataFromNetwork();
    };

    go2PruductDetailPage(i) {
        // this.navigate('product/ProductDetailPage',{productId:i})
    }

    getDataFromNetwork = () => {

    };

    render() {
        return (
            <View style={styles.container}>
                {this.renderBodyView()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'white'
    },
    standaloneRowFront: {
        alignItems: 'center',
        backgroundColor: color.white,
        justifyContent: 'center',
        height: 100,
        width: ScreenUtils.width,
        flexDirection: 'row',
        marginRight: 16
    },
    backTextWhite: {
        color: '#FF0',
        marginRight: 20
    },
    standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: color.red,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 15
    }
});


