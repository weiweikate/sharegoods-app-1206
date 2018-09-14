import React from 'react';
import {
    View,
    FlatList,
    Image,
    TouchableWithoutFeedback
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


export default class SearchResultPage extends BasePage {


    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.state = {
            isHorizontal: true,
            productList: []
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
            page: 1,
            pageSize: 10,
            sortModel: 1,
            sortType: 3,
            time: DateUtils.formatDate(new Date())
        }).then((data) => {
            this.$loadingDismiss();
            this.setState({
                hotData: data
            });
        }).catch((data) => {
            this.$loadingDismiss();
            this.$toastShow(data.message);
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

    _onSubmitEditing = () => {

    };
    _onPressAtIndex = () => {
        this.$navigate(RouterMap.ProductDetailPage);
    };
    _storeProduct = () => {

    };

    _onPressToGwc = () => {

    };
    _onPressToTop = () => {
        this.refs.FlatListShow.scrollToOffset({ offset: 0 });
    };

    _renderItem = () => {
        if (this.state.isHorizontal) {
            return (<ResultHorizontalRow onPressAtIndex={this._onPressAtIndex} storeProduct={this._storeProduct}/>);
        } else {
            return (<ResultVerticalRow onPressAtIndex={this._onPressAtIndex} storeProduct={this._storeProduct}/>);
        }
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <ResultSearchNav goBack={this._goBack}
                                 onSubmitEditing={this._onSubmitEditing}
                                 changeLayout={this._changeLayout} isHorizontal={this.state.isHorizontal}/>
                <ResultSegmentView onPressAtIndex={this._onPressAtIndex}/>
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
            </View>
        );
    }
}
