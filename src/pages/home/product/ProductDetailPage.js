import React from 'react';
import {
    View,
    StyleSheet,
    SectionList,
    Modal,
    Image,
    FlatList,
    Text,
    TouchableWithoutFeedback
} from 'react-native';

import BasePage from '../../../BasePage';
import DetailHeaderView from './components/DetailHeaderView';
import DetailSegmentView from './components/DetailSegmentView';
import DetailBottomView from './components/DetailBottomView';
import SelectionPage from './SelectionPage';
import HomeAPI from '../api/HomeAPI';
import ScreenUtils from '../../../utils/ScreenUtils';
import xiangqing_btn_return_nor from './res/xiangqing_btn_return_nor.png';
import xiangqing_btn_more_nor from './res/xiangqing_btn_more_nor.png';
import shopCartCacheTool from '../../shopCart/model/ShopCartCacheTool';
import AutoHeightWebView from 'react-native-autoheight-webview';
import StringUtils from '../../../utils/StringUtils';

export default class ProductDetailPage extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            data: {},
            goType: '',
            selectedIndex: 0
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
        HomeAPI.getProductDetail({
            id: this.params.productId
        }).then((data) => {
            this.$loadingDismiss();
            this.setState({
                data: data.data
            });
        }).catch((error) => {
            if (error.code === 10009) {
                this.$navigate('login/login/LoginPage');
            }
            this.$loadingDismiss();
            this.$toastShow(error.msg);
        });
    };

    //去购物车
    _bottomViewAction = (type) => {
        switch (type) {
            case 'goGwc': {
                this.$navigate('shopCart/ShopCart');
            }
                break;
            case 'gwc':
            case 'buy': {
                this.setState({
                    goType: type,
                    modalVisible: true
                });
            }
                break;
        }
    };

    //选择规格确认
    _selectionViewConfirm = (amount, priceId) => {
        let orderProducts = [];
        if (this.state.goType === 'gwc') {
            let temp = {
                'amount': amount,
                'priceId': priceId,
                'productId': this.state.data.product.id
            };
            shopCartCacheTool.addGoodItem(temp);
        } else if (this.state.goType === 'buy') {
            orderProducts.push({
                priceId: priceId,
                num: 1,
                productId: this.state.data.product.id,
            });
            this.$navigate('order/order/ConfirOrderPage',{orderParamVO:{orderType:99,orderProducts:orderProducts}})
        }
    };

    //选择规格关闭
    _selectionViewClose = () => {
        this.setState({
            modalVisible: false
        });
    };

    //segment 详情0 参数1 选项
    _segmentViewOnPressAtIndex = (index) => {
        this.setState({
            selectedIndex: index
        });
    };

    _renderListHeader = () => {
        return <DetailHeaderView data={this.state.data}/>;
    };

    _renderSectionHeader = () => {
        return <DetailSegmentView segmentViewOnPressAtIndex={this._segmentViewOnPressAtIndex}/>;
    };

    _renderItem = () => {
        let { product } = this.state.data;
        product = product || {};
        if (StringUtils.isEmpty(product.content)) {
            return null;
        }
        if (this.state.selectedIndex === 0) {
            return <View>
                <AutoHeightWebView source={{ html: product.content }}/>
            </View>;
        } else {
            return <View style={{ backgroundColor: 'white' }}>
                <FlatList
                    style={{ marginHorizontal: 16, marginVertical: 16,borderWidth:0.5,borderColor:'#eee' }}
                    renderItem={this._renderSmallItem}
                    ItemSeparatorComponent={this._renderSeparatorComponent}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                    data={this.state.data.paramList || []}>
                </FlatList>
            </View>;
        }
    };

    _renderSmallItem = ({ item }) => {
        return <View style={{ flexDirection: 'row', height: 35 }}>
            <View style={{ backgroundColor: '#DDDDDD', width: 70, justifyContent: 'center' }}>
                <Text style={{ marginLeft: 10, color: '#222222', fontSize: 12 }}>{item.paramName || ''}</Text>
            </View>
            <Text style={{ flex:1,alignSelf:'center',marginLeft: 20, color: '#999999', fontSize: 12 }}>{item.paramValue || ' '}</Text>
        </View>;
    };

    _renderSeparatorComponent = ()=>{
        return <View style = {{height:0.5,backgroundColor:'#eee',}}/>
    }
    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        console.log(Y);
        if (Y < 100) {
            this.st = Y * 0.01;
        } else {
            this.st = 1;
        }
        this._refHeader.setNativeProps({
            opacity: this.st
        });
    };

    _render() {
        return (
            <View style={styles.container}>
                <View ref={(e) => this._refHeader = e} style={styles.opacityView}/>
                <View style={styles.transparentView}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.$navigateBack();
                    }}>
                        <Image source={xiangqing_btn_return_nor}/>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <Image source={xiangqing_btn_more_nor}/>
                    </TouchableWithoutFeedback>
                </View>

                <SectionList onScroll={this._onScroll}
                             ListHeaderComponent={this._renderListHeader}
                             renderSectionHeader={this._renderSectionHeader}
                             renderItem={this._renderItem}
                             keyExtractor={(item, index) => `${index}`}
                             showsVerticalScrollIndicator={false}
                             sections={[{ data: [{}] }]}
                             scrollEventThrottle={10}/>
                <DetailBottomView bottomViewAction={this._bottomViewAction}/>

                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}>
                    <SelectionPage selectionViewConfirm={this._selectionViewConfirm}
                                   selectionViewClose={this._selectionViewClose} data={this.state.data}/>
                </Modal>

            </View>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    opacityView: {
        height: ScreenUtils.headerHeight,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        opacity: 0
    },
    transparentView: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: ScreenUtils.statusBarHeight,
        left: 16,
        right: 16,
        zIndex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }

});

