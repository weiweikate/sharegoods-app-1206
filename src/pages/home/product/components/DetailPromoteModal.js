import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';
import { MRText as Text } from '../../../../components/ui';
import CommModal from '../../../../comm/components/CommModal';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';

export default class DetailPromoteModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            pData: {}
        };
    }

    show = (pData) => {
        this.setState({
            modalVisible: true,
            pData
        });
    };

    _close = () => {
        this.setState({
            modalVisible: false
        });
    };

    _renderItem = ({ item }) => {
        //8：经验翻倍 9：券兑换
        const { type, message } = item;
        let typeText;
        if (type === 8) {
            typeText = '经验翻倍';
        } else if (type === 9) {
            typeText = '券兑换';
        }
        return <TouchableWithoutFeedback>
            <View style={styles.promotionItemView}>
                {typeText ?
                    <View style={styles.promotionItemRedView}>
                        <Text style={[styles.promotionItemRedText]}>{typeText}</Text>
                    </View>
                    :
                    null
                }
                <Text
                    style={[styles.promotionItemText]}>{message || ''}</Text>
            </View>
        </TouchableWithoutFeedback>;
    };

    _keyExtractor = (item, index) => {
        return `${item.message}${index}`;
    };

    _ItemSeparatorComponent = () => {
        return <View style={{ backgroundColor: DesignRule.lineColor_inWhiteBg, height: 0.5 }}/>;
    };

    render() {
        const { promoteInfoVOList } = this.state.pData || {};
        return (
            <CommModal onRequestClose={this._close}
                       visible={this.state.modalVisible}
                       transparent={true}>
                <View style={styles.containerView}>
                    <TouchableOpacity style={styles.topCloseBtn} onPress={this._close}/>
                    <View style={styles.bottomView}>
                        <Text style={styles.tittleText}>促销</Text>
                        <FlatList data={promoteInfoVOList || []}
                                  renderItem={this._renderItem}
                                  ItemSeparatorComponent={this._ItemSeparatorComponent}
                                  showsVerticalScrollIndicator={false}
                                  keyExtractor={this._keyExtractor}/>
                        <TouchableOpacity style={styles.sureBtn} onPress={this._close}>
                            <Text style={styles.sureText}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </CommModal>
        );
    }
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: ScreenUtils.width
    },
    topCloseBtn: {
        flex: 1

    },
    bottomView: {
        height: ScreenUtils.autoSizeHeight(440), borderTopLeftRadius: 10, borderTopRightRadius: 10,
        backgroundColor: DesignRule.white
    },

    tittleText: {
        alignSelf: 'center', marginTop: 15,
        fontSize: 17, color: DesignRule.textColor_mainTitle
    },
    promotionItemView: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15,
        paddingVertical: 14
    },
    promotionItemRedView: {
        borderRadius: 3, borderWidth: 1, borderColor: DesignRule.mainColor
    },
    promotionItemRedText: {
        paddingHorizontal: 4, paddingVertical: 2,
        color: DesignRule.textColor_redWarn, fontSize: 10
    },

    promotionItemText: {
        marginLeft: 10, flex: 1,
        color: DesignRule.textColor_mainTitle, fontSize: 12
    },

    sureBtn: {
        justifyContent: 'center', alignItems: 'center',
        alignSelf: 'center',
        height: 44, width: ScreenUtils.width - 30, marginBottom: ScreenUtils.safeBottom + 15,
        backgroundColor: DesignRule.bgColor_btn, borderRadius: 22
    },
    sureText: {
        color: DesignRule.white, fontSize: 17
    }
});

