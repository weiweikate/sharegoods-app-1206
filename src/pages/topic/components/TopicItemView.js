import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import ColorUtil from '../../../utils/ColorUtil';
import ScreenUtils from '../../../utils/ScreenUtils';
import PreLoadImage from '../../../components/ui/preLoadImage/PreLoadImage';
import PropTypes from 'prop-types';
import StringUtils from '../../../utils/StringUtils';

export default class TopicItemView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { itemData, numOfColum } = this.props;
        return (
            <TouchableOpacity onPress={() => {
                this.props.itemClickAction && this.props.itemClickAction();
            }}>
                <View style={
                    [
                        Styles.itemBgStyle,
                        {
                            width: ScreenUtils.width / numOfColum,
                            height: ScreenUtils.width / numOfColum + 55
                        }
                    ]}>
                    <View style={Styles.itemContentStyle}>
                        {/*头部image*/}
                        <PreLoadImage
                            style={
                                [
                                    Styles.itemTopImageStyle,
                                    {
                                        width: ScreenUtils.width / numOfColum - 16,
                                        height: ScreenUtils.width / numOfColum - 16
                                    }
                                ]}
                            imageUri={itemData.specImg}
                        />
                        {/*<View style={*/}
                        {/*[Styles.itemTipBgViewStyle,*/}
                        {/*{*/}
                        {/*marginTop: ScreenUtils.width / numOfColum - 16 - 16,*/}
                        {/*width: ScreenUtils.width / numOfColum - 16*/}
                        {/*}*/}
                        {/*]*/}

                        {/*}>*/}
                        {/*/!*<Text style={Styles.itemTipTextStyle}>*!/*/}
                        {/*/!*测试测试测试测试*!/*/}
                        {/*/!*</Text>*!/*/}
                        {/*</View>*/}
                        <Text
                            style={
                                [
                                    Styles.itemBottomTextStyle,
                                    {
                                        width: ScreenUtils.width / numOfColum - 16
                                    }
                                ]}
                            numberOfLines={2}
                        >
                            {itemData.productName}
                        </Text>

                        <Text style={Styles.itemBottomPriceTextStyle}>
                            {StringUtils.formatMoneyString(itemData.originalPrice) + '起'}
                        </Text>

                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
TopicItemView.propTypes = {
    itemData: PropTypes.object.isRequired,
    numOfColum: PropTypes.number.isRequired,
    itemClickAction: PropTypes.func.isRequired
};

const Styles = StyleSheet.create({
    itemBgStyle: {
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

    },
    itemTipBgViewStyle: {
        position: 'absolute',
        alignItems: 'center',

        height: 16,
        opacity: 0.3,
        backgroundColor: 'black'
    },
    itemTipTextStyle: {
        flex: 1,
        paddingTop: 3,
        fontSize: 11,
        color: ColorUtil.Color_ffffff

    },
    itemBottomTextStyle: {
        marginTop: 10,
        color: ColorUtil.Color_222222,
        height: 27,
        fontSize: 11
    },
    itemBottomPriceTextStyle: {
        color: ColorUtil.Color_d51243,
        fontSize: 16,
        marginTop: 5
    }
});
