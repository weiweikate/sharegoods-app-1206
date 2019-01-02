import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import ProgressBarView from './ProgressBarView';
// import ImageLoad from '@mr/image-placeholder'
import PropTypes from 'prop-types';
import TopicAPI from '../api/TopicApi';
import user from '../../../model/user';
import bridge from '../../../utils/bridge';
import { getShowPrice } from '../model/TopicMudelTool';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import PreLoadImage from '../../../components/ui/preLoadImage/PreLoadImage';
import UIText from '../../../components/ui/UIText';
import {
    MRText as Text
} from '../../../components/ui';

const noGoodImg = res.other.noGoodImg;
const zhuanti_jieshu = res.zhuanti_jieshu;

// 状态：0.删除 1.未开始 2.进行中 3.已售完 4.时间结束 5.手动结束
const statues = {
    deleteStatue: 0,
    noBegin: 1,
    isBeginning: 2,
    haveSoldOut: 3,
    timeOver: 4,
    handOver: 5
};

const statuesImg = {
    [statues.haveSoldOut]: noGoodImg,
    [statues.timeOver]: zhuanti_jieshu,
    [statues.handOver]: zhuanti_jieshu
};
const statuesString = {
    [statues.isBeginning]: '马上抢',
    [statues.haveSoldOut]: '已抢光',
    [statues.timeOver]: '已结束',
    [statues.handOver]: '已结束'
};


export default class OpenPrizeItemView extends Component {

    constructor(props) {
        super(props);
        const { itemData } = props;
        this.state = {
            itemData: itemData
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.itemData) {
            this.state.itemData = nextProps.itemData;
        }
    }


    static propTypes = {
        itemData: PropTypes.object.isRequired,
        itemClick: PropTypes.func.isRequired
    };

