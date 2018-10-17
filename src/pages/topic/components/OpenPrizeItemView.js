import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import ColorUtil from '../../../utils/ColorUtil';
import ScreenUtils from '../../../utils/ScreenUtils';
import ProgressBarView from './ProgressBarView';
import PreLoadImage from '../../../components/ui/preLoadImage/PreLoadImage';
import PropTypes from 'prop-types';
import TopicAPI from '../api/TopicApi';
import user from '../../../model/user';
import bridge from '../../../utils/bridge';
import ShopCartRes from '../../shopCart/res/ShopCartRes';

// 状态：0.删除 1.未开始 2.进行中 3.已售完 4.时间结束 5.手动结束
const statues = {
    deleteStatue: 0,
    noBegin: 1,
    isBeginning: 2,
    haveSoldOut: 3,
    timeOver: 4,
    handOver: 5
};
// 1.秒杀 2.降价拍 3.礼包 4.助力免费领 5.专题 99.普通产品
const productTypes = {
    skill: 1,
    down: 2,
    giftPackage: 3,
    helpFree: 4,
    newTopic: 5,
    normalProduct: 99
};
const downPriceParam = {
    [statues.noBegin]: 'startPrice',
    [statues.isBeginning]: 'markdownPrice'
};
const typeName = {
    [productTypes.skill]: 'seckillPrice',
    //降价拍需要判断statue 如果为1 则为startPrice 如果为2 则为 markdownPrice
    [productTypes.down]: downPriceParam,
    [productTypes.giftPackage]: '暂无',
    [productTypes.helpFree]: '暂无',
    [productTypes.newTopic]: '暂无'
};


export default class OpenPrizeItemView extends Component {

    constructor(props) {
        super(props);
        const itemData = this.props.itemData;
        this.state = {
            itemData: itemData
        };
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
                                    source={ShopCartRes.noGoodImg}
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
                            onLayout={(e) => {
                                if (e.nativeEvent.layout.height > 25) {//多于一行时改为红色
                                }
                            }
                            }
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
                                    color: ColorUtil.Color_d51243
                                }}>
                                    {
                                        itemData.productType === 2
                                            ?
                                            '¥'+itemData[typeName[itemData.productType][itemData.status]]
                                            :
                                            '¥'+itemData[typeName[itemData.productType]]
                                    }
                                </Text>
                                <Text style={{
                                    height: 11,
                                    fontSize: 11,
                                    textDecorationLine: 'line-through',
                                    color: ColorUtil.Color_999999
                                }}>
                                    {itemData.originalPrice + '起'}
                                </Text>
                            </View>
                            {/*右下角按钮*/}
                            {
                                itemData.status === 1 ?
                                    <View
                                        style={{
                                            backgroundColor: ColorUtil.Color_f7f7f7,
                                            height: 30,
                                            width: (ScreenUtils.width / 2 - 16) / 2,
                                            borderRadius: 5,
                                            borderRadius: 5
                                        }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this._followAction();
                                            }

                                            }
                                        >
                                            <Text
                                                style={
                                                    {
                                                        color: ColorUtil.Color_999999,
                                                        textAlign: 'center',
                                                        height: 30,
                                                        paddingTop: 8,
                                                        fontSize: 12
                                                    }
                                                }
                                            >
                                                {this.state.itemData.notifyFlag ? '取消关注' : '关注'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View
                                        style={[{
                                            backgroundColor: ColorUtil.Color_d51243,
                                            height: 30,
                                            width: (ScreenUtils.width / 2 - 16) / 2,
                                            borderRadius: 5,
                                            borderRadius: 5
                                        },
                                            (itemData.status === 3 || itemData.status === 4 || itemData.status === 5)
                                                ? { backgroundColor: ColorUtil.Color_f7f7f7 }
                                                : { backgroundColor: ColorUtil.Color_d51243 }

                                        ]}>
                                        <Text
                                            style={
                                                [{
                                                    color: ColorUtil.Color_ffffff,
                                                    textAlign: 'center',
                                                    height: 30,
                                                    paddingTop: 8,
                                                    fontSize: 12
                                                },
                                                    (itemData.status === 3 || itemData.status === 4 || itemData.status === 5)
                                                        ? { color: ColorUtil.Color_999999 }
                                                        : { color: ColorUtil.Color_ffffff }
                                                ]
                                            }
                                        >
                                            {
                                                (itemData.status === 3 || itemData.status === 4 || itemData.status === 5) ?
                                                    '已抢光' :
                                                    '马上抢'
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
        backgroundColor: ColorUtil.Color_f7f7f7,
        padding: 8,
        paddingBottom: 0
    },
    itemContentStyle: {
        flex: 1,
        backgroundColor: 'white'
    },
    itemTopImageStyle: {
        // backgroundColor: 'red'
        width: ScreenUtils.width / 2 - 16,
        height: ScreenUtils.width / 2 - 16
    },
    itemBottomTextStyle: {
        padding: 10,
        color: ColorUtil.Color_222222,
        width: ScreenUtils.width / 2 - 16,

        height: 35,
        fontSize: 12
    },
    itemFolloweTextStyle: {
        color: ColorUtil.Color_33b4ff,
        fontSize: 11,
        marginTop: 5,
        marginLeft: 0,
        marginRight: 10
    }
});
