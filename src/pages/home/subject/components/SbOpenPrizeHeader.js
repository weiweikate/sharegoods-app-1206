import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity


} from 'react-native';

import React, { Component } from 'react';
import ScreenUtils from '../../../../utils/ScreenUtils';
import PropTypes from 'prop-types';
import ColorUtil from '../../../../utils/ColorUtil';
import UIText from '../../../../comm/components/UIText';
import bridge from '../../../../utils/bridge';
import SbResTool from '../res/SbResTool';


export default class SbOpenPrizeHeader extends Component {

    static propTypes = {
        subjectType: PropTypes.number

    };

    state = {
        selectSate: 2

    };
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <View>
                <Image
                    style={SbOpenPrizeHeaderStyles.topImageStyle}
                />
                <View style={SbOpenPrizeHeaderStyles.bottomDownViewBgStyle}>
                    <View
                        style={
                            {
                                width: ScreenUtils.width,
                                height: 48,
                                backgroundColor: 'white'
                            }
                        }
                    />

                    <Image
                        source={SbResTool.miaosha_qianggouzhong_img}
                        style={[itemViewStyle.itemBgImageStyle,
                            { left: this.state.selectSate * ScreenUtils.width / 5 }]}
                    />

                    <View
                        style={{
                            position: 'absolute',
                            height: 48,
                            width: ScreenUtils.width,
                            left: 0,
                            top: 0,
                            flexDirection: 'row'
                        }}
                    >
                        {this._getDownTimeItemView().map(itemView => {
                            return itemView;
                        })}
                    </View>
                </View>

            </View>
        );
    }

    _getDownTimeItemView = () => {
        let itemArr = [
            '00:00',
            '08:00',
            '10:00',
            '22:00',
            '00:00'
        ];
        let tempCompoentArr = [];
        itemArr.map((item, index) => {
            tempCompoentArr.push(
                <TouchableOpacity onPress={() => {
                    this._downItemViewClick(index, item);
                }} key={index}>
                    <View style={itemViewStyle.itemBgStyle}>
                        <UIText
                            value={item}
                            style={[itemViewStyle.itemTopTextStyle, this.state.selectSate === index ?
                                {
                                    color: ColorUtil.Color_ffffff
                                } : null]}
                        />
                        <UIText
                            value={'已经开抢'}
                            style={
                                [
                                    itemViewStyle.itemBottomTextStyle,
                                    this.state.selectSate === index ?
                                        {
                                            color: ColorUtil.Color_ffffff
                                        } : null
                                ]
                            }
                        />
                    </View>
                </TouchableOpacity>
            );
        });
        return tempCompoentArr;
    };

    _downItemViewClick = (index, item) => {
        this.setState({
            selectSate: index
        });
        bridge.$toast('点击了 ' + item + ' 索引:' + index);
    };
}

const SbOpenPrizeHeaderStyles = StyleSheet.create({
    headerBgViewStyle: {
        backgroundColor: ColorUtil.Color_f7f7f7
    },
    topImageStyle: {
        width: ScreenUtils.width,
        height: ScreenUtils.width * 188 / 375,
        backgroundColor: 'red'
    },
    bottomDownViewBgStyle: {
        height: 55,
        width: ScreenUtils.width,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: ColorUtil.Color_f7f7f7

    }
});

const itemViewStyle = StyleSheet.create({
    itemBgStyle: {
        width: ScreenUtils.width / 5,
        height: 48
    },
    itemBgImageStyle: {
        position: 'absolute',
        width: ScreenUtils.width / 5,
        height: 55
    },
    itemTopTextStyle: {
        flex: 1,
        zIndex: 20,
        marginTop: 5,
        color: ColorUtil.Color_222222,
        textAlign: 'center',
        fontWeight: '800',
        fontSize: 18
    },
    itemBottomTextStyle: {
        flex: 1,
        zIndex: 20,
        color: ColorUtil.Color_999999,
        textAlign: 'center',
        fontSize: 12
    }

});


