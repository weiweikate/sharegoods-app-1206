import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import { isNoEmpty } from '../../../utils/StringUtils';
import { formatDate, isToday, isTomorrow } from '../../../utils/DateUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res/product';
import { MRText as Text } from '../../../components/ui/index';

const { white_go } = res.button;


export default class ActivityView extends Component {

    static propTypes = {
        activityData: PropTypes.object.isRequired,
        activityType: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        this.errorDateCount = 0;
        this.state = {
            countTime: 0
        };
    }

    componentWillUnmount() {
        this._stopTime();
    }

    _stopTime = () => {
        this.interval && clearInterval(this.interval);
    };

    saveActivityViewData(activityData, activityType, callBack) {
        this.callBack = callBack;
        //	integer($int32)
        // example: 1
        const { date, beginTime, endTime, status } = activityData;
        // 状态：0.删除 1.未开始 2.进行中 3.已售完 4.时间结束 5.手动结束
        if (status === 1 && beginTime >= date) {//以防止错误数据无限循环
            this._time(date, beginTime);
        } else if ((status === 2 || status === 3) && endTime >= date) {//以防止错误数据无限循环
            if (activityType === 2) {
                const { markdownPrice = '', floorPrice, activityTime } = activityData;
                (markdownPrice === floorPrice || status === 3) ? this._time(date, endTime) : this._time(date, activityTime);
            } else {
                this._time(date, endTime);
            }
        }

        //1.未开始实际已经开始 2.进行中实际已经结束   脏数据需要再次请求数据  最多请求3次  1.2s
        if (status === 1 && beginTime < date || (status === 2 || status === 3) && endTime < date) {
            if (this.errorDateCount < 3) {
                setTimeout(() => {
                    this.callBack && this.callBack();
                }, 400);
            }
            this.errorDateCount++;
        } else {
            this.errorDateCount = 0;
        }
    }


    _time(start, end) {
        this._stopTime();
        if (isNoEmpty(start) && isNoEmpty(end)) {
            let countdownDate = new Date().getTime() + (end - start);
            this.interval = setInterval(() => {
                let diff = countdownDate - new Date().getTime();
                if (diff <= 0) {
                    diff = 0;
                    this._stopTime();
                    this.callBack && this.callBack();
                }
                this.setState({
                    countTime: diff
                });
            }, 200);
        }
    }

    _timeDif(usedTime) {
        //天数
        let days = Math.floor(usedTime / (24 * 3600 * 1000));
        //去除天数
        let leave1 = usedTime % (24 * 3600 * 1000);
        //小时
        let hours = Math.floor(leave1 / (3600 * 1000));
        //去除小时
        let leave2 = leave1 % (3600 * 1000);
        //分钟
        let minutes = Math.floor(leave2 / (60 * 1000));
        //去除分钟
        let leave3 = leave2 % (60 * 1000);
        //秒
        let second = Math.floor(leave3 / 1000);
        //mill
        let leave4 = Math.floor(leave3 % 1000 / 10);

        hours = days * 24 + hours;
        hours = hours >= 10 ? hours : hours === 0 ? `00` : `0${hours}`;
        minutes = minutes >= 10 ? minutes : minutes === 0 ? `00` : `0${minutes}`;
        second = second >= 10 ? second : second === 0 ? `00` : `0${second}`;
        leave4 = leave4 >= 10 ? leave4 : leave4 === 0 ? `00` : `0${leave4}`;

        let time = `${hours}:${minutes}:${second}:${leave4}`;
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
        const { surplusNumber = '', beginTime, status } = this.props.activityData;
        let price = '', one = '', two = '', three = '', four = '';
        let begin = status === 1;
        let end = status === 4 || status === 5;
        if (activityType === 2) {
            const {
                startPrice, markdownPrice = '', reseCount = '', floorPrice
            } = this.props.activityData;
            if (begin) {
                price = startPrice;
                one = '起拍价';
                two = `${reseCount}人关注`;
                three = `距开拍 ${this._timeDif(this.state.countTime)}`;
                if (isTomorrow(beginTime)) {
                    four = `明天 ${formatDate(beginTime, 'HH:mm')}开拍`;
                } else if (isToday(beginTime)) {
                    four = `今天 ${formatDate(beginTime, 'HH:mm')}开拍`;
                } else {
                    four = `${formatDate(beginTime, 'MM月dd日 HH:mm')}开拍`;
                }
            } else {
                price = markdownPrice;
                one = '当前价';
                two = `${reseCount}人关注`;
                three = (markdownPrice === floorPrice || status === 3) ? `距结束 ${this._timeDif(this.state.countTime) || ''}` : `距下次降价 ${this._timeDif(this.state.countTime) || ''}`;
                four = `${surplusNumber === 0 ? `已拍完` : `仅剩${surplusNumber}件`}`;
            }
        } else {
            const { seckillPrice = '', subscribeCount = '' } = this.props.activityData;
            price = seckillPrice;
            if (begin) {
                one = '秒杀价';
                two = `${isNoEmpty(subscribeCount) ? subscribeCount : ''}人关注`;
                three = `距开抢 ${this._timeDif(this.state.countTime) || ''}`;
                if (isTomorrow(beginTime)) {
                    four = `明天 ${formatDate(beginTime, 'HH:mm')}开抢`;
                } else if (isToday(beginTime)) {
                    four = `今天 ${formatDate(beginTime, 'HH:mm')}开抢`;
                } else {
                    four = `${formatDate(beginTime, 'MM月dd日HH:mm')}开抢`;
                }
            } else {
                one = '秒杀价';
                two = `${isNoEmpty(subscribeCount) ? subscribeCount : ''}人关注`;
                three = `距结束 ${this._timeDif(this.state.countTime) || ''}`;
                four = `${surplusNumber === 0 ? `已抢完` : `仅剩${surplusNumber}件`}`;
            }
        }

        return <TouchableOpacity style={{
            backgroundColor: '#33B4FF',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }} onPress={() => this.props.productActivityViewAction()}>
            <View style={{ marginLeft: 11, flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>￥</Text>
                    <Text style={{ color: 'white', fontSize: 40 }}>{price}</Text>
                </View>
                <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                    <Text style={{ color: DesignRule.bgColor, fontSize: 12 }} allowFontScaling={false}>{one}</Text>
                    <Text style={{
                        color: DesignRule.bgColor,
                        fontSize: 10,
                        marginTop: 4
                    }} allowFontScaling={false}>{two}</Text>
                </View>
            </View>
            {end ?
                <Text style={{ color: '#FFFC00', fontSize: 13, marginRight: 15 }} allowFontScaling={false}>活动已结束</Text>
                :
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ alignItems: 'flex-end' }}>
                        <View style={{ width: 106 + 30, alignItems: 'center' }}>
                            <Text style={{ color: '#1B7BB3', fontSize: 11 }} numberOfLines={1}
                                  allowFontScaling={false}>{three}</Text>
                        </View>
                        <View style={{
                            marginTop: 5,
                            marginRight: 15,
                            height: 15,
                            width: 106,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#2B99D9',
                            borderRadius: 2.5
                        }}>
                            <Text style={{ color: DesignRule.bgColor, fontSize: 11 }}
                                  allowFontScaling={false}>{four}</Text>
                        </View>
                    </View>

                    <Image source={white_go}
                           style={{ height: 14, marginLeft: 2, marginRight: 15 }}
                           resizeMode={'contain'}/>
                </View>
            }
        </TouchableOpacity>;
    }
}
