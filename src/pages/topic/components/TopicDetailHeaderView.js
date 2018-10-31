import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import ViewPager from '../../../components/ui/ViewPager';
import xjt_03 from '../res/xjt_03.png';
import ActivityView from './ActivityView';
import { isNoEmpty } from '../../../utils/StringUtils';
import StringUtils from '../../../utils/StringUtils';
import VideoView from '../../../components/ui/video/VideoView';
// import user from '../../../model/user';

const { px2dp } = ScreenUtils;
/**
 * 商品详情头部view
 */

export default class TopicDetailHeaderView extends Component {


    static propTypes = {
        data: PropTypes.object.isRequired,
        activityData: PropTypes.object.isRequired,
        activityType: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            swiperShow: false,
            haveVideo: false
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                swiperShow: true
            });
        }, 100);
    }

    updateTime(activityData, activityType) {
        this.ActivityView.saveActivityViewData(activityData, activityType);
    }

    getImageList = (data) => {
        if (data) {
            return data.map((item, index) => {
                return item.originalImg;
            });
        } else {
            return null;
        }
    };

    renderViewPageItem = (item, index) => {
        const { activityType } = this.props;
        if (item.videoUrl) {
            return <VideoView videoUrl={item.videoUrl} videoCover={item.videoCover}/>;
        } else {
            const { originalImg } = item;
            let imgList = this.getImageList(activityType === 3 ? this.props.data.imgFileList : this.props.data.productImgList);
            return (
                <TouchableWithoutFeedback onPress={() => {
                    const params = { imageUrls: imgList, index: this.state.haveVideo ? index - 1 : index };
                    const { navigation } = this.props;
                    navigation && navigation.navigate('home/product/CheckBigImagesView', params);
                }}>
                    <Image source={{ uri: originalImg }}
                           style={{ height: ScreenUtils.autoSizeWidth(377), width: ScreenUtils.width }}
                           resizeMode="cover"
                    />
                </TouchableWithoutFeedback>
            );
        }
    };
    _renderPagination = (index, total) => <View style={styles.indexView}>
        <Text style={styles.text}>{index + 1} / {total}</Text>
    </View>;

    render() {
        const { activityType } = this.props;
        let bannerImgList, tittle, freightValue, monthSale;
        let nowPrice, oldPrice, levelTypeName, afterSaleServiceDaysTT;

        if (activityType === 3) {
            const { imgFileList = [], name, levelPrice, originalPrice, freightTemplatePrice, saleNum, userLevelTypeName, aferServiceDays, videoUrl, imgUrl } = this.props.data || {};
            //有视频第一个添加为视频
            let productImgListTemp = [...imgFileList];
            if (StringUtils.isNoEmpty(videoUrl)) {
                this.state.haveVideo = true;
                productImgListTemp.unshift({ videoUrl: videoUrl, videoCover: imgUrl });
            } else {
                this.state.haveVideo = false;
            }
            bannerImgList = productImgListTemp;
            tittle = name;
            nowPrice = levelPrice;
            oldPrice = originalPrice;
            freightValue = freightTemplatePrice;
            monthSale = saleNum;
            levelTypeName = userLevelTypeName;
            afterSaleServiceDaysTT = aferServiceDays;
        } else {
            const { productImgList = [], freight, monthSaleTotal, product = {} } = this.props.data || {};
            const { name, afterSaleServiceDays, videoUrl, imgUrl } = product;

            //有视频第一个添加为视频
            let productImgListTemp = [...productImgList];
            if (StringUtils.isNoEmpty(videoUrl)) {
                this.state.haveVideo = true;
                productImgListTemp.unshift({ videoUrl: videoUrl, videoCover: imgUrl });
            } else {
                this.state.haveVideo = false;
            }

            bannerImgList = productImgListTemp;
            tittle = `${name}`;
            freightValue = freight;
            monthSale = monthSaleTotal;
            afterSaleServiceDaysTT = afterSaleServiceDays;
        }
        return (
            <View>
                {bannerImgList.length > 0 && this.state.swiperShow ? <ViewPager swiperShow={true}
                                                                                loop={false}
                                                                                height={ScreenUtils.autoSizeWidth(377)}
                                                                                arrayData={bannerImgList}
                                                                                renderItem={this.renderViewPageItem}
                                                                                renderPagination={this._renderPagination}/> :
                    <View style={{ height: ScreenUtils.autoSizeWidth(377), width: ScreenUtils.width }}/>}
                {activityType === 3 ? null : <ActivityView ref={(e) => {
                    this.ActivityView = e;
                }} activityData={this.props.activityData} activityType={activityType}/>}
                <View style={{ backgroundColor: 'white' }}>
                    <View style={{ marginLeft: 16, width: ScreenUtils.width - 32 }}>
                        <Text style={{
                            marginTop: 14,
                            color: '#222222',
                            fontSize: 15
                        }}>{tittle}</Text>
                        {activityType === 3 ?
                            <View style={{ flexDirection: 'row', marginTop: 21, alignItems: 'center' }}>
                                <Text style={{ color: '#D51243', fontSize: 18 }}>{`￥${nowPrice}起`}</Text>
                                <Text style={{
                                    marginLeft: 5,
                                    color: '#BBBBBB',
                                    fontSize: 10,
                                    textDecorationLine: 'line-through'
                                }}>{`￥${oldPrice}`}</Text>
                                <Text style={{
                                    marginLeft: 5,
                                    backgroundColor: 'red',
                                    color: '#FFFFFF',
                                    fontSize: 10, paddingHorizontal: 5
                                }}>{levelTypeName}</Text>
                            </View> : null}
                        <View style={{ flexDirection: 'row', marginTop: 18, marginBottom: 14, alignItems: 'center' }}>
                            <Text style={{
                                color: '#BBBBBB',
                                fontSize: 11
                            }}>快递：{freightValue === 0 ? `包邮` : `${isNoEmpty(freightValue) ? freightValue : ''}元`}</Text>
                            <Text style={{
                                color: '#666666',
                                fontSize: 13,
                                marginLeft: ScreenUtils.autoSizeWidth(108)
                            }}>{`月销售${isNoEmpty(monthSale) ? monthSale : 0}笔`}</Text>
                        </View>
                    </View>
                </View>
                {activityType === 2 ?
                    <View style={{ backgroundColor: 'white', marginTop: 10 }}>
                        <TouchableOpacity style={{
                            height: 45,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }} onPress={this.props.showDetailModal}>
                            <Text style={{ color: '#666666', fontSize: 13, marginLeft: 16 }}>抢拍规则</Text>
                            <Image style={{ marginRight: 16 }} source={xjt_03}/>
                        </TouchableOpacity>
                        <View style={{ height: 1, backgroundColor: '#eeee' }}/>
                    </View> : null}
                <View style={{ backgroundColor: 'white', marginTop: activityType === 2 ? 0 : 10, marginBottom: 12 }}>
                    <View style={{
                        flexDirection: 'row',
                        marginLeft: 16,
                        width: ScreenUtils.width - 32,
                        marginVertical: 16,
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: '#D51243', fontSize: 13 }}>服务</Text>
                        <Text style={{
                            marginLeft: 11,
                            color: '#666666',
                            fontSize: 13
                        }}>{`正品保证·急速发货 ${afterSaleServiceDaysTT === 0 ? `不支持退换货` : `${afterSaleServiceDaysTT > 30 ? 30 : afterSaleServiceDaysTT}天无理由退换`}`}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    indexView: {
        position: 'absolute',
        height: px2dp(20),
        borderRadius: px2dp(10),
        right: px2dp(14),
        bottom: px2dp(20),
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: '#fff',
        fontSize: px2dp(10),
        paddingHorizontal: 8
    }
});
