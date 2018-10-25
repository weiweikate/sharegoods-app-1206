import React from 'react';
import {
    View,
    StyleSheet,
    SectionList,
    Modal,
    Image,
    FlatList,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';

import BasePage from '../../BasePage';
import TopicDetailHeaderView from './components/TopicDetailHeaderView';
import TopicDetailSegmentView from './components/TopicDetailSegmentView';
import ScreenUtils from '../../utils/ScreenUtils';
import xiangqing_btn_return_nor from './res/xiangqing_btn_return_nor.png';
import xiangqing_btn_more_nor from './res/xiangqing_btn_more_nor.png';
import HTML from 'react-native-render-html';
import HomeAPI from '../home/api/HomeAPI';
import TopicApi from './api/TopicApi';
import user from '../../model/user';
import TopicDetailSelectPage from './TopicDetailSelectPage';
import PackageDetailSelectPage from './PackageDetailSelectPage';
import CommShareModal from '../../comm/components/CommShareModal';
import TopicDetailShowModal from './components/TopicDetailShowModal';

export default class TopicDetailPage extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            //类型: 1.秒杀 2.降价拍 3.礼包 4.助力免费领 5.专题 99.普通产品
            activityType: this.params.activityType,
            //参数还是详情
            selectedIndex: 0,
            //是否显示规格选择
            modalVisible: false,
            //数据
            data: {},
            //活动数据
            activityData: {}
        };
    }

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
        this._getActivityData();
    }

    //数据
    _getActivityData = () => {
        if (this.state.activityType === 1) {
            this.$loadingShow();
            TopicApi.seckill_findByCode({
                code: this.params.activityCode
            }).then((data) => {
                this.state.activityData = data.data || {};
                this._getProductDetail(this.state.activityData.productId);
                this.TopicDetailHeaderView.updateTime(this.state.activityData, this.state.activityType);
            }).catch((error) => {
                this.$loadingDismiss();
                this.$toastShow(error.msg);
            });
        } else if (this.state.activityType === 2) {
            this.$loadingShow();
            TopicApi.activityDepreciate_findById({
                code: this.params.activityCode
            }).then((data) => {
                this.state.activityData = data.data || {};
                this._getProductDetail(this.state.activityData.productId);
                this.TopicDetailHeaderView.updateTime(this.state.activityData, this.state.activityType);
            }).catch((error) => {
                this.$loadingDismiss();
                this.$toastShow(error.msg);
            });
        } else if (this.state.activityType === 3) {
            this.$loadingShow();
            TopicApi.findActivityPackageDetail({
                code: this.params.activityCode
            }).then((data) => {
                this.$loadingDismiss();
                this.setState({
                    data: data.data || {}
                }, () => {
                    if (this.state.data.type === 2) {//1普通礼包  2升级礼包
                        this.TopicDetailShowModal.show('温馨提示');
                    }
                });
            }).catch((error) => {
                this.$loadingDismiss();
                this.$toastShow(error.msg);
            });
        }
    };

    _getProductDetail = (productId) => {
        HomeAPI.getProductDetail({
            id: productId
        }).then((data) => {
            this.$loadingDismiss();
            this.setState({
                data: data.data || {}
            });
        }).catch((error) => {
            this.setState({
                data: error || {}
            });
            this.$loadingDismiss();
            this.$toastShow(error.msg);
        });
    };

    //订阅
    _followAction = () => {
        const itemData = this.state.activityData;
        let param = {
            'activityId': itemData.id,
            'activityType': this.state.activityType,
            'type': itemData.notifyFlag ? 0 : 1,
            'userId': user.id
        };
        TopicApi.followAction(
            param
        ).then(result => {
            this._getActivityData();
            this.$toastShow(result.msg);
        }).catch(error => {
            this.$toastShow(error.msg);
        });

    };

    //选择规格确认 秒杀 降价拍
    _selectionViewConfirm = (amount, priceId) => {
        let orderProducts = [];
        orderProducts.push({
            priceId: priceId,
            num: amount,
            code: this.state.activityData.activityCode
        });
        this.$navigate('order/order/ConfirOrderPage', {
            orderParamVO: {
                orderType: this.state.activityType,
                orderProducts: orderProducts
            }
        });
    };

    //选择规格确认 礼包
    _selectionViewPakageConfirm = (amount, selectData) => {
        let priceList = [];
        selectData.forEach((item) => {
            priceList.push({
                num: 1,
                priceId: item.productPriceId,
                productId: item.productId,
                productName: item.productName,
                sourceId: item.id,
                spec: item.specValues,
                specImg: item.specImg
            });
        });

        let orderProducts = [{
            num: 1,
            priceId: this.state.data.id,
            productId: this.state.data.id,
            priceList: priceList
        }];

        this.$navigate('order/order/ConfirOrderPage', {
            orderParamVO: {
                packageCode: this.params.activityCode,
                orderType: this.state.activityType,
                orderProducts: orderProducts
            }
        });
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

    //立即购买
    _bottomAction = (type) => {
        if (type === 1) {//设置提醒
            this._followAction();
        } else if (type === 2) {//立即拍
            this.setState({
                modalVisible: true
            });
        }
    };

    _renderListHeader = () => {
        return <TopicDetailHeaderView data={this.state.data}
                                      ref={(e) => {
                                          this.TopicDetailHeaderView = e;
                                      }}
                                      activityType={this.state.activityType}
                                      activityData={this.state.activityData}
                                      showDetailModal={() => {
                                          this.TopicDetailShowModal.show('降价拍规则');
                                      }}/>;
    };

    _renderSectionHeader = () => {
        return <TopicDetailSegmentView segmentViewOnPressAtIndex={this._segmentViewOnPressAtIndex}/>;
    };

    _renderItem = () => {
        let { product = {} } = this.state.data;
        if (this.state.selectedIndex === 0) {
            return <HTML html={this.state.activityType === 3 ? this.state.data.content : product.content}
                         imagesMaxWidth={ScreenUtils.width}
                         containerStyle={{ backgroundColor: '#fff' }}/>;
        } else {
            return <View style={{ backgroundColor: 'white' }}>
                <FlatList
                    style={{ marginHorizontal: 16, marginVertical: 16, borderWidth: 0.5, borderColor: '#eee' }}
                    renderItem={this._renderSmallItem}
                    ItemSeparatorComponent={this._renderSeparatorComponent}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                    data={this.state.activityType === 3 ? this.state.data.paramValueList || [] : this.state.data.paramList || []}/>
            </View>;
        }
    };

    _renderSmallItem = ({ item }) => {
        return <View style={{ flexDirection: 'row', height: 35 }}>
            <View style={{ backgroundColor: '#DDDDDD', width: 70, justifyContent: 'center' }}>
                <Text style={{
                    marginLeft: 10,
                    color: '#222222',
                    fontSize: 12
                }}>{this.state.activityType === 3 ? item.param || '' : item.paramName || ''}</Text>
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
        let bottomTittle, colorType;
        if (this.state.activityType === 3) {
            bottomTittle = '立即购买';
            colorType = 2;
        } else {
            const { notifyFlag, surplusNumber, limitNumber, limitFlag, status } = this.state.activityData;
            if (status === 1) {
                if (notifyFlag === 1) {
                    bottomTittle = '开始前3分钟提醒';
                } else {
                    bottomTittle = '设置提醒';
                    colorType = 1;
                }
            } else if (status === 4 || status === 5) {
                bottomTittle = '已结束';
            } else {
                if (surplusNumber === 0) {
                    bottomTittle = '已抢光';
                } else if (limitNumber !== -1 && limitFlag === 1) {
                    bottomTittle = `每人限购${limitNumber}次（您已购买过本商品）`;
                } else {
                    bottomTittle = '立即拍';
                    colorType = 2;
                }
            }
        }

        let productPrice, productName, productImgUrl;
        if (this.state.activityType === 3) {
            const { name, levelPrice, imgUrl } = this.state.data || {};
            productPrice = levelPrice;
            productName = name;
            productImgUrl = imgUrl;
        } else {
            const { price = 0, product = {} } = this.state.data || {};
            const { name = '', imgUrl } = product;
            productPrice = price;
            productName = `${name}`;
            productImgUrl = imgUrl;
        }

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
                        this.shareModal.open();
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
                <View style={{ height: ScreenUtils.isIOSX ? 49 + 33 : 49, backgroundColor: 'white' }}>
                    <TouchableOpacity style={{
                        height: 49,
                        backgroundColor: colorType === 1 ? '#33B4FF' : (colorType === 2 ? '#D51243' : '#CCCCCC'),
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} onPress={() => this._bottomAction(colorType)} disabled={!(colorType === 1 || colorType === 2)}>
                        <Text style={{
                            color: 'white',
                            fontSize: 14
                        }}>{bottomTittle}</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}>
                    {this.state.activityType === 3 ?
                        <PackageDetailSelectPage selectionViewConfirm={this._selectionViewPakageConfirm}
                                                 selectionViewClose={this._selectionViewClose}
                                                 data={this.state.data}
                                                 activityType={this.state.activityType}/> :
                        <TopicDetailSelectPage selectionViewConfirm={this._selectionViewConfirm}
                                               selectionViewClose={this._selectionViewClose}
                                               data={this.state.activityData}
                                               activityType={this.state.activityType}/>}

                </Modal>

                <CommShareModal ref={(ref) => this.shareModal = ref}
                                type={'Image'}
                                imageJson={{
                                    imageUrlStr: productImgUrl,
                                    titleStr: productName,
                                    priceStr: `￥${productPrice}`,
                                    QRCodeStr: `http://testh5.sharegoodsmall.com/product/${this.params.activityType}/${this.params.activityCode}`
                                }}
                                webJson={{
                                    title: productName,
                                    dec: '商品详情',
                                    linkUrl: `http://testh5.sharegoodsmall.com/product/${this.params.activityType}/${this.params.activityCode}`,
                                    thumImage: productImgUrl
                                }}/>
                <TopicDetailShowModal ref={(ref) => this.TopicDetailShowModal = ref}/>
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

