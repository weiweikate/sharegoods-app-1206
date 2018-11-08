/**
 * Created by xiangchen on 2018/7/10.
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity, ListView, TouchableWithoutFeedback, Image,
} from 'react-native';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
// import UIImage from '../../../../components/ui/UIImage';
import { color } from '../../../../constants/Theme';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { SwipeListView } from 'react-native-swipe-list-view';
import RefreshList from '../../../../components/ui/RefreshList';
import NoMessage from '../../../../comm/res/empty_list_message.png';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import MoneyIcon from '../../../spellShop/recommendSearch/src/je_07.png';
import StarIcon from '../../../spellShop/recommendSearch/src/xj_10.png';
import invalidIcon from '../../res/setting/shoucang_icon_shixiao_nor.png'
import { observer } from 'mobx-react/native';
import DesignRule from 'DesignRule';

@observer
export default class MyCollectPage extends BasePage {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            viewData: [],
            selectAll: false,
            isEmpty: true,
            totalPrice: 0,
            selectGoodsNum: 0
        };
        this.currentPage=1
    }

    $navigationBarOptions = {
        title: '收藏店铺',
        show: true // false则隐藏导航
    };
    //**********************************ViewPart******************************************
    //删除收藏
    deleteFromShoppingCartByProductId = (storeId) => {
        if (user.isLogin) {
            this.$loadingShow();
            MineApi.storeCollectionCancel({ storeId: storeId }).then(res => {
                this.$loadingDismiss();
                if (res.code === 10000) {
                    this.$toastShow('删除成功');
                    this.getDataFromNetwork();
                } else {
                    this.$toastShow(res.msg);
                }
            }).catch(err => {
                this.$loadingDismiss();
                console.log(err);
            });
        } else {
            this.$navigate('login/login/LoginPage');
        }
    };
    isValidItem = (index) => {
        let inValidCode = 0;
        return this.state.viewData[index].status !== inValidCode;
        // return true;
    };
    renderItem = (item, index) => {
        console.log(item);
        return (
            this.isValidItem(index) ? this.renderValidItem(item, index) : this.renderInvalidItem({ item, index })
        );

    };

    renderValidItem = (item, index) => {
        console.log(item);
        const storeStar = item.storeStarId;
        const starsArr = [];
        if (storeStar && typeof storeStar === 'number') {
            for (let i = 0; i < (storeStar > 3 ? 3 : storeStar); i++) {
                starsArr.push(i);
            }
        }
        return (
            <TouchableWithoutFeedback onPress={() => this.go2PruductDetailPage(item.storeId, 0)}>
                <View style={styles.rowContainer}>
                    {
                        item.headUrl ? <Image source={{ uri: item.headUrl }} style={styles.img}/> :
                            <View style={styles.img}/>
                    }
                    <View style={styles.right}>
                        <View style={styles.row}>
                            <Text numberOfLines={1} style={styles.title}>{item.name || ''}</Text>
                        </View>

                        <Text style={[styles.desc, styles.margin]}>{item.userCount || 0}成员</Text>
                        <View style={styles.bottomRow}>
                            <Image source={MoneyIcon}/>
                            <Text style={[styles.desc, { color: '#f39500' }]}>交易额:{item.totalTradeBalance}元</Text>
                            <View style={{ flex: 1 }}/>
                            <View style={styles.starContainer}>
                                {
                                    starsArr.map((index) => {
                                        return <Image key={index} style={[index ? { marginLeft: 5 } : null]}
                                                      source={StarIcon}/>;
                                    })
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };
    renderInvalidItem = ({ item, index }) => {
        console.log(item);
        const storeStar = item.storeStarId;
        const starsArr = [];
        if (storeStar && typeof storeStar === 'number') {
            for (let i = 0; i < (storeStar > 3 ? 3 : storeStar); i++) {
                starsArr.push(i);
            }
        }
        return (
            <TouchableWithoutFeedback onPress={() => this.go2PruductDetailPage(item.storeId, 1)}>
                <View style={[styles.rowContainer, { backgroundColor: '#c7c7c7' }]}>
                    <View style={{position:'absolute',left:0,top:0,width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
                        <Image source={invalidIcon} style={{flex:1}} />
                    </View>
                    {
                        item.headUrl ? <Image source={{ uri: item.headUrl }} style={[{
                                justifyContent: 'center',
                                alignItems: 'center'
                            }, styles.img]}/>
                          :
                            <View style={[{ justifyContent: 'center', alignItems: 'center' }, styles.img]}/>
                    }
                    <View style={styles.right}>
                        <View style={styles.row}>
                            <Text numberOfLines={1} style={styles.title}>{item.name || ''}</Text>
                        </View>

                        <Text style={[styles.desc, styles.margin]}>{item.userCount || 0}成员</Text>
                        <View style={styles.bottomRow}>
                            <Image source={MoneyIcon}/>
                            <Text style={[styles.desc, { color: '#f39500' }]}>交易额:{item.totalTradeBalance}元</Text>
                            <View style={{ flex: 1 }}/>
                            <View style={styles.starContainer}>
                                {
                                    starsArr.map((index) => {
                                        return <Image key={index} style={[index ? { marginLeft: 5 } : null]}
                                                      source={StarIcon}/>;
                                    })
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
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
       this.currentPage++;
        this.getDataFromNetwork();
    };
    onRefresh = () => {
      this.currentPage=1;
        this.getDataFromNetwork();
    };

    go2PruductDetailPage(storeId, index) {
        if (index != 1) {
            this.$navigate('spellShop/MyShop_RecruitPage', { storeId: storeId });
        }

    }

    componentDidMount() {
        this.getDataFromNetwork();
    }

    getDataFromNetwork = () => {
        this.$loadingShow();
        MineApi.queryCollection({ page: this.currentPage, size: 20 }).then(res => {
            this.$loadingDismiss();
            let arr = this.currentPage==1?[]:this.state.viewData;
            console.log(res);
            if (res.code === 10000) {
                let icons = res.data ? (res.data.data ? res.data.data : []) : [];
                icons.forEach(item => {
                    console.log(item);
                    arr.push({
                        createTime: item.createTime,
                        headUrl: item.headUrl,
                        id: item.id,
                        name: item.name,
                        storeId: item.storeId,
                        storeStarId: item.storeStarId,
                        totalTradeBalance: item.totalTradeBalance,
                        userCount: item.userCount,
                        userId: item.userId,
                        status:item.status,
                    });
                });
                console.log(arr);
                this.setState({
                    viewData: arr
                });
            }
        }).catch(err => {
            this.$loadingDismiss();
            if (err.code === 10009) {
                this.$navigate('login/login/LoginPage');
            }
        });
    };

    _render() {
        return (
            <View style={styles.container}>
                {this.state.viewData && this.state.viewData.length > 0 ? this._renderListView() : this._renderEmptyView()}
            </View>
        );
    }

    _renderListView = () => {
        console.log(this.state.viewData);
        return (
            <SwipeListView
                dataSource={this.ds.cloneWithRows(this.state.viewData)}
                disableRightSwipe={true}
                renderRow={(rowData, secId, rowId, rowMap) => (
                    this.renderItem(rowData, rowId)
                )}
                renderHiddenRow={(data, secId, rowId, rowMap) => (
                    <TouchableOpacity
                        style={styles.standaloneRowBack}
                        onPress={() => {
                            rowMap[`${secId}${rowId}`].closeRow();
                            this.deleteFromShoppingCartByProductId(data.storeId);
                        }}>
                        <UIText style={{ color: DesignRule.white }} value={'立即\n删除'}/>
                    </TouchableOpacity>
                )}
                rightOpenValue={-75}
            />
        );
    };

    _renderEmptyView = () => {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text>
                    ~暂无店铺收藏~!
                </Text>
            </View>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#f7f7f7',
        marginBottom: ScreenUtils.safeBottom
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
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 0,
        marginRight: 0
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 55
    },
    right: {
        marginLeft: 10,
        flex: 1
    },
    margin: {
        marginTop: 10,
        marginBottom: 5
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    img: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#c8c8c8',
        backgroundColor: __DEV__ ? '#c8c8c8' : DesignRule.white
    },
    ingContainer: {
        width: 46,
        height: 15,
        borderRadius: 7,
        backgroundColor: '#e60012',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5
    },
    ingText: {
        fontSize: 11,
        color: '#f7f7f7'
    },
    rowContainer: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: DesignRule.white
    },
    title: {
        fontSize: 13,
        color: '#000000',
        maxWidth: 200
    },
    desc: {
        marginLeft: 2,
        fontSize: 12,
        color: '#666666'
    }

});


