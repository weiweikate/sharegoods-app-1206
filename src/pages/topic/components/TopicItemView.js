import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import ImageLoad from '@mr/image-placeholder';
import PropTypes from 'prop-types';
import DesignRule from 'DesignRule';
import { getShowPrice } from '../model/TopicMudelTool';
import UIText from '../../../components/ui/UIText';

export default class TopicItemView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { itemData, numOfColum } = this.props;
        const mainWidth = ScreenUtils.width - 20;
        const contentWidth = (mainWidth - (20 * (numOfColum - 1))) / numOfColum;
        return (
            <TouchableOpacity onPress={() => {
                this.props.itemClickAction && this.props.itemClickAction();
            }}>
                <View style={
                    [
                        Styles.itemBgStyle,
                        {
                            width: mainWidth / numOfColum
                        }
                    ]}>
                    <View style={[
                        Styles.itemContentStyle,
                        {
                            width: contentWidth
                        }
                    ]}>
                        {/*头部image*/}
                        <ImageLoad
                            width={contentWidth}
                            height={contentWidth}
                            source={{ uri: itemData.specImg }}
                        />
                        <UIText
                            style={
                                [
                                    Styles.itemBottomTextStyle,
                                    {
                                        width: contentWidth - 16
                                    }
                                ]}
                            numberOfLines={2}
                            value={itemData.productName}
                        />
                        {itemData.productType !== 5
                            ?
                            <UIText style={Styles.itemBottomPriceTextStyle}
                                    value={getShowPrice(itemData) + '起'}>
                                {/*{ '¥'+itemData.originalPrice+ '起'}*/}
                                {/*{getShowPrice(itemData) + '起'}*/}
                            </UIText>
                            :
                            <UIText style={Styles.itemBottomPriceTextStyle}>
                                {/*{ '¥'+itemData.originalPrice+ '起'}*/}
                                {/*{'专题类目'}*/}
                            </UIText>
                        }
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
        paddingTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemContentStyle: {
        backgroundColor: 'white',
        paddingBottom: 8
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
        color: 'white'
    },
    itemBottomTextStyle: {
        includeFontPadding: false,
        marginTop: 10,
        color: DesignRule.textColor_mainTitle,
        height: 29,
        fontSize: 12,
        marginLeft: 10
    },
    itemBottomPriceTextStyle: {
        color: DesignRule.mainColor,
        fontSize: 16,
        marginTop: 5,
        marginLeft: 10
    }
});
