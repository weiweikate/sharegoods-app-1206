import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
// import ImageLoad from '@mr/image-placeholder'
import PropTypes from 'prop-types';
import DesignRule from 'DesignRule';
import { getShowPrice } from '../model/TopicMudelTool';
import PreLoadImage from '../../../components/ui/preLoadImage/PreLoadImage';

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
                        }
                    ]}>
                    <View style={Styles.itemContentStyle}>
                        {/*头部image*/}
                        <PreLoadImage
                            style={{
                                width: ScreenUtils.width / numOfColum - 16,
                                height: ScreenUtils.width / numOfColum - 16
                            }}
                            imageUri={itemData.specImg}
                        />
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
                            {/*{ '¥'+itemData.originalPrice+ '起'}*/}
                            { getShowPrice(itemData)+ '起'}
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
        backgroundColor: DesignRule.bgColor,
        padding: 8
    },
    itemContentStyle: {
        backgroundColor: 'white',
        paddingBottom:8
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
        marginTop: 10,
        color: DesignRule.textColor_mainTitle,
        height: 27,
        fontSize: 11
    },
    itemBottomPriceTextStyle: {
        color: DesignRule.mainColor,
        fontSize: 16,
        marginTop: 5,
    }
});
