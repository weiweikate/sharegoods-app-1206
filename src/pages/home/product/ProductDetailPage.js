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
import CommShareModal from '../../../comm/components/CommShareModal';
import HTML from 'react-native-render-html';
import DetailNavShowModal from './components/DetailNavShowModal';

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
            selectedIndex: 0,
            //活动数据
            activityData: {},
            activityType: 0,//请求到数据查看类型
        };
    }

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
        this._getProductDetail();
    }

    //数据
    _getProductDetail = () => {
        this.$loadingShow();
        if (this.params.productId) {
            HomeAPI.getProductDetail({
                id: this.params.productId
            }).then((data) => {
                this.$loadingDismiss();
                this._savaData(data.data || {});
            }).catch((error) => {
                this.$loadingDismiss();
                this.$toastShow(error.msg);
            });
        } else {
            HomeAPI.getProductDetailByCode({
                code: this.params.productCode
            }).then((data) => {
                this.$loadingDismiss();
                this._savaData(data.data || {});
            }).catch((error) => {
                this.$loadingDismiss();
                this.$toastShow(error.msg);
            });
        }
    };

    _getQueryByProductId = (productId) => {
        if (!productId) {
            return;
        }
        HomeAPI.queryByProductId({
            productId: productId
        }).then((data) => {
            this.$loadingDismiss();
            let dataTemp = data.data || {};
            this.state.activityType = dataTemp.activityType;
            if (dataTemp.activityType === 2 && dataTemp.depreciate) {
                this.setState({
                    activityData: dataTemp.depreciate
                });
            } else if (dataTemp.activityType === 1 && dataTemp.seckill) {
                this.setState({
                    activityData: dataTemp.seckill
                });
            }
            // this.DetailHeaderView.updateTime(this.state.activityData, this.state.activityType);
        }).catch((error) => {
            this.$loadingDismiss();
            this.$toastShow(error.msg);
        });
    };

    _savaData = (data) => {
        const { product = {} } = data;
        this._getQueryByProductId(product.id);
        const { specMap, priceList } = data;
        //修改specMap每个元素首尾增加'，'
        for (let key in specMap) {
            specMap[key].forEach((item) => {
                if (String(item.id).indexOf(',') === -1) {
                    item.id = `,${item.id},`;
                }
            });
        }
        //修改priceList中的specIds首尾增加','
        priceList.forEach((item) => {
            item.specIds = `,${item.specIds},`;
        });
        this.setState({
            data: data
        });
    };

    _productActivityViewAction = () => {
        if (this.state.activityType === 1 || this.state.activityType === 2) {
            this.$navigate('topic/TopicDetailPage', {
                activityCode: this.state.activityData.activityCode,
                activityType: this.state.activityType
            });
        }
    };

    //去购物车
    _bottomViewAction = (type) => {
        switch (type) {
            case 'goGwc': {
                this.$navigate('shopCart/ShopCart', {
                    hiddeLeft: false
                });
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
                num: amount,
                productId: this.state.data.product.id
            });
            this.$navigate('order/order/ConfirOrderPage', {
                orderParamVO: {
                    orderType: 99,
                    orderProducts: orderProducts
                }
            });
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
        return <DetailHeaderView ref={(e) => {
            this.DetailHeaderView = e;
        }} data={this.state.data} activityData={this.state.activityData} activityType={this.state.activityType}
                                 productActivityViewAction={this._productActivityViewAction}/>;
    };

    _renderSectionHeader = () => {
        return <DetailSegmentView segmentViewOnPressAtIndex={this._segmentViewOnPressAtIndex}/>;
    };

    _renderItem = () => {
        let { product } = this.state.data;
        product = product || {};
        if (this.state.selectedIndex === 0) {
            return <HTML html={product.content} imagesMaxWidth={ScreenUtils.width}
                         containerStyle={{ backgroundColor: '#fff' }}/>;
        } else {
            return <View style={{ backgroundColor: 'white' }}>
                <FlatList
                    style={{ marginHorizontal: 16, marginVertical: 16, borderWidth: 0.5, borderColor: '#eee' }}
                    renderItem={this._renderSmallItem}
                    ItemSeparatorComponent={this._renderSeparatorComponent}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                    data={this.state.data.paramList || []}/>
            </View>;
        }
    };

    _renderSmallItem = ({ item }) => {
        return <View style={{ flexDirection: 'row', height: 35 }}>
            <View style={{ backgroundColor: '#DDDDDD', width: 70, justifyContent: 'center' }}>
                <Text style={{ marginLeft: 10, color: '#222222', fontSize: 12 }}>{item.paramName || ''}</Text>
            </View>
            <Text style={{
                flex: 1,
                alignSelf: 'center',
                marginLeft: 20,
                color: '#999999',
                fontSize: 12
            }}>{item.paramValue || ' '}</Text>
        </View>;
    };

    _renderSeparatorComponent = () => {
        return <View style={{ height: 0.5, backgroundColor: '#eee' }}/>;
    };
    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
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
        const { price = 0, product = {} } = this.state.data || {};
        const { name = '', imgUrl } = product;

        return (
            <View style={styles.container}>
                <View ref={(e) => this._refHeader = e} style={styles.opacityView}/>
                <View style={styles.transparentView}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.$navigateBack();
                    }}>
                        <Image source={xiangqing_btn_return_nor}/>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => {
                        this.DetailNavShowModal.show((item) => {
                            switch (item.index) {
                                case 0:
                                    this.$navigate('message/MessageCenterPage');
                                    break;
                                case 1:
                                    this.props.navigation.popToTop();
                                    break;
                                case 2:
                                    this.shareModal.open();
                                    break;
                            }
                        });
                    }}>
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
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                type={'Image'}
                                imageJson={{
                                    imageUrlStr: imgUrl,
                                    titleStr: `${name}`,
                                    priceStr: `￥${price}`,
                                    QRCodeStr: `http://testh5.sharegoodsmall.com/99/${product.id}`
                                }}
                                webJson={{
                                    title: `${name}`,
                                    dec: '商品详情',
                                    linkUrl: `http://testh5.sharegoodsmall.com/99/${product.id}`,
                                    thumImage: imgUrl
                                }}/>
                <DetailNavShowModal ref={(ref) => this.DetailNavShowModal = ref}/>
            </View>
        );
    }

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

