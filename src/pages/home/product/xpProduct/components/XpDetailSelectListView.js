import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import { MRText as Text } from '../../../../../components/ui';
import DesignRule from '../../../../../constants/DesignRule';
import { observer } from 'mobx-react';

const { px2dp } = ScreenUtils;

@observer
class ListItem extends Component {

    render() {
        const { selectSpuCode } = this.props.xpDetailModel;
        const { name, imgUrl, spuCode, isSelected } = this.props.item;
        const ViewBorderColor = isSelected ? DesignRule.mainColor : DesignRule.lineColor_inWhiteBg;
        return (
            <TouchableWithoutFeedback onPress={() =>  selectSpuCode(spuCode)}>
                <View style={[styles.itemView, { borderColor: ViewBorderColor }]}>
                    <UIImage style={styles.itemImg} source={imgUrl}/>
                    <Text style={styles.itemText} numberOfLines={1}>{name}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export class XpDetailSelectListView extends Component {

    _renderItem = ({ item }) => {
        return <ListItem item={item} xpDetailModel={this.props.xpDetailModel}/>;
    };

    _keyExtractor = (item, index) => {
        return `${item.spuCode}${index}`;
    };

    render() {
        const { prods } = this.props.xpDetailModel;
        return (
            <View style={styles.bgView}>
                <FlatList data={prods}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bgView: {
        paddingTop: 10,
        backgroundColor: DesignRule.white
    },
    /*item*/
    itemView: {
        width: px2dp(100), marginLeft: 15,
        borderRadius: 5, borderWidth: 1
    },
    itemImg: {
        width: px2dp(100), height: px2dp(90)
    },
    itemText: {
        textAlign: 'center',
        paddingVertical: 7, paddingHorizontal: 5,
        fontSize: 12, color: DesignRule.textColor_mainTitle
    }
});

export default XpDetailSelectListView;
