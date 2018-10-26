import React from 'react';
import {
    View,
    FlatList,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    // Modal,
    Text
} from 'react-native';
import BasePage from '../../../BasePage';
import ResultSearchNav from './components/ResultSearchNav';
import ResultSegmentView from './components/ResultSegmentView';
import ResultHorizontalRow from './components/ResultHorizontalRow';
import ResultVerticalRow from './components/ResultVerticalRow';
import toGwc from './res/toGwc.png';
import toTop from './res/toTop.png';
import RouterMap from '../../../RouterMap';
import HomeAPI from '../api/HomeAPI';
import DateUtils from '../../../utils/DateUtils';
import SelectionPage from '../product/SelectionPage';
import StringUtils from '../../../utils/StringUtils';
import shopCartCacheTool from '../../shopCart/model/ShopCartCacheTool';
import ShopCartStore from '../../shopCart/model/ShopCartStore';
import { PageLoadingState, renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
import { observer } from 'mobx-react';
import Modal from 'CommModal';
@observer
export default class SearchResultPage extends BasePage {


    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            isHorizontal: false,
            modalVisible: false,
            loadingState: PageLoadingState.loading,
            netFailedInfo: {},
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
        this.loadPageData();
    }

    loadPageData() {
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
    //数据
    _productList = () => {
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

        this.$loadingShow();
        HomeAPI.productList(param).then((data) => {
            this.$loadingDismiss();
            data = data.data || {};
            let dataArr = data.data || [];
            this.setState({
                loadingState: dataArr.length === 0 ? PageLoadingState.empty : PageLoadingState.success,
                productList: dataArr
            });
        }).catch((error) => {
            this.$loadingDismiss();
            this.setState({
                loadingState: PageLoadingState.fail,
                netFailedInfo: error
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
            this.setState({
                selectionData: data.data,
                modalVisible: !this.state.modalVisible,
                productId: productId
            });
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

    //选择规格关闭
    _selectionViewClose = () => {

        this.setState({
            modalVisible: false
        });
    };

    _onPressToGwc = () => {
        this.$navigate('shopCart/ShopCart', {
            hiddeLeft: false
        });
    };
    _onPressToTop = () => {
        this.refs.FlatListShow.scrollToOffset({ offset: 0 });
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
    _clickItemAction = (text, index, hotWordId) => {
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
                this._clickItemAction(item);
            }}>
                <View>
                    <Text style={{ fontSize: 13, color: '#222222', marginLeft: 16, paddingVertical: 15 }}>{item}</Text>
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
                <View>
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

    _renderListView = () => {
        return <FlatList ref='FlatListShow'
                         style={this.state.isHorizontal ? { marginLeft: 10, marginRight: 15 } : null}
                         renderItem={this._renderItem}
                         showsVerticalScrollIndicator={false}
                         keyExtractor={(item, index) => `${index}`}
                         numColumns={this.state.isHorizontal ? 2 : 1}
                         key={this.state.isHorizontal ? 'hShow' : 'vShow'}
                         data={this.state.productList}/>;
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <ResultSearchNav changeLayout={this._changeLayout}
                                 goBack={() => {
                                     this.$navigateBack();
                                 }}
                                 isHorizontal={this.state.isHorizontal}
                                 textInput={this.state.textInput}
                                 onFocus={() => {
                                     this.setState({ onFocus: true });
                                 }}
                                 onChangeText={this._onChangeText}
                                 onEndEditing={() => {
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
                            backgroundColor: '#D51243',
                            borderRadius: 8, justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Text style={{
                                color: 'white',
                                fontSize: 10
                            }}>{ShopCartStore.getAllGoodsClassNumber}</Text>
                        </View>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onPressToTop}>
                        <Image style={{ marginTop: 5 }} source={toTop}/>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="none"
                    transparent={true}
                    onRequestClose={() => this.setState({ modalVisible: false })}
                    visible={this.state.modalVisible}>
                    <SelectionPage selectionViewConfirm={this._selectionViewConfirm}
                                   selectionViewClose={this._selectionViewClose} data={this.state.selectionData}/>
                </Modal>
            </View>
        );
    }
}
