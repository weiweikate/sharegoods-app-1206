import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import { MRText as Text } from '../../../../components/ui/index';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import CommModal from '../../../../comm/components/CommModal';

const { px2dp } = ScreenUtils;

export default class XpDetailParamsModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            pParamList: []
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.modalVisible !== nextState.modalVisible) {
            return true;
        }
        return false;
    }

    show = (xpDetailModel) => {
        this.setState({
            modalVisible: true,
            pParamList: xpDetailModel.pParamList
        });
    };

    _close = () => {
        this.setState({
            modalVisible: false
        });
    };

    _renderItem = ({ item }) => {
        return <ListItem item={item}/>;
    };

    _keyExtractor = (item, index) => {
        return `${item.paramName}${index}`;
    };

    render() {
        return (
            <CommModal onRequestClose={this._close}
                   visible={this.state.modalVisible}
                   transparent={true}>
                <View style={styles.containerView}>
                    <TouchableOpacity style={styles.topCloseBtn} onPress={this._close}/>
                    <View style={styles.bottomView}>
                        <Text style={styles.tittleText}>产品参数</Text>
                        <FlatList data={this.state.pParamList}
                                  renderItem={this._renderItem}
                                  keyExtractor={this._keyExtractor}
                                  showsHorizontalScrollIndicator={false}/>
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
        height: px2dp(271)
    },
    bottomView: {
        flex: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10,
        backgroundColor: DesignRule.white
    },

    tittleText: {
        alignSelf: 'center', marginTop: 15,
        fontSize: 17, color: DesignRule.textColor_mainTitle
    },

    sureBtn: {
        justifyContent: 'center', alignItems: 'center',
        alignSelf: 'center',
        height: 44, width: ScreenUtils.width - 30, marginBottom: ScreenUtils.safeBottom + 15,
        backgroundColor: DesignRule.bgColor_btn, borderRadius: 22
    },
    sureText: {
        color: DesignRule.white, fontSize: 17
    },

    itemView: {
        flexDirection: 'row',
        marginVertical: 14
    },
    nameView: {
        width: ScreenUtils.px2dp(122)
    },
    nameText: {
        marginHorizontal: 15,
        fontSize: 13, color: DesignRule.textColor_instruction
    },
    valueView: {
        flex: 1
    },
    valueText: {
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    lineView: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: DesignRule.lineColor_inWhiteBg
    }
});

class ListItem extends Component {

    render() {
        const { paramName, paramValue } = this.props.item;
        return (
            <TouchableWithoutFeedback>
                <View>
                    <View style={styles.itemView}>
                        <View style={styles.nameView}>
                            <Text style={styles.nameText} numberOfLines={1}>{paramName}</Text>
                        </View>
                        <View style={styles.valueView}>
                            <Text style={styles.valueText} numberOfLines={1}>{paramValue}</Text>
                        </View>
                    </View>
                    <View style={styles.lineView}/>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

