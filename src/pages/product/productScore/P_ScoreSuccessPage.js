import React from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import { MRText as Text } from '../../../components/ui/index';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import BasePage from '../../../BasePage';
import RouterMap from '../../../navigation/RouterMap';
import res from '../res/product';
import OrderApi from '../../order/api/orderApi';
import ProductApi from '../api/ProductApi';

const { tongyon_icon_check_green } = res.button;
const { kong_icon_shaidan } = res.productScore;
const { width, autoSizeHeight } = ScreenUtils;

export default class P_ScoreSuccessPage extends BasePage {

    state = {
        dataList: [],
        isFail: false
    };

    componentDidMount() {
       this._loadPageData();
    }

    _loadPageData = ()=>{
        ProductApi.queryCommentByUserCode().then((data) => {
            let tempList = (data || {}).data || [];
            this.setState({
                dataList: tempList
            });
        }).catch(() => {
            this.setState({
                isFail: true
            });
        });
    }

    $NavBarLeftPressed = () => {
        this.$navigateBack(-2);
    };

    $navigationBarOptions = {
        title: '晒单成功'
    };

    _goPublish = (warehouseOrderNo) => {
        OrderApi.checkInfo({ warehouseOrderNo: warehouseOrderNo }).then(res => {
            if (res.data) {
                this.$navigate(RouterMap.P_ScorePublishPage, { orderNo: warehouseOrderNo });
            } else {
                this._loadPageData();
                this.$toastShow('该商品已晒过单！');
            }
        }).catch(e => {
            this.$toastShow(e.msg);
        });
    };

    _ListEmptyComponent = () => {
        return (
            <View style={styles.emptyView}>
                <Image source={kong_icon_shaidan} style={styles.emptyImage}/>
                <Text style={styles.emptyText}>晒单王，您已全部晒单成功~</Text>
            </View>
        );
    };

    _renderListHeader = () => {
        return <View style={styles.headerContainer}>
            <Image style={styles.headerImg} source={tongyon_icon_check_green}/>
            <Text style={styles.headerText}>感谢晒单~</Text>
            <NoMoreClick style={styles.headerBtn} onPress={this.$navigateBackToHome}>
                <Text style={styles.headerBtnText}>返回首页</Text>
            </NoMoreClick>
        </View>;
    };

    _renderItem = ({ item, index }) => {
        //warehouseOrderNo 仓库订单号
        //productName 产品标题  specImg 规格图
        const { productName, specImg, warehouseOrderNo } = item || {};
        return (
            <View>
                {
                    index === 0 ? <View style={styles.nextView}>
                        <Text style={styles.nextText}>接着晒下去</Text>
                    </View> : null
                }
                <View style={styles.itemContainer}>
                    <UIImage style={styles.itemImg} source={{ uri: specImg }}/>
                    <Text style={styles.itemTittle} numberOfLines={2}>{productName || ''}</Text>
                    <NoMoreClick style={styles.itemBtn} onPress={() => {
                        this._goPublish(warehouseOrderNo);
                    }}>
                        <Text style={styles.itemBtnText}>去晒单</Text>
                    </NoMoreClick>
                </View>
            </View>
        );
    };

    _keyExtractor = (item, index) => {
        return `${item.id}${index}`;
    };

    _render() {
        return (
            <View style={styles.container}>
                {this._renderListHeader()}
                {this.state.isFail ? null : <FlatList data={this.state.dataList}
                                                      renderItem={this._renderItem}
                                                      keyExtractor={this._keyExtractor}
                                                      ListEmptyComponent={this._ListEmptyComponent}/>}

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    /**header**/
    headerContainer: {
        alignItems: 'center',
        backgroundColor: DesignRule.white
    },
    headerImg: {
        marginTop: 20, marginBottom: 10
    },
    headerText: {
        fontSize: 17, color: DesignRule.textColor_mainTitle
    },
    headerBtn: {
        marginTop: 20, marginBottom: 30, justifyContent: 'center', alignItems: 'center',
        height: 40, width: 120,
        borderColor: DesignRule.lineColor_inWhiteBg, borderWidth: 1, borderRadius: 20
    },
    headerBtnText: {
        fontSize: 15, color: DesignRule.textColor_secondTitle
    },
    nextView: {
        width: width,
        justifyContent: 'center', alignItems: 'center',
        height: 33, backgroundColor: DesignRule.bgColor
    },
    nextText: {
        fontSize: 11, color: DesignRule.textColor_mainTitle
    },

    /**item**/
    emptyView: {
        alignItems: 'center'
    },
    emptyImage: {
        marginTop: autoSizeHeight(70)
    },
    emptyText: {
        marginTop: 10,
        fontSize: 13, color: DesignRule.textColor_secondTitle
    },

    itemContainer: {
        flexDirection: 'row', marginBottom: 10,

        height: 85, backgroundColor: DesignRule.white
    },
    itemImg: {
        marginLeft: 15, marginTop: 10, marginRight: 10,
        width: 60, height: 60
    },
    itemTittle: {
        marginRight: 15, marginTop: 10, flex: 1,
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    itemBtn: {
        position: 'absolute', right: 15, bottom: 10, justifyContent: 'center', alignItems: 'center',
        height: 24, width: 80,
        borderColor: DesignRule.mainColor, borderWidth: 1, borderRadius: 12
    },
    itemBtnText: {
        fontSize: 13, color: DesignRule.mainColor
    }
});
