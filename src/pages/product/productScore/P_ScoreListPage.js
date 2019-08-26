import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { MRText as Text } from '../../../components/ui/index';
import BasePage from '../../../BasePage';
import P_ScoreListItemView from './components/P_ScoreListItemView';
import DetailBottomView from '../components/DetailBottomView';
import { PageLoadingState, renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
import res from '../res/product';
import DesignRule from '../../../constants/DesignRule';
import user from '../../../model/user';
import SelectionPage from '../SelectionPage';
import apiEnvironment from '../../../api/ApiEnvironment';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import CommShareModal from '../../../comm/components/CommShareModal';
import shopCartCacheTool from '../../shopCart/model/ShopCartCacheTool';
import ProductApi from '../api/ProductApi';
import { beginChatType, QYChatTool } from '../../../utils/QYModule/QYChatTool';
import ProductDetailNavView from '../components/ProductDetailNavView';
import { SmoothPushPreLoadHighComponent } from '../../../comm/components/SmoothPushHighComponent';
import { routeNavigate } from '../../../navigation/RouterMap';
import RouterMap from '../../../navigation/RouterMap';

const { p_score_smile, p_score_empty } = res.productScore;

@SmoothPushPreLoadHighComponent
export default class P_ScoreListPage extends BasePage {

    state = {
        loadingState: PageLoadingState.loading,

        noMore: false,//是否能加载更多
        loadingMore: false,//是否显示加载更多的菊花
        loadingMoreError: null,//加载更多是否报错

        page: 1,


        dataArray: []
    };

    $navigationBarOptions = {
        show: false
    };

    componentDidMount() {
        this._loadPageData();
    }

    _getPageStateOptions = () => {
        const { pData } = this.params;
        const { overtimeComment } = pData || {};
        const hasComment = overtimeComment && parseInt(overtimeComment) > 0;
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._loadPageData
            },
            emptyProps: {
                imageStyle: hasComment ? { width: 60, height: 60 } : { width: 120, height: 120 },
                source: hasComment ? p_score_smile : p_score_empty,
                description: hasComment ? `${overtimeComment}位用户默认给了优秀晒单` : '晒单在奔跑赶来~'
            }
        };
    };

    _loadPageData = () => {
        const { pData } = this.params;
        const { prodCode } = pData;
        let promises = [];
        promises.push(ProductApi.appraise_queryByProdCode({ prodCode: prodCode }).then((data) => {
            return Promise.resolve((data || {}).data || []);
        }));
        promises.push(ProductApi.appraise_list({
            page: 1,
            pageSize: 10,
            prodCode: prodCode,
            createTime: ''
        }).then((data) => {
            //isMore层
            let dataTemp = (data || {}).data;
            return Promise.resolve((dataTemp || {}).data || []);
        }));
        Promise.all(promises).then((data) => {
            this.state.page++;

            let tempArr = [];
            data.forEach((item) => {
                //item 数组
                tempArr.push(...item);
            });
            this.setState({
                loadingState: (tempArr || []).length > 0 ? PageLoadingState.success : PageLoadingState.empty,
                dataArray: tempArr || []
            });
        }).catch((error) => {
            this.setState({
                loadingState: PageLoadingState.fail,
                netFailedInfo: error,
                dataArray: []
            });
        });
    };

    _loadPageDataMore = () => {
        const { pData } = this.params;
        const { prodCode } = pData;
        this.setState({
            loadingMore: true
        }, () => {
            const { dataArray } = this.state;
            let lastData = {};
            if (dataArray.length > 0) {
                lastData = dataArray[dataArray.length - 1];
            }
            ProductApi.appraise_list({
                page: this.state.page, pageSize: 10, prodCode: prodCode, createTime: lastData.createTime || ''
            }).then((data) => {
                this.state.page++;
                //isMore层
                let dataTemp = (data || {}).data;
                this.setState({
                    loadingMore: false,
                    loadingMoreError: null,
                    noMore: dataTemp.isMore === 0,
                    dataArray: this.state.dataArray.concat((dataTemp || {}).data)
                });
            }).catch((error) => {
                this.setState({
                    loadingMore: false,
                    loadingMoreError: error.msg
                });
            });
        });
    };

    //选择规格确认
    _selectionViewConfirm = (amount, skuCode, item) => {
        const { pData } = this.params;
        const { productIsPromotionPrice } = pData || {};
        let orderProducts = [];
        if (this.state.goType === 'gwc') {
            //hyf更改
            let temp = {
                'amount': amount,
                'skuCode': skuCode,
                'productCode': pData.prodCode
            };
            /*加入购物车埋点*/
            const { prodCode, name, originalPrice } = pData || {};
            track(trackEvent.AddToShoppingcart, {
                spuCode: prodCode,
                skuCode: skuCode,
                spuName: name,
                pricePerCommodity: originalPrice,
                spuAmount: amount,
                shoppingcartEntrance: 1
            });
            shopCartCacheTool.addGoodItem(temp);
        } else if (this.state.goType === 'buy') {
            const { specImg, productName, promotionPrice, price, propertyValues } = item;
            orderProducts.push({
                skuCode: skuCode,
                quantity: amount,
                productCode: pData.prodCode,
                activityCode: '',
                batchNo: 1,
                specImg,
                productName,
                unitPrice: productIsPromotionPrice ? promotionPrice : price,
                spec: (propertyValues || '').replace(/@/g, '-')
            });
            this.$navigate(RouterMap.ConfirOrderPage, {
                orderParamVO: {
                    orderType: 99,
                    orderProducts: orderProducts,
                    source: 2
                }
            });
        }
    };

    _bottomViewAction = (type) => {
        const { pData } = this.params;
        switch (type) {
            case 'jlj':
                this.shareModal && this.shareModal.open();
                break;
            case 'keFu':
                if (!user.isLogin) {
                    routeNavigate(RouterMap.LoginPage);
                    return;
                }
                track(trackEvent.ClickOnlineCustomerService, { customerServiceModuleSource: 2 });
                const { shopId, title, name, secondName, imgUrl, prodCode, minPrice, maxPrice } = pData || {};
                QYChatTool.beginQYChat({
                    shopId: shopId,
                    title: title,
                    chatType: beginChatType.BEGIN_FROM_PRODUCT,
                    data: {
                        title: name,
                        desc: secondName,
                        pictureUrlString: imgUrl,
                        urlString: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}`,
                        note: minPrice !== maxPrice ? `￥${minPrice}-￥${maxPrice}` : `￥${minPrice}`
                    }
                });
                break;
            case 'buy':
                if (!user.isLogin) {
                    routeNavigate(RouterMap.LoginPage);
                    return;
                }
                this.state.goType = type;
                this.SelectionPage.show(pData, this._selectionViewConfirm);
                break;
            case 'gwc':
                this.state.goType = type;
                this.SelectionPage.show(pData, this._selectionViewConfirm);
                break;
        }
    };

    _renderItem = ({ item }) => {
        return <P_ScoreListItemView itemData={item} navigation={this.props.navigation}/>;
    };

    _onEndReached = () => {
        const { loadingMore, noMore, loadingState } = this.state;
        if (loadingMore || loadingState !== PageLoadingState.success || noMore) {
            return;
        }
        this._loadPageDataMore();
    };

    _ListFooterComponent = () => {
        const { pData } = this.params;
        const { overtimeComment } = pData || {};
        return (
            <View>
                {overtimeComment && parseInt(overtimeComment) > 0 ? <View style={styles.footView}>
                    <Image source={p_score_smile} style={styles.footerImg}/>
                    <Text style={styles.footerText}>{`${overtimeComment}位用户默认给了优秀晒单`}</Text>
                </View> : null}
                {this.state.noMore ? <Text style={styles.footerNoMoreText}>我也是有底线的~</Text> : null}
            </View>
        );
    };

    _keyExtractor = (item, index) => {
        return `${item.id}${index}`;
    };

    _renderFlatList = () => {
        return <FlatList data={this.state.dataArray}
                         renderItem={this._renderItem}
                         keyExtractor={this._keyExtractor}
                         onEndReached={this._onEndReached}
                         onEndReachedThreshold={0.3}
                         showsVerticalScrollIndicator={false}
                         ListFooterComponent={this._ListFooterComponent}/>;
    };

    _render() {
        const { pData } = this.params;
        const {
            name, imgUrl, prodCode, originalPrice, groupPrice, v0Price, shareMoney,
            monthSaleCount, priceTypeTextList, promotionMinPrice, productIsPromotionPrice
        } = pData || {};
        return (
            <View style={styles.container}>
                <ProductDetailNavView productDetailModel={pData}
                                      showNavTextT={true}
                                      showAction={() => {
                                          this.shareModal && this.shareModal.open();
                                      }}/>
                {renderViewByLoadingState(this._getPageStateOptions(), this._renderFlatList)}
                <DetailBottomView bottomViewAction={this._bottomViewAction}
                                  pData={pData}/>
                <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                trackParmas={{
                                    spuCode: prodCode,
                                    spuName: name
                                }}
                                trackEvent={trackEvent.Share}
                                type={'Image'}
                                imageJson={{
                                    monthSaleType: monthSaleCount >= 1000 ? 3 : (monthSaleCount >= 500 ? 2 : 1),
                                    imageUrlStr: imgUrl,
                                    titleStr: `${name}`,
                                    priceType: priceTypeTextList,
                                    priceStr: `￥${originalPrice}`,
                                    retailPrice: `￥${productIsPromotionPrice ? promotionMinPrice : v0Price}`,
                                    shareMoney: shareMoney,
                                    spellPrice: `￥${groupPrice}`,
                                    QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}?upuserid=${user.code || ''}`
                                }}
                                webJson={{
                                    title: `${name}`,
                                    dec: '商品详情',
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}?upuserid=${user.code || ''}`,
                                    thumImage: imgUrl
                                }}
                                miniProgramJson={{
                                    title: `${name}`,
                                    dec: '商品详情',
                                    thumImage: 'logo.png',
                                    hdImageURL: imgUrl,
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}?upuserid=${user.code || ''}`,
                                    miniProgramPath: `/pages/index/index?type=99&id=${prodCode}&inviteId=${user.code || ''}`
                                }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    rightBarItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 88
    },
    rightItemBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footView: {
        justifyContent: 'center', alignItems: 'center',
        height: 68, backgroundColor: DesignRule.white
    },
    footerImg: {
        marginBottom: 10,
        width: 20, height: 20
    },
    footerText: {
        fontSize: 13, color: DesignRule.textColor_secondTitle
    },
    footerNoMoreText: {
        marginTop: 20, marginBottom: 10, alignSelf: 'center',
        fontSize: 11, color: DesignRule.textColor_instruction
    }
});
