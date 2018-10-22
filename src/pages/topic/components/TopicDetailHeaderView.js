import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import ViewPager from '../../../components/ui/ViewPager';
import UIImage from '../../../components/ui/UIImage';
import xjt_03 from '../res/xjt_03.png';
import ActivityView from './ActivityView';
import { isNoEmpty } from '../../../utils/StringUtils';

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
            swiperShow: false
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                swiperShow: true
            });
        }, 0);
    }

    updateTime(activityData, activityType) {
        this.ActivityView.saveActivityViewData(activityData, activityType);
    }

    _clickItem = () => {

    };
    renderViewPageItem = (item) => {
        const { originalImg } = item;
        return (
            <UIImage
                source={{ uri: originalImg || '' }}
                style={{ height: ScreenUtils.autoSizeWidth(377), width: ScreenUtils.width }}
                onPress={this._clickItem}
                resizeMode="cover"
            />);
    };

    render() {
        const { activityType } = this.props;
        let bannerImgList, tittle, freightValue, monthSale;
        let nowPrice, oldPrice;

        if (activityType === 3) {
            const { imgFileList = [{}], name, levelPrice, originalPrice, freight, saleNum } = this.props.data || {};
            bannerImgList = imgFileList;
            tittle = name;
            nowPrice = levelPrice;
            oldPrice = originalPrice;
            freightValue = freight;
            monthSale = saleNum;
        } else {
            const { productImgList = [{}], freight, monthSaleTotal, product = {} } = this.props.data || {};
            const { name } = product;

            bannerImgList = productImgList;
            tittle = `${name}`;
            freightValue = freight;
            monthSale = monthSaleTotal;
        }
        return (
            <View>
                <ViewPager style={styles.ViewPager}
                           arrayData={bannerImgList}
                           renderItem={(item) => this.renderViewPageItem(item)}
                           dotStyle={{
                               height: 5,
                               width: 5,
                               borderRadius: 5,
                               backgroundColor: '#eeeeee',
                               opacity: 0.4
                           }}
                           swiperShow={this.state.swiperShow}
                           activeDotStyle={{
                               height: 5,
                               width: 30,
                               borderRadius: 5,
                               backgroundColor: '#eeeeee'
                           }}
                           height={ScreenUtils.autoSizeWidth(377)}
                           autoplay={true}/>
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
                                <Text style={{ marginLeft: 5, color: '#BBBBBB', fontSize: 10 }}>{`￥${oldPrice}`}</Text>
                            </View> : null}
                        <View style={{ flexDirection: 'row', marginTop: 18, marginBottom: 14, alignItems: 'center' }}>
                            <Text style={{
                                color: '#BBBBBB',
                                fontSize: 11
                            }}>快递：{freightValue === 0 ? `包邮` : `${isNoEmpty(freightValue) ? freightValue : 0}元`}</Text>
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
                        }}>
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
                        <Text style={{ marginLeft: 11, color: '#666666', fontSize: 13 }}>正品保证·急速发货 7天无理由退换</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ViewPager: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        width: ScreenUtils.width
    }
});
