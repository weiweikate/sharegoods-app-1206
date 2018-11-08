import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import ProgressBarView from './ProgressBarView';
import PreLoadImage from '../../../components/ui/preLoadImage/PreLoadImage';
import PropTypes from 'prop-types';
import TopicAPI from '../api/TopicApi';
import user from '../../../model/user';
import bridge from '../../../utils/bridge';
import ShopCartRes from '../../shopCart/res/ShopCartRes';
import SbResTool from '../res/SbResTool';
import { getShowPrice } from '../model/TopicMudelTool';
import DesignRule from 'DesignRule';

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
    [statues.haveSoldOut]: ShopCartRes.noGoodImg,
    [statues.timeOver]: SbResTool.zhuanti_jieshu,
    [statues.handOver]: SbResTool.zhuanti_jieshu
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
                                            top: 10,
                                            left: 5,
                                            width: ScreenUtils.width / 2 - 16 - 10,
                                            height: ScreenUtils.width / 2 - 16 - 15
                                        }
                                    }
                                />
                                :
                                null
                        }
                        <Text
                            style={ItemStyles.itemBottomTextStyle}
                            number={2}
                            // onLayout={(e) => {
                            //     if (e.nativeEvent.layout.height > 25) {//多于一行时改为红色
                            //     }
                            // }
                            // }
                        >
                            {itemData.productName}
                        </Text>
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
                                        // itemData.productType === 2
                                        //     ?
                                        //     '¥' + itemData[typeName[itemData.productType][itemData.status]]
                                        //     :
                                        //     '¥' + itemData[typeName[itemData.productType]]
                                        getShowPrice(itemData)
                                    }
                                </Text>
                                <Text style={{
                                    height: 11,
                                    fontSize: 11,
                                    textDecorationLine: 'line-through',
                                    color: DesignRule.textColor_instruction
                                }}>
                                    {itemData.originalPrice}
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
                                                    borderRadius: 5
                                                }}
                                            >
                                                <Text
                                                    style={
                                                        {
                                                            color: DesignRule.white,
                                                            textAlign: 'center',
                                                            height: 30,
                                                            paddingTop: 8,
                                                            fontSize: 12

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
                                                    color: DesignRule.white,
                                                    textAlign: 'center',
                                                    height: 30,
                                                    paddingTop: 8,
                                                    fontSize: 12
                                                },
                                                    (itemData.status === 3 || itemData.status === 4 || itemData.status === 5)
                                                        ? { color: DesignRule.textColor_instruction }
                                                        : { color: DesignRule.white }
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
            'userId': user.id
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
const ItemStyles = StyleSheet.create({
    itemBgStyle: {
        width: ScreenUtils.width / 2,
        height: ScreenUtils.width / 2 + 100,
        backgroundColor: DesignRule.bgColor,
        padding: 8,
        paddingBottom: 0
    },
    itemContentStyle: {
        flex: 1,
        backgroundColor: DesignRule.white
    },
    itemTopImageStyle: {
        // backgroundColor: 'red'
        width: ScreenUtils.width / 2 - 16,
        height: ScreenUtils.width / 2 - 16
    },

    itemBottomTextStyle: {
        padding: 10,
        color: DesignRule.textColor_mainTitle,
        width: ScreenUtils.width / 2 - 16,
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
