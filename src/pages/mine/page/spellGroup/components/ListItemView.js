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
    TouchableWithoutFeedback
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { observer } from 'mobx-react';
import TimeModel from '../../../model/TimeModel';
import DateUtils from '../../../../../utils/DateUtils';


const ENUMSTATUS = {
    // 开团
    GROUPSTATUS_STARE_OPEN: 1,
    // 拼团中
    GROUPSTATUS_OPENING: 2,
    // 已成团--拼团成功
    GROUPSTATUS_SUCCESS: 3,
    // 拼团失败
    GROUPSTATUS_FAIL: -1
}


@observer
export default class ListItemView extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        if (this.props.index === 0) {
            TimeModel.getSpellGroupTime();
        }
    }

    render() {
        const {item, onClick} = this.props;
        let backtime = DateUtils.getDateDiffFun(item.endTime, TimeModel.spellGroupDate);

        let color = item.groupStatus === ENUMSTATUS.GROUPSTATUS_SUCCESS ? '#333333' :
            item.groupStatus === ENUMSTATUS.GROUPSTATUS_FAIL ? '#999999' : '#333333';

        let stateTxt = item.groupStatus === ENUMSTATUS.GROUPSTATUS_SUCCESS ? '已成团' :
            item.groupStatus === ENUMSTATUS.GROUPSTATUS_FAIL ? '已失效' : '';

        let spellColor = item.groupStatus === ENUMSTATUS.GROUPSTATUS_SUCCESS ? '#FF0050' :
            item.groupStatus === ENUMSTATUS.GROUPSTATUS_FAIL ? '#999999' : '#333333';

        let spellState = item.groupStatus === ENUMSTATUS.GROUPSTATUS_SUCCESS ? '拼团成功' :
            item.groupStatus === ENUMSTATUS.GROUPSTATUS_FAIL ? '拼团失败' : '';

        return(
            <View style={styles.item}>
                {item.groupStatus != ENUMSTATUS.GROUPSTATUS_SUCCESS && item.groupStatus != ENUMSTATUS.GROUPSTATUS_FAIL ?
                    <View style={[{backgroundColor: '#FFEBEB'}, styles.headerStyle]}>
                        <Text style={{flex: 1, color: '#333333', fontSize: 12, textAlign: 'left'}}>
                            {this.timeFormat(backtime)}后失效
                        </Text>
                        <Text style={{color: '#FF0050', fontSize: 12, textAlign: 'right', fontWeight: 'bold'}}>
                            待分享，还差{item.surplusPerson ? item.surplusPerson : 'x'}人
                        </Text>
                    </View> :
                    <View style={[{
                        backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E4E4E4'
                    }, styles.headerStyle]}>
                        <Text style={{flex: 1, color: color, fontSize: 12, textAlign: 'left'}}>{stateTxt}</Text>
                        <Text style={{flex: 1, color: spellColor, fontSize: 12, textAlign: 'right'}}>{spellState}</Text>
                    </View>}

                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    {item.image ?
                        <Image source={{uri: item.image}} style={{
                            width: 100,
                            height: 100,
                            borderRadius: 5,
                            margin: 10
                        }}/>
                        :
                        <View style={{  width: 100,
                            height: 100,
                            borderRadius: 5,
                            backgroundColor: '#f5f5f5',
                            margin: 10}}/>
                    }

                    <View style={{flex: 1, justifyContent: 'space-around', marginVertical: 7}}>
                        <View>
                            <Text numberOfLines={1} style={{color: '#333333', fontSize: 14, marginRight: 10}}>
                                {item.goodsName}
                            </Text>

                            <View style={{flexDirection: 'row', alignItems: 'center',marginTop: 6}}>
                                {
                                    item.startGroupLeader ?
                                        <LinearGradient style={{marginRight: 5, borderRadius: 2}}
                                                        start={{x: 0, y: 0.5}}
                                                        end={{x: 1, y: 0.5}}
                                                        colors={['#FC5D39', '#FF0050']}
                                        >
                                            <Text
                                                style={{marginHorizontal: 4, color: 'white', fontSize: 10,}}>团长</Text>
                                        </LinearGradient> : null
                                }

                                {item.groupCount ?
                                    <View style={{
                                        flexDirection: 'row',
                                        backgroundColor: 'rgba(255,0,80,0.1)',
                                        borderRadius: 2
                                    }}>
                                        <Text style={{color: '#FF0050', fontSize: 10, marginHorizontal: 4,}}>{item.groupCount}人团</Text>
                                    </View>
                                    : null
                                }
                            </View>

                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{color: '#FF0050', fontSize: 17, flex: 1}}>
                                <Text style={{fontSize: 12}}>¥</Text>
                                {item.activityAmount ? item.activityAmount : 0.0}
                            </Text>

                            <TouchableWithoutFeedback
                                onPress={() => {
                                    let type = item.groupStatus != ENUMSTATUS.GROUPSTATUS_SUCCESS && item.groupStatus != ENUMSTATUS.GROUPSTATUS_FAIL
                                    onClick && onClick(type, item);
                                }
                                }

                            >
                                <View style={{marginHorizontal: 10}}>
                                    {item.groupStatus != ENUMSTATUS.GROUPSTATUS_SUCCESS && item.groupStatus != ENUMSTATUS.GROUPSTATUS_FAIL ?
                                        <LinearGradient style={{borderRadius: 14,}}
                                                        start={{x: 0, y: 0}}
                                                        end={{x: 1, y: 1}}
                                                        colors={['#FC5D39', '#FF0050']}
                                        >
                                            <View style={{borderRadius: 14,}}>
                                                <Text style={[styles.btnTxtStyle, {color: 'white'}]}>邀请好友</Text>
                                            </View>
                                        </LinearGradient>
                                        :
                                        <View style={styles.btnViewStyle}>
                                            <Text style={[styles.btnTxtStyle, {color: '#999999'}]}>拼团详情</Text>
                                        </View>
                                    }
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>

                </View>
            </View>
        )
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
            return '00小时00分钟00秒';
        }
        let format = '';
        if (time.days > 0) {
            format = format + `${time.days < 10 ? '0' + time.days : time.days}` + '天';
        }
        format = format + `${time.hours < 10 ? '0' + time.hours : time.hours}` + '小时'
            + `${time.min < 10 ? '0' + time.min : time.min}` + '分钟'
            + `${time.sec < 10 ? '0' + time.sec : time.sec}` + '秒';

        return format;
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        marginTop: 10,
        marginHorizontal: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden'
    },
    headerStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        paddingHorizontal: 15
    },
    btnViewStyle: {
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#CCCCCC'
    },
    btnTxtStyle: {
        fontSize: 12,
        marginHorizontal: 10,
        marginVertical: 5
    }
});
