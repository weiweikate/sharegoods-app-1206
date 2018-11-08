import React from 'react';
import {
    View,
    FlatList,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Text,
    RefreshControl
} from 'react-native';
import BasePage from '../../../BasePage';
import ResultSearchNav from './components/ResultSearchNav';
import ResultSegmentView from './components/ResultSegmentView';
import ResultHorizontalRow from './components/ResultHorizontalRow';
import ResultVerticalRow from './components/ResultVerticalRow';
import toGwc from './res/toGwc.png';
import toTop from './res/toTop.png';
import RouterMap from 'RouterMap';
import HomeAPI from '../api/HomeAPI';
import DateUtils from '../../../utils/DateUtils';
import SelectionPage from '../product/SelectionPage';
import StringUtils from '../../../utils/StringUtils';
import shopCartCacheTool from '../../shopCart/model/ShopCartCacheTool';
import ShopCartStore from '../../shopCart/model/ShopCartStore';
import { PageLoadingState, renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
import { observer } from 'mobx-react';
import ScreenUtils from '../../../utils/ScreenUtils';
import ListFooter from '../../../components/pageDecorator/BaseView/ListFooter';
import DesignRule from 'DesignRule';


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

            productId: ''//选择规格确定时使用
        };
    }

    componentDidMount() {
        this._productList();
    }

    _getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._productList
            }
        };
    };

    _getParams = (isMore) => {
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
            param.keyword = this.params.keywords || '';
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

    //数据
    _productList = () => {
        this.state.page = 1;
        let param = this._getParams();
        this.$loadingShow();
        HomeAPI.productList(param).then((data) => {
            this.state.page++;
            this.$loadingDismiss();
            data = data.data || {};
            let dataArr = data.data || [];
            this.setState({
                refreshing: false,
                noMore: dataArr.length < 10,

                loadingState: dataArr.length === 0 ? PageLoadingState.empty : PageLoadingState.success,
                productList: dataArr
            });
        }).catch((error) => {
            this.$loadingDismiss();
            this.setState({
                refreshing: false,

                loadingState: PageLoadingState.fail,
                netFailedInfo: error
            });
        });
    };

    _loadPageDataMore = () => {
        this.onEndReached = true;
        this.setState({
            loadingMore: true
        }, () => {
            let param = this._getParams(true);
            HomeAPI.productList(param).then((data) => {
                this.state.page++;
                this.onEndReached = false;
                data = data.data || {};
                let dataArr = data.data || [];
                this.setState({
                    noMore: dataArr.length < 10,
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

    _storeProduct = (productId) => {
        this.$loadingShow();
        HomeAPI.getProductSpec({
            id: productId
        }).then((data) => {
            this.$loadingDismiss();
            data.data = data.data || {};
            this.state.productId = productId;
            this.SelectionPage.show(data.data, this._selectionViewConfirm, { needUpdate: true });
        }).catch((data) => {
            this.$loadingDismiss();
            this.$toastShow(data.msg);
        });
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
        this._productList();
    };

    _onPressAtIndex = (productId) => {
        this.$navigate(RouterMap.ProductDetailPage, { productId: productId });
    };

    //选择规格确认
    _selectionViewConfirm = (amount, priceId) => {
        let temp = {
            'amount': amount,
            'priceId': priceId,
            'productId': this.state.productId
        };
        shopCartCacheTool.addGoodItem(temp);
    };

    _onPressToGwc = () => {
        this.$navigate('shopCart/ShopCart', {
            hiddeLeft: false
        });
    };
    _onPressToTop = () => {
        this.FlatListShow.scrollToOffset({ offset: 0 });
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
        this.params.categoryId = undefined;
        this.params.hotWordId = undefined;
        this.params.keywords = text;
        this.setState({ onFocus: false, textInput: text }, () => {
            this._productList();
        });
    };

    _renderKeyItem = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.ResultSearchNav.changeText(item);
                this._clickItemAction(item);
            }}>
                <View>
                    <Text style={{ fontSize: 13, color: DesignRule.textColor_mainTitle, marginLeft: 16, paddingVertical: 15 }}>{item}</Text>
                    <View style={{ height: 1, backgroundColor: '#DDDDDD', marginLeft: 16 }}/>
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

    _renderItem = ({ item }) => {
        if (this.state.isHorizontal) {
            return (<ResultHorizontalRow onPressAtIndex={this._onPressAtIndex} storeProduct={this._storeProduct}
                                         itemData={item}/>);
        } else {
            return (<ResultVerticalRow onPressAtIndex={this._onPressAtIndex} storeProduct={this._storeProduct}
                                       itemData={item}/>);
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

    _renderListView = () => {
        return <FlatList ref={(ref) => this.FlatListShow = ref}
                         refreshControl={
                             <RefreshControl
                                 refreshing={this.state.refreshing}
                                 onRefresh={this._refreshing.bind(this)}
                                 title="下拉刷新"
                                 tintColor="#999"
                                 titleColor="#999"/>}
                         onScroll={this._onScroll}
                         onEndReached={this._onEndReached.bind(this)}
                         onEndReachedThreshold={0.1}
                         ListFooterComponent={this._ListFooterComponent}
                         scrollEventThrottle={10}
                         style={this.state.isHorizontal ? { marginLeft: 10, marginRight: 15 } : null}
                         renderItem={this._renderItem}
                         showsVerticalScrollIndicator={false}
                         keyExtractor={(item, index) => `${index}`}
                         numColumns={this.state.isHorizontal ? 2 : 1}
                         key={this.state.isHorizontal ? 'hShow' : 'vShow'}
                         data={this.state.productList}/>;
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
                                 defaultValue={this.params.keywords || this.params.name}
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
                            }}>{ShopCartStore.getAllGoodsClassNumber}</Text>
                        </View>}
                    </TouchableOpacity>
                    {this.state.showTop ? <TouchableOpacity onPress={this._onPressToTop}>
                        <Image style={{ marginTop: 5 }} source={toTop}/>
                    </TouchableOpacity> : null}

                </View>
                <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
            </View>
        );
    }
}
