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
import { timeDifc } from '../../../utils/DateUtils';

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

    _renderActivityView = () => {
        //markdownPrice 拍卖价 startPrice起拍价
        //originalPrice 原价
        //reseCount 预约购买人数
        //beginTime 开抢时间
        // notifyFlag推送消息 0未通知1已通知
        // 下次降价时间或者结束时间 activityTime floorPrice最低价=markdownPrice
        // date当前时间
        // surplusNumber 剩余数量 totalNumber总
        // endTime活动结束时间
        const { activityType } = this.props;
        let price = '', one = '', two = '', three = '', four = '';
        let begin = false;
        let end = false;
        if (activityType === 2) {
            const {
                startPrice, markdownPrice = '', originalPrice = '', reseCount = '',
                floorPrice, surplusNumber = '', totalNumber,
                activityTime, date, beginTime, endTime
            } = this.props.activityData;
            begin = beginTime > date;
            end = date > endTime;
            price = markdownPrice;
            if (begin) {
                one = '起拍价';
                two = `原价￥${startPrice}|${reseCount}人关注`;
                three = `距开抢 ${beginTime - date}`;
                four = `${beginTime}开拍`;
            } else {
                one = `原价￥${originalPrice}`;
                two = `${surplusNumber === 0 ? `已抢${totalNumber}件` : '起拍价'}`;
                three = markdownPrice === floorPrice ? `距结束 ${timeDifc(date, endTime) || ''}` : `距下次降价 ${timeDifc(date, activityTime) || ''}`;
                four = `${surplusNumber === 0 ? `已抢100%` : `还剩${surplusNumber}件`}`;
            }
        }

        return <View style={{
            height: 50,
            backgroundColor: begin ? '#33B4FF' : '#D51243',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <View style={{ marginLeft: 11, flexDirection: 'row' }}>
                <Text style={{ color: 'white', fontSize: 18 }}>￥<Text
                    style={{ fontSize: 40 }}>{price}</Text></Text>
                <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                    <Text style={{ color: '#F7F7F7', fontSize: 12 }}>{one}</Text>
                    <Text style={{
                        color: '#F7F7F7',
                        fontSize: 10,
                        marginTop: 4
                    }}>{two}</Text>
                </View>
            </View>
            <View style={{ marginRight: 15 }}>
                {end ?
                    <Text style={{ color: '#FFFC00', fontSize: 13 }}>活动结束</Text>
                    :
                    <View>
                        <Text style={{ color: begin ? '#1B7BB3' : '#FFFC00', fontSize: 11 }}>{three}</Text>
                        <View style={{
                            marginTop: 5,
                            width: 100,
                            height: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: begin ? '#2B99D9' : '#FFFC00'
                        }}>
                            <Text style={{ color: begin ? '#F7F7F7' : '#D51243', fontSize: 11 }}>{four}</Text>
                        </View>
                    </View>
                }
            </View>
        </View>;
    };

    render() {
        const { productImgList = [{}], freight = '', monthSaleTotal = 0, product = {} } = this.props.data || {};
        const { supplierName = '', brandName = '', name = '', firstCategoryName = '', secCategoryName = '', thirdCategoryName = '' } = product;
        const { activityType } = this.props;
        return (
            <View>
                <ViewPager style={styles.ViewPager}
                           arrayData={productImgList}
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
                {this._renderActivityView()}
                <View style={{ backgroundColor: 'white' }}>
                    <View style={{ marginLeft: 16, width: ScreenUtils.width - 32 }}>
                        <Text style={{
                            marginTop: 14,
                            color: '#222222',
                            fontSize: 15
                        }}>{`${supplierName} ${brandName} ${name} ${firstCategoryName} ${secCategoryName} ${thirdCategoryName}`}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 18, marginBottom: 14, alignItems: 'center' }}>
                            <Text style={{
                                color: '#BBBBBB',
                                fontSize: 11
                            }}>快递：{freight === 0 ? `包邮` : `${freight}元`}</Text>
                            <Text style={{
                                color: '#666666',
                                fontSize: 13,
                                marginLeft: ScreenUtils.autoSizeWidth(108)
                            }}>{`月销售${monthSaleTotal}笔`}</Text>
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
