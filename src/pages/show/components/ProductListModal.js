/**
 * @author xzm
 * @date 2019/5/8
 */

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import CommModal from '../../../comm/components/CommModal';
import DesignRule from '../../../constants/DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import { MRText } from '../../../components/ui';
import EmptyUtils from '../../../utils/EmptyUtils';
import res from '../res';
import ImageLoad from '@mr/image-placeholder';

const { addCarIcon } = res;

const { px2dp } = ScreenUtils;
export default class ProductListModal extends PureComponent {
    constructor(props) {
        super(props);
    }

    _renderItem = (value, index) => {
        return (
            <View key={'product' + index} style={styles.itemWrapper}>
                <ImageLoad style={styles.productIcon}/>
                <View style={styles.itemInfoWrapper}>
                    <MRText style={styles.nameText}
                            numberOfLines={1}
                            ellipsizeMode={'tail'}>
                        1:32铝合金仿真宝马x6车模110玩仿真宝马x6车模110玩仿真宝马x6车模110玩具宝马模…
                    </MRText>

                    <View style={styles.priceWrapper}>
                        <MRText style={styles.curPrice}>
                            ￥499
                        </MRText>
                        <MRText style={styles.oriPrice}>
                            ￥499
                        </MRText>
                        <View style={{ flex: 1 }}/>
                        <Image source={addCarIcon} style={styles.carIcon}/>
                    </View>
                </View>
            </View>
        );
    };

    _renderList = () => {
        if (EmptyUtils.isEmptyArr(this.props.products)) {
            return null;
        }

        let list = this.props.products.map((value, index) => {
            return this._renderItem(value, index);
        });
        return list;
    };

    render() {
        return (
            <CommModal visible={this.props.visible}>
                <View style={styles.contain}>
                    <View style={styles.headerWrapper}>
                        <View style={{ flex: 1 }}/>
                        <MRText>
                            {`共${this.props.products.length}个商品`}
                        </MRText>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableWithoutFeedback onPress={this.props.requestClose}>
                            <View style={styles.closeWrapper}>
                                <View style={styles.closeIcon}/>
                            </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {this._renderList()}
                    </ScrollView>
                </View>
            </CommModal>
        );
    }
}

var styles = StyleSheet.create({
    contain: {
        width: DesignRule.width,
        height: ScreenUtils.height * 0.65,
        backgroundColor: DesignRule.bgColor,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        position: 'absolute',
        left: 0,
        bottom: 0
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: px2dp(15)
    },
    closeWrapper: {
        width: px2dp(30),
        height: px2dp(30),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:px2dp(8)
    },
    closeIcon: {
        height: px2dp(11),
        width: px2dp(11),
        backgroundColor: 'red'
    },
    itemWrapper: {
        height: px2dp(70),
        borderRadius: 5,
        backgroundColor: DesignRule.white,
        flexDirection: 'row',
        marginRight: px2dp(10),
        width: DesignRule.width - px2dp(30),
        marginBottom:px2dp(10),
        marginLeft:px2dp(15)
    },
    productIcon: {
        width: px2dp(60),
        height: px2dp(60),
        marginVertical:px2dp(5),
        marginLeft:px2dp(5),
        marginRight:px2dp(10)
    },
    itemInfoWrapper: {
        paddingVertical: px2dp(5),
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: px2dp(5)
    },
    nameText: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_24
    },
    priceWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    carIcon: {
        width: px2dp(20),
        height: px2dp(20),
        marginRight: px2dp(10)
    },
    curPrice: {
        color: DesignRule.mainColor,
        fontSize: px2dp(15)
    },
    oriPrice: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(10),
        marginLeft: px2dp(5)
    },
    titleTextStyle:{
        color:DesignRule.textColor_instruction,
        fontSize:DesignRule.fontSize_secondTitle
    }
});

