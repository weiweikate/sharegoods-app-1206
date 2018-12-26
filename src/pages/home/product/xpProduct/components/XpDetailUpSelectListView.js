import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import { MRText as Text } from '../../../../../components/ui';
import DesignRule from '../../../../../constants/DesignRule';

const { px2dp } = ScreenUtils;

class ListItem extends Component {
    render() {
        const { tittle } = this.props.item || {};
        return (
            <TouchableWithoutFeedback>
                <View style={styles.itemView}>
                    <Text style={styles.itemText} numberOfLines={1}>{tittle || ''}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export class XpDetailUpSelectListView extends Component {

    _renderItem = ({ item }) => {
        return <ListItem item={item}/>;
    };

    _keyExtractor = (item, index) => {
        return `${item.id}${index}`;
    };

    render() {
        const { xpDetailModel } = this.props;
        return (
            <View style={styles.bgView}>
                <FlatList data={xpDetailModel.listData}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}/>
                <View style={styles.lineView}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bgView: {
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2,
        backgroundColor: DesignRule.white
    },
    itemView: {
        justifyContent: 'center',
        width: px2dp(97), height: px2dp(28), marginLeft: 15, marginVertical: 8,
        borderRadius: px2dp(14), borderWidth: 1, borderColor: DesignRule.lineColor_inWhiteBg
    },
    itemText: {
        paddingHorizontal: 5,
        fontSize: 12, color: DesignRule.textColor_instruction,
        textAlign: 'center'
    },
    lineView: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: DesignRule.lineColor_inWhiteBg
    }
});

export default XpDetailUpSelectListView;
