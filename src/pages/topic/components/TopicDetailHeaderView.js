import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
// import ViewPager from '../../../components/ui/ViewPager';
import ActivityView from './ActivityView';
import { isNoEmpty } from '../../../utils/StringUtils';
import StringUtils from '../../../utils/StringUtils';
import DesignRule from '../../../constants/DesignRule';
import TopicDetailBanner from './TopicDetailBanner';
import {
    MRText as Text
} from '../../../components/ui';

// const { px2dp } = ScreenUtils;
import res from '../res';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import DetailHeaderScoreView from '../../product/components/DetailHeaderScoreView';
import RES from '../../../comm/res';

const xjt_03 = res.xjt_03;
const arrow_right = RES.button.arrow_right_black;

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
        const { activityType, data, navigation, serviceAction } = this.props;
        let bannerImgList, tittle, secondNameS, freightValue, monthSale;
        let nowPrice, oldPrice, levelTypeName, restrictionsTT;

        if (activityType === 3) {
            const { imgFileList, name, levelPrice, originalPrice, freightTemplatePrice, saleNum, userLevelTypeName, videoUrl, imgUrl } = this.props.data || {};
            //有视频第一个添加为视频
            let productImgListTemp = [...(imgFileList || [])];
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
        } else {
            const { imgFileList, freight, monthSaleCount, name, secondName, restrictions, videoUrl, imgUrl } = this.props.data || {};

            //有视频第一个添加为视频
            let productImgListTemp = [...(imgFileList || [])];
            productImgListTemp.unshift({ originalImg: imgUrl });
            if (StringUtils.isNoEmpty(videoUrl)) {
                this.state.haveVideo = true;
                productImgListTemp.unshift({ videoUrl: videoUrl, videoCover: imgUrl });
            } else {
                this.state.haveVideo = false;
            }
            bannerImgList = productImgListTemp;
            tittle = `${name}`;
            secondNameS = secondName;
            freightValue = freight;
            monthSale = monthSaleCount;
            restrictionsTT = restrictions;
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
                            fontSize: 13
                        }} allowFontScaling={false}>{tittle}</Text>
                        {StringUtils.isNoEmpty(secondNameS) ? <Text style={{
                            marginTop: 5, color: DesignRule.textColor_secondTitle,
                            fontSize: 13
                        }}>{secondNameS}</Text> : null}
                        {activityType === 3 ?
                            <View style={{ flexDirection: 'row', marginTop: 21, alignItems: 'center' }}>
                                <Text style={{ color: DesignRule.mainColor, fontSize: 18 }}
                                      allowFontScaling={false}>{`￥${nowPrice}起`}</Text>
                                <Text style={{
                                    marginLeft: 5,
                                    color: DesignRule.textColor_instruction,
                                    fontSize: 10,
                                    textDecorationLine: 'line-through'
                                }} allowFontScaling={false}>{`￥${oldPrice}`}</Text>
                                <Text style={{
                                    marginLeft: 5,
                                    backgroundColor: DesignRule.mainColor,
                                    color: 'white',
                                    fontSize: 10, paddingHorizontal: 5
                                }} allowFontScaling={false}>{levelTypeName}</Text>
                            </View> : null}
                        <View style={{ flexDirection: 'row', marginTop: 18, marginBottom: 14, alignItems: 'center' }}>
                            <Text style={{
                                color: DesignRule.textColor_instruction,
                                fontSize: 11
                            }}
                                  allowFontScaling={false}>快递：{freightValue === 0 ? `包邮` : `${isNoEmpty(freightValue) ? freightValue : ''}元`}</Text>
                            <Text style={{
                                color: DesignRule.textColor_instruction,
                                fontSize: 11,
                                marginLeft: ScreenUtils.autoSizeWidth(108)
                            }} allowFontScaling={false}>{`近期销量: ${isNoEmpty(monthSale) ? monthSale : 0}`}</Text>
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
                            }} allowFontScaling={false}>抢拍规则</Text>
                            <Image style={{ marginRight: 16 }} source={xjt_03}/>
                        </TouchableOpacity>
                        <View style={{ height: 1, backgroundColor: DesignRule.lineColor_inColorBg }}/>
                    </View> : null}
                <NoMoreClick style={styles.serviceView} onPress={activityType !== 3 ? serviceAction : null}>
                    <Text style={styles.serviceNameText}>服务</Text>
                    <Text style={styles.serviceValueText} numberOfLines={1}>
                        {`质量保障·48小时发货${(restrictionsTT & 4) === 4 ? `·7天退换` : ``}${(restrictionsTT & 8) === 8 ? `·节假日发货` : ``}`}
                    </Text>
                    {activityType !== 3 ? <Image source={arrow_right}/> : null}
                </NoMoreClick>
                {activityType === 3 ? null :
                    <DetailHeaderScoreView style={{ marginBottom: 10 }} pData={data} navigation={navigation}/>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    /**服务**/
    serviceView: {
        flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10, paddingHorizontal: 15,
        backgroundColor: 'white', height: 40
    },
    serviceNameText: {
        color: DesignRule.textColor_instruction, fontSize: 13
    },
    serviceValueText: {
        flex: 1, marginLeft: 15,
        color: DesignRule.textColor_secondTitle, fontSize: 12
    }
});