    render() {
        const itemData = this.state.itemData;
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={
                    () => {
                        this.props.itemClick && this.props.itemClick(itemData);
                    }
                }
            >
                <View style={ItemStyles.itemBgStyle}>
                    <View style={ItemStyles.itemContentStyle}>
                        <PreLoadImage
                            imageUri={itemData.specImg}
                            style={ItemStyles.itemTopImageStyle}
                        />
                        {
                            (itemData.status === 3 || itemData.status === 4 || itemData.status === 5) ?
                                <Image
                                    source={statuesImg[itemData.status]}
                                    style={
                                        {
                                            position: 'absolute',
                                            top: 25,
                                            left: 25,
                                            width: ScreenUtils.width / 2 - 16 - 50,
                                            height: ScreenUtils.width / 2 - 16 - 50
                                        }
                                    }
                                />
                                :
                                null
                        }
                        <UIText
                            style={ItemStyles.itemBottomTextStyle}
                            number={2}
                            value= {itemData.productName}
                            />
                        {/*<Text*/}
                            {/*style={ItemStyles.itemBottomTextStyle}*/}
                            {/*number={2}*/}
                        {/*>*/}
                            {/*{itemData.productName}*/}
                        {/*</Text>*/}
                        {/*中部视图 关注或者进度条*/}
                        <View
                            style={{
                                marginTop: 5,
                                marginLeft: 10
                            }}
                        >
                            <ProgressBarView
                                progressValue={(itemData.totalNumber - itemData.surplusNumber) / itemData.totalNumber}
                                haveRobNum={itemData.totalNumber - itemData.surplusNumber}
                                statue={itemData.status}
                                itemData={itemData}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: ScreenUtils.width / 2 - 16,
                                justifyContent: 'space-around',
                                marginTop: 10
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'column'
                                }}
                            >
                                <Text style={{
                                    height: 18,
                                    fontSize: 16,
                                    color: DesignRule.mainColor
                                }}>
                                    {
                                        getShowPrice(itemData)
                                    }
                                </Text>
                                <Text style={{
                                    height: 11,
                                    fontSize: 11,
                                    textDecorationLine: 'line-through',
                                    color: DesignRule.textColor_instruction
                                }}>
                                    {'¥' + itemData.originalPrice}
                                </Text>
                            </View>
                            {/*右下角按钮*/}
                            {
                                itemData.status === 1 ?
                                    <View
                                        style={{
                                            backgroundColor: DesignRule.bgColor,
                                            height: 30,
                                            width: (ScreenUtils.width / 2 - 16) / 2,
                                            borderRadius: 5
                                        }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this._followAction();
                                            }
                                            }
                                        >
                                            <View
                                                style={{
                                                    backgroundColor: '#33B4FF',
                                                    height: 30,
                                                    width: (ScreenUtils.width / 2 - 16) / 2,
                                                    borderRadius: 5,
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {
                                                    this.state.itemData.notifyFlag ?
                                                        null
                                                        :
                                                        <Image
                                                            source={res.zhuanti_tixing_img}
                                                        />
                                                }

                                                <Text
                                                    style={
                                                        {
                                                            color: 'white',
                                                            fontSize: 12,
                                                            marginLeft: 5
                                                        }
                                                    }
                                                >
                                                    {this.state.itemData.notifyFlag ? '取消提醒' : '提醒我'}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View
                                        style={[{
                                            backgroundColor: DesignRule.mainColor,
                                            height: 30,
                                            width: (ScreenUtils.width / 2 - 16) / 2,
                                            borderRadius: 5
                                        },
                                            (itemData.status === 3 || itemData.status === 4 || itemData.status === 5)
                                                ? { backgroundColor: DesignRule.bgColor }
                                                : { backgroundColor: DesignRule.mainColor }

                                        ]}>
                                        <Text
                                            style={
                                                [{
                                                    color: 'white',
                                                    textAlign: 'center',
                                                    height: 30,
                                                    paddingTop: 8,
                                                    fontSize: 12
                                                },
                                                    (itemData.status === 3 || itemData.status === 4 || itemData.status === 5)
                                                        ? { color: DesignRule.textColor_instruction }
                                                        : { color: 'white' }
                                                ]
                                            }
                                        >
                                            {
                                                statuesString[itemData.status]
                                            }
                                        </Text>

                                    </View>
                            }

                            {/*</View>*/}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    /**
     *
     */
    _followAction = () => {
        const itemData = this.state.itemData;
        let type = this.state.itemData.notifyFlag ? 0 : 1;
        let param = {
            'activityId': this.state.itemData.id,
            'activityType': this.state.itemData.productType,
            'type': type,
            'userCode': user.code
        };
        TopicAPI.followAction(
            param
        ).then(result => {
            itemData.notifyFlag = type;
            if (type === 1) {
                itemData.reseCount++;
            } else {
                itemData.reseCount--;
            }
            this.setState({
                itemData: itemData

            });
        }).catch(error => {
            bridge.$toast(error.msg);
        });
    };
}
const mainWidth = ScreenUtils.width - 20;
const ItemStyles = StyleSheet.create({
    itemBgStyle: {
        width: mainWidth / 2,
        height: mainWidth / 2 + 105,
        backgroundColor: DesignRule.bgColor,
        padding: 5,
        paddingBottom: 0
    },
    itemContentStyle: {
        flex: 1,
        backgroundColor: 'white'
    },
    itemTopImageStyle: {
        // backgroundColor: DesignRule.mainColor
        width: mainWidth / 2 - 16,
        height: mainWidth / 2 - 16
    },

    itemBottomTextStyle: {
        padding: 10,
        color: DesignRule.textColor_mainTitle,
        width: mainWidth / 2 - 16,
        height: 37,
        fontSize: 12
    },
    itemFolloweTextStyle: {
        color: DesignRule.bgColor_blue,
        fontSize: 11,
        marginTop: 5,
        marginLeft: 0,
        marginRight: 10
    }
});
