/**
 * Created by xiangchen on 2018/8/6.
 */
import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import DesignRule from '../../constants/DesignRule';

const styles = StyleSheet.create({
    cardItemTimeRemainTxt: {
        fontSize: 20,
        color: DesignRule.mainColor
    },
    text: {
        fontSize: 30,
        color: 'white',
        marginLeft: 2
    },
    container: {
        flexDirection: 'row'
    },
    //时间文字
    defaultTime: {
        paddingHorizontal: 1,
        backgroundColor: DesignRule.textColor_secondTitle,
        fontSize: 12,
        color: 'white',
        marginHorizontal: 3,
        borderRadius: 2
    },
    //冒号
    defaultColon: {
        fontSize: 12, color: DesignRule.textColor_secondTitle
    }
});
export default class CountDownReact extends Component {
    static defaultProps = {
        date: new Date(),
        days: {
            plural: '天',
            singular: '天'
        },
        hours: ':',
        mins: ':',
        segs: ':',
        onEnd: () => {
        },

        containerStyle: styles.container,//container 的style
        daysStyle: styles.defaultTime,//天数 字体的style
        hoursStyle: styles.defaultTime,//小时 字体的style
        minsStyle: styles.defaultTime,//分钟 字体的style
        secsStyle: styles.defaultTime,//秒数 字体的style
        firstColonStyle: styles.defaultColon,//从左向右 第一个冒号 字体的style
        secondColonStyle: styles.defaultColon//从左向右 第2个冒号 字体的style

    };

    constructor(props) {
        super(props);
        const date = this.getDateData(parseInt((props.date1 - props.date2) / 1000));
        this.state = {
            date: date ? date : {
                years: 0,
                days: 0,
                hours: 0,
                min: 0,
                sec: 0,
                millisec: 0
            }
        };


    }

    componentWillReceiveProps(nextProps) {
        if (this.props.dismiss) {
            this.stop();
        }
        const { date1, date2 } = nextProps;
        if (date1 !== this.props.date1 || date2 !== this.props.date2) {
            let diff = parseInt((date1 - date2) / 1000);
            if (diff <= 0) {
                return;
            }
            this.interval = setInterval(() => {

                diff--;
                const date = this.getDateData(diff);
                if (date) {
                    this.setState({ date: date });
                } else {
                    this.stop();
                    this.props.onEnd();
                }
            }, 1000);

        }

    }

    componentDidMount() {
        //console.log(this.props.date);//"2017-03-29T00:00:00+00:00"
        const { date1, date2 } = this.props;
        let diff = parseInt((date1 - date2) / 1000);
        if (date1 > 0 && date2 > 0) {
            this.interval = setInterval(() => {
                diff--;
                const date = this.getDateData(diff);
                if (date) {
                    this.setState({ date: date });
                } else {
                    this.stop();
                    this.props.onEnd();
                }
            }, 1000);
        }
    }


    componentWillUnmount() {
        this.stop();
    }

    getDateData(diff) {

        if (diff <= 0) {
            this.props.callback();
            this.stop(); // 倒计时为0的时候, 将计时器清除
            return 0;
        }

        const timeLeft = {
            years: 0,
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
            millisec: 0
        };

        if (diff >= (365.25 * 86400)) {
            timeLeft.years = Math.floor(diff / (365.25 * 86400));
            diff -= timeLeft.years * 365.25 * 86400;
        }
        if (diff >= 86400) {
            timeLeft.days = Math.floor(diff / 86400);
            diff -= timeLeft.days * 86400;
        }
        if (diff >= 3600) {
            timeLeft.hours = Math.floor(diff / 3600);
            diff -= timeLeft.hours * 3600;
        }
        if (diff >= 60) {
            timeLeft.min = Math.floor(diff / 60);
            diff -= timeLeft.min * 60;
        }
        timeLeft.sec = diff;
        return timeLeft;
    }

    render() {
        const countDown = this.state.date;
        let days;
        if (countDown.days === 1) {
            days = this.props.days.singular;
        } else {
            days = this.props.days.plural;
        }
        if (this.props.dismiss) {
            return null;
        } else {
            return (
                <View style={this.props.containerStyle}>
                    {(countDown.days > 0) ?
                        <Text style={this.props.daysStyle}>{this.leadingZeros(countDown.days) + days}</Text> : null}
                    <Text style={this.props.hoursStyle}>{this.leadingZeros(countDown.hours)}</Text>
                    <Text style={this.props.firstColonStyle}>:</Text>
                    <Text style={this.props.minsStyle}>{this.leadingZeros(countDown.min)}</Text>
                    <Text style={this.props.secondColonStyle}>:</Text>
                    <Text style={this.props.secsStyle}>{this.leadingZeros(countDown.sec)}</Text>
                    <Text style={this.props.secondColonStyle}>'</Text>
                </View>


            );
        }

    }

    stop() {
        this.interval && clearInterval(this.interval);
    }

    leadingZeros(num, length = null) {

        let length_ = length;
        let num_ = num;
        if (length_ === null) {
            length_ = 2;
        }
        num_ = String(num_);
        while (num_.length < length_) {
            num_ = '0' + num_;
        }
        return num_;
    }
}
