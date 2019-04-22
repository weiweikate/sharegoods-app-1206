import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';
import { MRText as Text } from '../../../components/ui/index';
import CommModal from '../../../comm/components/CommModal';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';

export default class DetailParamsModal extends Component {

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
        const { paramName, paramValue } = item;
        return <TouchableWithoutFeedback>
            <View style={styles.itemView}>
                <Text style={[styles.itemLeftText]}>{paramName}</Text>
                <Text
                    style={[styles.itemRightText]}>{paramValue}</Text>
            </View>
        </TouchableWithoutFeedback>;
    };

    _keyExtractor = (item, index) => {
        return `${item.message}${index}`;
    };

    render() {
        const { paramList } = this.state.pData || {};
        return (
            <CommModal onRequestClose={this._close}
                       visible={this.state.modalVisible}
                       transparent={true}>
                <View style={styles.containerView}>
                    <TouchableOpacity style={styles.topCloseBtn} onPress={this._close}/>
                    <View style={styles.bottomView}>
                        <Text style={styles.tittleText}>产品参数</Text>
                        <FlatList data={paramList || []}
                                  renderItem={this._renderItem}
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
    itemView: {
        flexDirection: 'row', alignItems: 'center',
        marginHorizontal: 15, marginVertical: 12.5
    },

    itemLeftText: {
        width: 78 + 24,
        color: DesignRule.textColor_instruction, fontSize: 13
    },
    itemRightText: {
        marginLeft: 5, flex: 1,
        color: DesignRule.textColor_mainTitle, fontSize: 13
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

