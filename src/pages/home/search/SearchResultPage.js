import React from 'react';
import {
    View,
    FlatList,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import BasePage from '../../../BasePage';
import ResultSearchNav from './components/ResultSearchNav';
import ResultSegmentView from './components/ResultSegmentView';
import ResultHorizontalRow from './components/ResultHorizontalRow';
import ResultVerticalRow from './components/ResultVerticalRow';
import RouterMap from '../../../navigation/RouterMap';
import HomeAPI from '../api/HomeAPI';
import DateUtils from '../../../utils/DateUtils';
import SelectionPage from '../../product/SelectionPage';
import StringUtils from '../../../utils/StringUtils';
import shopCartCacheTool from '../../shopCart/model/ShopCartCacheTool';
import ShopCartStore from '../../shopCart/model/ShopCartStore';
import { PageLoadingState, renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
import { observer } from 'mobx-react';
import ScreenUtils from '../../../utils/ScreenUtils';
import ListFooter from '../../../components/pageDecorator/BaseView/ListFooter';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { MRText as Text } from '../../../components/ui';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';

const viewTypes = {
    rowView: 'rowView',
    rowView1: 'rowView1'

};

const { width, height } = ScreenUtils;


const {
    toGwc,
    kongbaiye_ss_icon,
    toTop
} = res.search;


@observer
export default class SearchResultPage extends BasePage {


    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            //刷新
            refreshing: false,//是否显示下拉的菊花
            noMore: false,//是否能加载更多
            loadingMore: false,//是否显示加载更多的菊花
            loadingMoreError: null,//加载更多是否报错

            loadingState: PageLoadingState.loading,
            netFailedInfo: {},

            showTop: false,
            isHorizontal: true,
            //排序类型(1.综合 2.销量 3. 价格)
            sortType: 1,
            //排序方式 (1.升序 2.降序)
            sortModel: 2,
            //页码
            page: 1,

            productList: [],//列表数据
            selectionData: {},//规格数据

            onFocus: false,
            textInput: this.params.keywords || this.params.name || '',
            keywordsArr: [],//列表搜索关键词

            prodCode: ''//选择规格确定时使用
        };
    }

    componentDidMount() {
        this._productList(true);
    }

    _getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._emptyRequest
            },
            emptyProps: {
                source: kongbaiye_ss_icon,
                description: '很抱歉',
                subDescription: '没找到任何内容'
            }
        };
    };

    _getParams = () => {
        let param = {};
        param.page = this.state.page;
        param.pageSize = 10;
        param.sortModel = this.state.sortModel;
        param.sortType = this.state.sortType;
        param.time = DateUtils.formatDate(new Date());

        //分类只需要categoryId
        if (!StringUtils.isEmpty(this.params.categoryId)) {
            param.categoryId = this.params.categoryId;
        } else {
            //热门搜索额外需要hotWordId
            if (!StringUtils.isEmpty(this.params.hotWordId)) {
                param.hotWordId = this.params.hotWordId;
            }
            param.keyword = this.state.textInput;
        }
        return param;
    };

    _refreshing = () => {
        this.setState({
            refreshing: true
        }, () => {
            this._productList();
        });
    };

    _emptyRequest = () => {
        this.setState({
            loadingState: PageLoadingState.loading
        }, () => {
            this._productList();
        });
    };

    //数据
    _productList = (needTrack) => {
        this.state.page = 1;
        let param = this._getParams();
        HomeAPI.productList(param).then((data) => {
            this.state.page++;
            data = data.data || {};
            let dataArr = data.data || [];

            /*搜索埋点*/
            needTrack && track(trackEvent.search, {
                keyWord: this.params.keywords,
                hasResult: dataArr.length !== 0,
                isHistory: this.params.isHistory,
                isRecommend: StringUtils.isNoEmpty(this.params.hotWordId)
            });
            this.setState({
                refreshing: false,
                noMore: data.isMore === 0,

                loadingState: dataArr.length === 0 ? PageLoadingState.empty : PageLoadingState.success,
                productList: dataArr
            });
        }).catch((error) => {
            this.setState({
                refreshing: false,

                loadingState: PageLoadingState.fail,
                netFailedInfo: error
            });
        });
    };

    shouldComponentUpdate(nextProps, nextState) {
        let itemData = [];
        let dataList = [];
        if (nextState.isHorizontal) {
            (nextState.productList || []).forEach((item, index) => {
                if (index % 2 === 1) {
                    itemData.push(item);
                    dataList.push({
                        itemData: itemData,
                        type: viewTypes.rowView
                    });
                    itemData = [];
                } else {
                    itemData.push(item);
                }
            });
            if (itemData.length > 0) {
                dataList.push({
                    itemData: itemData,
                    type: viewTypes.rowView
                });
            }
        } else {
            (nextState.productList || []).forEach((item) => {
                item.type = viewTypes.rowView1;
                dataList.push(item);
            });
        }
        this.productListResult = dataList;
        return true;
    }

    _loadPageDataMore = () => {
        this.onEndReached = true;
        this.setState({
            loadingMore: true
        }, () => {
            let param = this._getParams();
            HomeAPI.productList(param).then((data) => {
                this.state.page++;
                this.onEndReached = false;
                data = data.data || {};
                let dataArr = data.data || [];
                this.setState({
                    noMore: data.isMore === 0,
                    loadingMore: false,
                    loadingMoreError: null,
                    productList: this.state.productList.concat(dataArr || [])
                });
            }).catch((error) => {
                this.setState({
                    loadingMore: false,
                    loadingMoreError: error.msg
                });
            });
        });
    };

    _storeProduct = (item) => {
        this.state.prodCode = item.prodCode;
        this.productItem = item;
        this.SelectionPage.show(item, this._selectionViewConfirm, { needUpdate: true });
    };

    _changeLayout = () => {
        this.setState({
            isHorizontal: !this.state.isHorizontal
        });
    };

    _segmentOnPressAtIndex = (index) => {
        if (index === 2 && this.state.sortType === 3) {
            if (this.state.sortModel === 1) {
                this.state.sortModel = 2;
            } else {
                this.state.sortModel = 1;
            }
        } else {
            this.state.sortModel = 2;
        }
        this.state.sortType = index + 1;
        this._emptyRequest();
    };

    _onPressAtIndex = (prodCode) => {
        this.$navigate(RouterMap.ProductDetailPage, { productCode: prodCode, preseat: '搜索结果' });
    };

    //选择规格确认
    _selectionViewConfirm = (amount, skuCode) => {
        let temp = {
            'amount': amount,
            'skuCode': skuCode,
            'productCode': this.state.prodCode
        };
        /*加入购物车埋点*/
        const { prodCode, name, firstCategoryId, secCategoryId, minPrice } = this.productItem || {};
        track(trackEvent.addToShoppingcart, {
            shoppingCartEntrance: '搜索页面',
            commodityNumber: amount,
            commodityID: prodCode,
            commodityName: name,
            firstCommodity: firstCategoryId,
            secondCommodity: secCategoryId,
            pricePerCommodity: minPrice
        });
        shopCartCacheTool.addGoodItem(temp);
    };

    _onPressToGwc = () => {
        this.$navigate('shopCart/ShopCart', {
            hiddeLeft: false
        });
    };
    _onPressToTop = () => {
        this.RecyclerListView && this.RecyclerListView.scrollToTop(true);
    };

    //getKeywords数据
    _onChangeText = (text) => {
        HomeAPI.getKeywords({ keyword: text }).then((data) => {
            this.setState({
                keywordsArr: data.data || [],
                textInput: text
            });
        }).catch((data) => {
            this.$toastShow(data.msg);
        });
    };

    //跳转
    _clickItemAction = (text) => {
        if (StringUtils.isEmpty(text)) {
            this.$toastShow('搜索内容不能为空');
            return;
        }
        this.params.isHistory = false;
        this.params.categoryId = undefined;
        this.params.hotWordId = undefined;
        this.setState({ onFocus: false, textInput: text }, () => {
            this._productList(true);
        });
    };

    //关键词列表点击
    _renderKeyItem = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.ResultSearchNav.changeText(item);
                this._clickItemAction(item);
            }}>
                <View>
                    <Text style={{
                        fontSize: 13,
                        color: DesignRule.textColor_mainTitle,
                        marginLeft: 16,
                        paddingVertical: 15
                    }} allowFontScaling={false}>{item}</Text>
                    <View style={{ height: 1, backgroundColor: DesignRule.lineColor_inGrayBg, marginLeft: 16 }}/>
                </View>
            </TouchableWithoutFeedback>);
    };

    _renderContainer = () => {
        if (this.state.onFocus) {
            return (
                <View style={{ backgroundColor: 'white', flex: 1 }}>
                    {this.state.keywordsArr.length === 0 ? null : <FlatList
                        renderItem={this._renderKeyItem}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => `${index}`}
                        data={this.state.keywordsArr}/>}

                </View>);
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <ResultSegmentView segmentOnPressAtIndex={this._segmentOnPressAtIndex}/>
                    {renderViewByLoadingState(this._getPageStateOptions(), this._renderListView)}
                </View>
            );
        }
    };

    _ListFooterComponent = () => {
        if (this.state.productList.length === 0) {
            return null;
        }
        return <ListFooter loadingMore={this.state.loadingMore}
                           errorDesc={this.state.loadingMoreError}
                           onPressLoadError={this._onEndReached}/>;
    };
    _onEndReached = () => {
        if (this.onEndReached || !this.state.productList.length || this.state.noMore) {
            return;
        }
        this._loadPageDataMore();
    };

    dataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });

    _layoutProvider = new LayoutProvider((index) => {
        return this.dataProvider.getDataForIndex(index).type;
    }, (type, dim) => {
        dim.width = width;
        switch (type) {
            case viewTypes.rowView:
                dim.height = (width - 30 - 5) / 2 + 82 + 5;
                break;
            case viewTypes.rowView1:
                dim.height = 130;
                break;
            default:
                dim.height = 0;
                dim.width = 0;
                break;
        }
    });

    _rowRenderer = (type, data) => {
        switch (type) {
            case viewTypes.rowView:
                const { itemData } = data;
                return <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
                    {itemData[0] ?
                        <ResultHorizontalRow onPressAtIndex={this._onPressAtIndex} storeProduct={this._storeProduct}
                                             itemData={itemData[0]}/> : null}
                    {itemData[1] ?
                        <ResultHorizontalRow style={{ marginLeft: 5 }} onPressAtIndex={this._onPressAtIndex}
                                             storeProduct={this._storeProduct}
                                             itemData={itemData[1]}/> : null}
                </View>;
            case viewTypes.rowView1:
                return (<ResultVerticalRow onPressAtIndex={this._onPressAtIndex} storeProduct={this._storeProduct}
                                           itemData={data}/>);
            default:
                return null;
        }
    };

    _renderListView = () => {
        this.dataProvider = this.dataProvider.cloneWithRows(this.productListResult);
        return (
            <View style={{ flex: 1 }}>
                <RecyclerListView ref={(ref) => this.RecyclerListView = ref}
                                  style={{ minHeight: 1, minWidth: width, flex: 1 }}
                                  refreshControl={<RefreshControl
                                      refreshing={this.state.refreshing}
                                      onRefresh={this._refreshing.bind(this)}
                                      title="下拉刷新"
                                      tintColor={DesignRule.textColor_instruction}
                                      titleColor={DesignRule.textColor_instruction}
                                      colors={[DesignRule.mainColor]}/>}
                                  layoutProvider={this._layoutProvider}
                                  dataProvider={this.dataProvider}
                                  rowRenderer={this._rowRenderer}
                                  showsVerticalScrollIndicator={false}
                                  onScroll={this._onScroll}
                                  onEndReached={this._onEndReached.bind(this)}
                                  onEndReachedThreshold={height / 2.0}
                                  renderFooter={this._ListFooterComponent}/>
            </View>
        );
    };

    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        let isShow;
        if (Y < ScreenUtils.height) {
            isShow = false;
        } else {
            isShow = true;
        }
        if (isShow !== this.state.showTop) {
            this.setState({
                showTop: isShow
            });
        }
    };


    _render() {
        return (
            <View style={{ flex: 1 }}>
                <ResultSearchNav changeLayout={this._changeLayout}
                                 ref={(ref) => this.ResultSearchNav = ref}
                                 goBack={() => {
                                     this.$navigateBack();
                                 }}
                                 isHorizontal={this.state.isHorizontal}
                                 defaultValue={this.state.textInput}
                                 onFocus={() => {
                                     this.setState({ onFocus: true });
                                 }}
                                 onChangeText={this._onChangeText}
                                 onSubmitEditing={() => {
                                     this._clickItemAction(this.state.textInput);
                                 }}
                />
                {this._renderContainer()}

                <View style={{ position: 'absolute', right: 15, bottom: 15 }}>
                    <TouchableOpacity onPress={this._onPressToGwc}>
                        <Image source={toGwc}/>
                        {ShopCartStore.getAllGoodsClassNumber === 0 ? null : <View style={{
                            position: 'absolute', top: 4, left: 4, height: 16,
                            paddingHorizontal: 4,
                            backgroundColor: DesignRule.mainColor,
                            borderRadius: 8, justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Text style={{
                                color: 'white',
                                fontSize: 10
                            }}
                                  allowFontScaling={false}>{ShopCartStore.getAllGoodsClassNumber > 99 ? 99 : ShopCartStore.getAllGoodsClassNumber}</Text>
                        </View>}
                    </TouchableOpacity>
                    {this.state.showTop ? <TouchableOpacity onPress={this._onPressToTop.bind(this)}>
                        <Image style={{ marginTop: 5 }} source={toTop}/>
                    </TouchableOpacity> : null}

                </View>
                <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
            </View>
        );
    }
}
