/**
 * 首页头部分类view
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Image,
    Text
} from 'react-native';
import PropTypes from 'prop-types';
import ScreenUtils from '../../../utils/ScreenUtils';

export default class HomeClassifyView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { itemTitles, itemImages } = this.props;
        let tempArr = [];
        if (itemTitles && itemTitles instanceof Array && itemTitles.length > 0) {
            itemTitles.map((titleString, index) => {
                let itemValue = {
                    titleStr: titleString,
                    imageUrl: itemImages[index]
                };
                tempArr.push(itemValue);
            });
        }
        return (
            (tempArr && tempArr.length > 0) ? this._renderContentView(tempArr) : null
        );
    }

    _renderContentView(itemArr) {
        const itemViewArr = this._getAllItemView(itemArr);
        return (
            this._getPackingRowView(itemViewArr)
        );
    }

    /*组装没一行View*/
    _getPackingRowView(itemViewArr) {
        const { itemClickAction } = this.props;
        return (
            <View style={Styles.bgViewStyle}>
                {
                    itemViewArr.map((itemView, index) => {
                        return (
                            <TouchableHighlight onPress={() => itemClickAction(index)}>
                                {itemView}
                            </TouchableHighlight>
                        );
                    })
                }
            </View>
        );
    }

    _getAllItemView(itemArr) {
        const tempArr = [];

        itemArr.map((itemValue) => {
            tempArr.push(
                <View style={Styles.itemViewStyle}>
                    <Image
                        style={Styles.itemImageStyle}
                        source={itemValue.imageUrl}
                    />
                    <Text style={Styles.itemTitleStyle}>
                        {itemValue.titleStr}
                    </Text>
                </View>
            );
        });
        return tempArr;
    }
}

const Styles = StyleSheet.create(
    {
        bgViewStyle: {
            width: ScreenUtils.width,
            flexWrap: 'wrap',
            display: 'flex',
            flexDirection: 'row'
        },
        itemViewStyle: {
            width: ScreenUtils.width / 5,
            height: 90,
            paddingTop: 10,
            alignItems: 'center'
        },
        itemImageStyle: {
            height: 48,
            width: 48
        },
        itemTitleStyle: {
            marginTop: 10
        }
    }
);

HomeClassifyView.propTypes = {
    itemTitles: PropTypes.object,
    itemImages: PropTypes.object,
    itemClickAction: PropTypes.func

};



