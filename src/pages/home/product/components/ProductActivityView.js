import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import { isNoEmpty } from '../../../../utils/StringUtils';
import { formatDate } from '../../../../utils/DateUtils';
import { TimeDownUtils } from '../../../../utils/TimeDownUtils';
import whiteArrowRight from '../res/icon3_03.png';

export default class ActivityView extends Component {

    static propTypes = {
        activityData: PropTypes.object.isRequired,
        activityType: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.timer = new TimeDownUtils();
        this.state = {
            countTime: 0
        };
    }

    componentWillUnmount() {
        this.timer.stop();
    }


    _time(start, end) {
        if (isNoEmpty(start) && isNoEmpty(end)) {
            this.timer.startDown((time) => {
                this.setState({
                    countTime: time
                });
            }, Math.floor((end - start) / 1000));
        }
    };

    saveActivityViewData(activityData, activityType) {
        const { date, beginTime, endTime } = activityData;
        let begin = beginTime > date;
        if (begin) {
            this._time(date, beginTime);
        } else {
            if (activityType === 2) {
                const { markdownPrice = '', floorPrice, activityTime } = activityData;
                markdownPrice === floorPrice ? this._time(date, endTime) : this._time(date, activityTime);
            } else {
                this._time(date, endTime);
            }
        }
    }

    _timeDif(usedTime) {
        //两个时间戳相差的毫秒数

        let days = Math.floor(usedTime / (24 * 3600 * 1000));
        //计算出小时数
        let leave1 = usedTime % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600 * 1000));
        //计算相差分钟数
        let leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
        let minutes = Math.floor(leave2 / (60 * 1000));

        let leave3 = leave2 % (60 * 1000);        //计算小时数后剩余的毫秒数
        let second = Math.floor(leave3 / (1000));
        let time = days + ':' + hours + ':' + minutes + ':' + second;
        return time;
    }

    render() {
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
        const { surplusNumber = '', date, beginTime, endTime } = this.props.activityData;
        let price = '', one = '', two = '', three = '', four = '';
        let begin = beginTime > date;
        let end = date > endTime;
        if (activityType === 2) {
            const {
                startPrice, markdownPrice = '', reseCount = '', floorPrice
            } = this.props.activityData;
            if (begin) {
                price = startPrice;
                one = '起拍价';
                two = `${reseCount}人关注`;
                three = `距开抢 ${this._timeDif(this.state.countTime)}`;
                four = `${formatDate(beginTime, 'MM月dd日hh:mm')}开拍`;
            } else {
                price = markdownPrice;
                one = '起拍价';
                two = `${reseCount}人关注`;
                three = markdownPrice === floorPrice ? `距结束 ${this._timeDif(this.state.countTime) || ''}` : `距下次降价 ${this._timeDif(this.state.countTime) || ''}`;
                four = `${surplusNumber === 0 ? `已抢完` : `还剩${surplusNumber}件`}`;
            }
        } else {
            const { seckillPrice = '', subscribeCount = '' } = this.props.activityData;
            price = seckillPrice;
            if (begin) {
                one = '秒杀价';
                two = `${isNoEmpty(subscribeCount) ? subscribeCount : ''}人关注`;
                three = `距开抢 ${this._timeDif(this.state.countTime) || ''}`;
                four = `${formatDate(beginTime, 'MM月dd日hh:mm')}开拍`;
            } else {
                one = '秒杀价';
                two = `${isNoEmpty(subscribeCount) ? subscribeCount : ''}人关注`;
                three = `距结束 ${this._timeDif(this.state.countTime) || ''}`;
                four = `${surplusNumber === 0 ? `已抢完` : `还剩${surplusNumber}件`}`;
            }
        }

        return <TouchableOpacity style={{
            backgroundColor: '#33B4FF',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }} onPress = {()=>this.props.productActivityViewAction()}>
            <View style={{ marginLeft: 11, flexDirection: 'row', paddingVertical: 10 }}>
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
                    <View style = {{flexDirection:'row',alignItems:'center'}}>
                        <View>
                            <Text style={{ color: '#1B7BB3', fontSize: 11 }}>{three}</Text>
                            <View style={{
                                marginTop: 5,
                                width: 100,
                                paddingVertical: 2,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#2B99D9'
                            }}>
                                <Text style={{ color: '#F7F7F7', fontSize: 11 }}>{four}</Text>
                            </View>
                        </View>

                        <Image source={whiteArrowRight}
                               style={{ height: 14, marginLeft: 2 }}
                               resizeMode={'contain'}/>
                    </View>
                }
            </View>
        </TouchableOpacity>;
    }
}
