import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import ColorUtil from '../../../../utils/ColorUtil';
import ScreenUtils from '../../../../utils/ScreenUtils';
import ProgressBarView from './ProgressBarView';

export default class OpenPrizeItemView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity>
                <View style={ItemStyles.itemBgStyle}>
                    <View style={ItemStyles.itemContentStyle}>
                        {/*头部image*/}
                        <Image
                            style={ItemStyles.itemTopImageStyle}
                        />
                        <Text
                            style={ItemStyles.itemBottomTextStyle}
                            number={2}
                        >
                            测试测试测试测试 测试测试测试测试 测试测试测试测试
                        </Text>
                        {/*中部视图 关注或者进度条*/}
                        <View
                            style={{
                                marginTop: 5,
                                marginLeft:10
                            }}
                        >
                            <ProgressBarView/>
                            {/*<Text*/}
                                {/*style={ItemStyles.itemFolloweTextStyle}*/}
                                {/*number={1}*/}
                            {/*>*/}
                                {/*52人已关注*/}
                            {/*</Text>*/}
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
                                    $52起
                                </Text>
                                <Text style={{
                                    height: 11,
                                    fontSize: 11,
                                    textDecorationLine: 'line-through',
                                    color: ColorUtil.Color_999999
                                }}>
                                    $52起
                                </Text>
                            </View>
                            {/*右下角按钮*/}
                            <View
                                style={{
                                    // backgroundColor: 'red',
                                    backgroundColor: ColorUtil.Color_d51243,
                                    height: 30,
                                    width: (ScreenUtils.width / 2 - 16) / 2,
                                    borderRadius: 5,
                                    borderRadius: 5
                                }}>
                                <TouchableOpacity>
                                    <Text
                                        style={{
                                            color: ColorUtil.Color_ffffff,
                                            textAlign: 'center',
                                            height: 30,
                                            // alignItems:'center'
                                            // alignItems:'center'
                                            // alignSelf:'center'
                                            paddingTop: 8,
                                            fontSize: 12
                                        }}
                                    >
                                        马上抢
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {/*</View>*/}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    /**
     *
     * @private
     */
    _itemClickAction = () => {


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
        backgroundColor: 'red',
        width: ScreenUtils.width / 2 - 16,
        height: ScreenUtils.width / 2 - 16
    },
    itemBottomTextStyle: {
        padding: 10,
        color: ColorUtil.Color_222222,
        width: ScreenUtils.width / 2 - 16,
        height: 38,
        fontSize: 12
    },
    itemFolloweTextStyle: {
        color: ColorUtil.Color_33b4ff,
        fontSize: 11,
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10
    },
    itemBottomPriceTextStyle: {
        color: ColorUtil.Color_d51243,
        fontSize: 16,
        marginTop: 10
    }
});
