import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { MRText as Text } from '../../../../components/ui/index';
import DesignRule from '../../../../constants/DesignRule';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';

const { px2dp } = ScreenUtils;
const itemWidth = px2dp(100) + 15;

@observer
class ListItem extends Component {

    render() {
        const { selectSpuCode } = this.props.xpDetailModel;
        const { name, imgUrl, spuCode, isSelected } = this.props.item;
        const ViewBorderColor = isSelected ? DesignRule.mainColor : DesignRule.lineColor_inWhiteBg;
        return (
            <TouchableWithoutFeedback onPress={() => selectSpuCode(spuCode)}>
                <View
                    style={[styles.itemView, { borderColor: ViewBorderColor }]}>
                    <UIImage style={styles.itemImg} source={{ uri: imgUrl }}/>
                    <Text style={styles.itemText} numberOfLines={1}>{name}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

@observer
export class XpDetailSelectListView extends Component {

    _renderItem = ({ item }) => {
        return <ListItem item={item} xpDetailModel={this.props.xpDetailModel}/>;
    };

    _keyExtractor = (item, index) => {
        return `${item.spuCode}${index}`;
    };

    _getItemLayout = (data, index) => {
        return { length: itemWidth + 16, offset: (itemWidth + 16) * index, index: index };
    };

    _ListFooterComponent = () => {
        return <View style={{ width: 15, height: 1 }}/>;
    };

    _scrollToIndex = (index) => {
        this.flatList && this.flatList.scrollToIndex({
            viewPosition: Platform.OS === 'ios' ? 0.5 : 0,//ios可以弹性拉伸停驻点在中间，android不可弹性拉伸停驻点在起点。这个比较好看
            animated: true,
            index: index
        });
    };

    autoScroll = autorun(
        () => {
            const { selectedSpuIndex } = this.props.xpDetailModel;
            setTimeout(() => this._scrollToIndex(selectedSpuIndex), 100);
        }
    );

    render() {
        const { prods } = this.props.xpDetailModel;
        return (
            <View style={styles.bgView}>
                <FlatList data={prods}
                          ref={(ref) => this.flatList = ref}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}
                          getItemLayout={this._getItemLayout}
                          horizontal={true}
                          ListFooterComponent={this._ListFooterComponent}
                          showsHorizontalScrollIndicator={false}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bgView: {
        paddingTop: 10, paddingBottom: 20,
        backgroundColor: DesignRule.white
    },
    /*item*/
    itemView: {
        width: itemWidth,
        marginLeft: 15, borderRadius: 5, borderWidth: 1, overflow: 'hidden'
    },
    itemImg: {
        width: itemWidth, height: px2dp(90)
    },
    itemText: {
        textAlign: 'center',
        paddingVertical: 7, paddingHorizontal: 5,
        fontSize: 12, color: DesignRule.textColor_mainTitle
    }
});

export default XpDetailSelectListView;
