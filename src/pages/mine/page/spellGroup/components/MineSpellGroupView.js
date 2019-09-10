/**
 * @author zhoujianxin
 * @date on 2019/9/3.
 * @desc
 * @org  www.sharegoodsmall.com
 * @email zhoujianxin@meeruu.com
 */

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import TimeModel from '../../../model/TimeModel';
import DesignRule from '../../../../../constants/DesignRule';
import LinearGradient from 'react-native-linear-gradient';
import { observer } from 'mobx-react';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import DateUtils from '../../../../../utils/DateUtils';
import EmptyUtils from '../../../../../utils/EmptyUtils';

const { px2dp } = ScreenUtils;


@observer
export default class MineSpellGroupView extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillReceiveProps() {
        const {data} = this.props;
        if(!EmptyUtils.isEmpty(data)) {
            //判断是否有即将结束的参团，存在则触发定时器
            TimeModel.getCurrentTime();
        }
    }

    render() {
        const {data,itemClick} = this.props;
        if(EmptyUtils.isEmpty(data)){
            return null;
        }

        let backtime = DateUtils.getDateDiffFun(data.endTime, TimeModel.countdownDate);

        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                marginTop: 15,
                borderRadius: px2dp(10),
                marginHorizontal: DesignRule.margin_page
            }}>
                {data.image ?
                    <Image source={{uri: data.image}} style={{
                        width: 50,
                        height: 50,
                        borderRadius: 5,
                        margin: 10
                    }}/>
                    :
                    <View style={{
                        width: 50,
                        height: 50,
                        borderRadius: 5,
                        backgroundColor: '#f5f5f5',
                        margin: 10
                    }}/>
                }

                <View style={{flex: 1,justifyContent:'center'}}>
                    <Text style={{marginLeft: 5, color: '#333333', fontSize: 13}}>拼团仅剩
                        <Text style={{marginRight: 5, fontSize: 16, color: '#FF0050', fontWeight: '600'}}>
                            {' ' + this.timeFormat(backtime)}
                        </Text>
                    </Text>
                </View>

                <TouchableOpacity activeOpacity={0.7}
                                  onPress={() => {
                                      itemClick && itemClick()
                                  }}>
                    <LinearGradient style={{borderRadius: 17, marginRight: 27}}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                    colors={['#FC5D39', '#FF0050']}
                    >
                        <View style={{borderRadius: 14, height: 30, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={styles.btnTxtStyle}>邀请好友</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }

    /**
     * 获取倒计时的日期时间
     * time = {
            years: 0, 剩余 年数
            days: 0,  剩余天数
            hours: 0, 剩余小时
            min: 0,   剩余分钟
            sec: 0,   剩余描述
            millisec: 0, 剩余毫秒
            allSecond:0  总秒数
        }
     */
    timeFormat = (time)=>{
        if (!time) {
            return '00:00:00';
        }
        let format = '';
        if (time.days > 0) {
            format = format + `${time.days < 10 ? '0' + time.days : time.days}` + ':'
        }
        format = format + `${time.hours < 10 ? '0' + time.hours : time.hours}` + ':'
            + `${time.min < 10 ? '0' + time.min : time.min}` + ':'
            + `${time.sec < 10 ? '0' + time.sec : time.sec}`;

        return format;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnTxtStyle: {
        fontSize: 12,
        marginHorizontal: 10,
        marginVertical: 5,
        color: 'white'

    }
});
