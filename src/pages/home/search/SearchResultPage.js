import React from 'react';
import {
    View,
    FlatList,
    Image,
    TouchableWithoutFeedback,
    Modal
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

export default class SearchResultPage extends BasePage {


    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            isHorizontal: false,
            modalVisible: false,

            //排序类型(1.综合 2.销量 3. 价格)
            sortType: 1,
            //排序方式 (1.升序 2.降序)
            sortModel: 1,
            //页码
            page: 1,

            productList: [],
            selectionData: {},

            productId:''
        };
    }

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
        this._productList();
    }

    //数据
    _productList = () => {
        this.$loadingShow();
        HomeAPI.productList({
            keyword: this.params.keywords,
            pageSize: 10,
            page: this.state.page,
            sortModel: this.state.sortModel,
            sortType: this.state.sortType,
            time: DateUtils.formatDate(new Date())
        }).then((data) => {
            this.$loadingDismiss();
            this.setState({
                productList: data.data.data
            });
        }).catch((data) => {
            this.$loadingDismiss();
            this.$toastShow(data.msg);
        });
    };

    _storeProduct = (productId) => {
        this.$loadingShow();
        HomeAPI.getProductSpec({
            id: productId
        }).then((data) => {
            this.$loadingDismiss();
            this.setState({
                selectionData: data.data,
                modalVisible: !this.state.modalVisible
            });
        }).catch((data) => {
            this.$loadingDismiss();
            this.$toastShow(data.msg);
        });
    };

    _goBack = () => {
        this.$navigateBack();
    };

    _changeLayout = () => {
        this.setState({
            isHorizontal: !this.state.isHorizontal
        });
    };


    _segmentOnPressAtIndex = (index) => {
        this.state.sortType = index + 1;
        this._productList();
    };

    _onPressAtIndex = (productId) => {
        this.$navigate(RouterMap.ProductDetailPage, { productId: productId });
    };

    //选择规格确认
    _selectionViewConfirm = (amount, priceId) => {
        this.$loadingShow();
        HomeAPI.addItem({
            'amount': amount,
            'priceId': priceId,
            'productId': this.state.productId
        }).then((data) => {
            this.$loadingDismiss();
        }).catch((error) => {
            this.$loadingDismiss();
            this.$toastShow(error.msg);
        });
    };
    //选择规格关闭
    _selectionViewClose = () => {

        this.setState({
            modalVisible: false
        });
    };

    _onPressToGwc = () => {

    };
    _onPressToTop = () => {
        this.refs.FlatListShow.scrollToOffset({ offset: 0 });
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

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <ResultSearchNav goBack={this._goBack}
                                 onSubmitEditing={this._onSubmitEditing}
                                 changeLayout={this._changeLayout} isHorizontal={this.state.isHorizontal}
                                 value={this.params.keywords}/>
                <ResultSegmentView segmentOnPressAtIndex={this._segmentOnPressAtIndex}/>
                <FlatList
                    ref='FlatListShow'
                    style={this.state.isHorizontal ? { marginLeft: 10, marginRight: 15 } : null}
                    renderItem={this._renderItem}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                    numColumns={this.state.isHorizontal ? 2 : 1}
                    key={this.state.isHorizontal ? 'hShow' : 'vShow'}
                    data={this.state.productList}>
                </FlatList>

                <View style={{ position: 'absolute', right: 15, bottom: 15 }}>
                    <TouchableWithoutFeedback onPress={this._onPressToGwc}>
                        <Image source={toGwc}/>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this._onPressToTop}>
                        <Image style={{ marginTop: 5 }} source={toTop}/>
                    </TouchableWithoutFeedback>
                </View>


                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}>
                    <SelectionPage selectionViewConfirm={this._selectionViewConfirm}
                                   selectionViewClose={this._selectionViewClose} data={this.state.selectionData}/>
                </Modal>
            </View>
        );
    }
}
