import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { MRText as Text } from '../../../../components/ui/index';
import DesignRule from '../../../../constants/DesignRule';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';

const { px2dp } = ScreenUtils;
const itemWidth = px2dp(97);

@observer
class ListItem extends Component {
    render() {
        const { selectSpuCode } = this.props.xpDetailModel;
        const { name, spuCode, isSelected } = this.props.item;
        const ViewBorderColor = isSelected ? DesignRule.mainColor : DesignRule.lineColor_inWhiteBg;
        return (
            <TouchableWithoutFeedback onPress={() => selectSpuCode(spuCode)}>
                <View style={[styles.itemView, { borderColor: ViewBorderColor }]}>
                    <Text style={styles.itemText} numberOfLines={1}>{name || ''}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

@observer
export class XpDetailUpSelectListView extends Component {

    _renderItem = ({ item }) => {
        return <ListItem item={item} xpDetailModel={this.props.xpDetailModel}/>;
    };

    _keyExtractor = (item, index) => {
        return `${item.spuCode}${index}`;
    };

    _getItemLayout = (data, index) => {
        return { length: itemWidth + 15, offset: (itemWidth + 15) * index, index: index };
    };

    _scrollToIndex = (index) => {
        this.flatList && this.flatList.scrollToIndex({
            viewPosition: 0.5,
            animated: true,
            index: index
        });
    };

    autoScroll = autorun(
        () => {
            this._scrollToIndex(this.props.xpDetailModel.selectedSpuIndex);
        }
    );

    render() {
        const { prods, showUpSelectList, selectedSpuIndex } = this.props.xpDetailModel;
        return (
            <View style={styles.bgView}>
                {showUpSelectList ? <FlatList data={prods}
                                              ref={(ref) => this.flatList = ref}
                                              renderItem={this._renderItem}
                                              keyExtractor={this._keyExtractor}
                                              initialScrollIndex={selectedSpuIndex}
                                              getItemLayout={this._getItemLayout}
                                              horizontal={true}
                                              showsHorizontalScrollIndicator={false}/> : null}

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
        width: itemWidth, height: px2dp(28), marginLeft: 15, marginVertical: 8,
        borderRadius: px2dp(14), borderWidth: 1
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
