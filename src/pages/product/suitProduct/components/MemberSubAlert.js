/**
 * @author 陈阳君
 * @date on 2019/10/08
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { MRText } from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import LinearGradient from 'react-native-linear-gradient';

export class MemberSubAlert extends Component {
    state = { modalVisible: false };
    open = () => {
        this.setState({
            modalVisible: true
        });
    };

    close = () => {
        this.setState({
            modalVisible: false
        });
    };

    _renderItem = ({ item }) => {
        const { name, imgUrl, minPrice } = item;
        return (
            <View style={styles.itemView}>
                <UIImage source={{ uri: imgUrl }} style={styles.itemImg}/>
                <View style={styles.textView}>
                    <MRText style={{ color: DesignRule.textColor_mainTitle, fontSize: 12 }}
                            numberOfLines={2}>{name}</MRText>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <MRText style={{
                            color: DesignRule.textColor_instruction,
                            fontSize: 12
                        }}>原价:￥{minPrice}</MRText>
                        <MRText style={{ color: DesignRule.textColor_instruction, fontSize: 12 }}>x1</MRText>
                    </View>
                </View>
            </View>
        );
    };

    render() {
        if (!this.state.modalVisible) {
            return null;
        }
        const { subProducts, mainProduct } = this.props.memberProductModel;
        return (
            <View style={styles.bgView}>
                <View style={styles.container}>
                    <View style={styles.titleView}>
                        <MRText style={styles.titleText}>礼包套餐商品</MRText>
                    </View>
                    <FlatList data={[mainProduct, ...subProducts]}
                              renderItem={this._renderItem}
                              keyExtractor={this._keyExtractor}/>
                    <NoMoreClick onPress={this.close}>
                        <LinearGradient style={styles.btn}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={['#FC5D39', '#FF0050']}>
                            <MRText style={{ fontSize: 16, color: 'white' }}>确定</MRText>
                        </LinearGradient>
                    </NoMoreClick>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bgView: {
        zIndex: 2000,
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center'
    },
    container: {
        width: ScreenUtils.px2dp(310), height: ScreenUtils.px2dp(390), backgroundColor: 'white',
        borderRadius: 15
    },

    titleView: {
        height: 53, justifyContent: 'center', alignItems: 'center'
    },
    titleText: {
        color: DesignRule.textColor_redWarn, fontSize: 16, fontWeight: '500'
    },

    itemView: {
        flexDirection: 'row', marginHorizontal: 15, marginBottom: 10
    },
    itemImg: {
        width: ScreenUtils.px2dp(80), height: ScreenUtils.px2dp(80), borderRadius: 5, overflow: 'hidden'
    },
    textView: {
        justifyContent: 'space-between', flex: 1, marginLeft: 10
    },

    btn: {
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
        width: ScreenUtils.px2dp(160), height: 40, borderRadius: 20,
        marginTop: 10, marginBottom: 10
    }
});
