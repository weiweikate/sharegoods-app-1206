import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    // StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
// import ViewPager from '../../../components/ui/ViewPager';
import ActivityView from './ActivityView';
import { isNoEmpty } from '../../../utils/StringUtils';
import StringUtils from '../../../utils/StringUtils';
import DesignRule from 'DesignRule';
import TopicDetailBanner from './TopicDetailBanner';

// const { px2dp } = ScreenUtils;
import res from '../res';

const xjt_03 = res.xjt_03;
/**
 * 商品详情头部view
 */

export default class TopicDetailHeaderView extends Component {


    static propTypes = {
        data: PropTypes.object.isRequired,
        activityData: PropTypes.object.isRequired,
        activityType: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            haveVideo: false
        };
    }

    componentDidMount() {
    }

    updateTime(activityData, activityType, callBack) {
        this.ActivityView.saveActivityViewData(activityData, activityType, callBack);
    }

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
            const { imgFileList, freight, monthSaleCount, name, afterSaleServiceDays, videoUrl, imgUrl } = this.props.data || {};

            //有视频第一个添加为视频
            let productImgListTemp = [...(imgFileList || [])];
            if (StringUtils.isNoEmpty(videoUrl)) {
                this.state.haveVideo = true;
                productImgListTemp.unshift({ videoUrl: videoUrl, videoCover: imgUrl });
            } else {
                this.state.haveVideo = false;
            }

            bannerImgList = productImgListTemp;
            tittle = `${name}`;
            freightValue = freight;
            monthSale = monthSaleCount;
            afterSaleServiceDaysTT = afterSaleServiceDays;
        }
        return (
            <View>
                {<TopicDetailBanner bannerImgList={bannerImgList} haveVideo={this.state.haveVideo}
                                    navigation={this.props.navigation}/>}
                {activityType === 3 ? null : <ActivityView ref={(e) => {
                    this.ActivityView = e;
                }} activityData={this.props.activityData} activityType={activityType}/>}
                <View style={{ backgroundColor: 'white' }}>
                    <View style={{ marginLeft: 16, width: ScreenUtils.width - 32 }}>
                        <Text style={{
                            marginTop: 14,
                            color: DesignRule.textColor_mainTitle,
                            fontSize: 15
                        }}>{tittle}</Text>
                        {activityType === 3 ?
                            <View style={{ flexDirection: 'row', marginTop: 21, alignItems: 'center' }}>
                                <Text style={{ color: DesignRule.mainColor, fontSize: 18 }}>{`￥${nowPrice}起`}</Text>
                                <Text style={{
                                    marginLeft: 5,
                                    color: DesignRule.textColor_instruction,
                                    fontSize: 10,
                                    textDecorationLine: 'line-through'
                                }}>{`￥${oldPrice}`}</Text>
                                <Text style={{
                                    marginLeft: 5,
                                    backgroundColor: DesignRule.mainColor,
                                    color: 'white',
                                    fontSize: 10, paddingHorizontal: 5
                                }}>{levelTypeName}</Text>
                            </View> : null}
                        <View style={{ flexDirection: 'row', marginTop: 18, marginBottom: 14, alignItems: 'center' }}>
                            <Text style={{
                                color: DesignRule.textColor_instruction,
                                fontSize: 11
                            }}>快递：{freightValue === 0 ? `包邮` : `${isNoEmpty(freightValue) ? freightValue : ''}元`}</Text>
                            <Text style={{
                                color: DesignRule.textColor_instruction,
                                fontSize: 11,
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
                            <Text style={{
                                color: DesignRule.textColor_secondTitle,
                                fontSize: 13,
                                marginLeft: 16
                            }}>抢拍规则</Text>
                            <Image style={{ marginRight: 16 }} source={xjt_03}/>
                        </TouchableOpacity>
                        <View style={{ height: 1, backgroundColor: DesignRule.lineColor_inColorBg }}/>
                    </View> : null}
                <View style={{ backgroundColor: 'white', marginTop: activityType === 2 ? 0 : 10, marginBottom: 12 }}>
                    <View style={{
                        flexDirection: 'row',
                        marginLeft: 16,
                        width: ScreenUtils.width - 32,
                        marginVertical: 16,
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: DesignRule.textColor_instruction, fontSize: 13 }}>服务</Text>
                        <Text style={{
                            marginLeft: 11,
                            color: DesignRule.textColor_secondTitle,
                            fontSize: 12
                        }}>{`正品保证·急速发货 ${afterSaleServiceDaysTT === 0 ? `无售后服务` : `${afterSaleServiceDaysTT > 30 ? 30 : afterSaleServiceDaysTT || ''}天无理由退换`}`}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

// const styles = StyleSheet.create({
//     indexView: {
//         position: 'absolute',
//         height: px2dp(20),
//         borderRadius: px2dp(10),
//         right: px2dp(14),
//         bottom: px2dp(20),
//         backgroundColor: 'rgba(0, 0, 0, 0.7)',
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     text: {
//         color: '#fff',
//         fontSize: px2dp(10),
//         paddingHorizontal: 8
//     }
// });
