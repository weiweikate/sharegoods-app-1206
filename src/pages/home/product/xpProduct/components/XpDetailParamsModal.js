import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MRText as Text } from '../../../../../components/ui';
import Modal from 'CommModal';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import DesignRule from '../../../../../constants/DesignRule';

const { px2dp } = ScreenUtils;

export default class XpDetailParamsModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
    }

    show = () => {
        this.setState({
            modalVisible: true
        });
    };

    _close = () => {
        this.setState({
            modalVisible: false
        });
    };

    render() {
        return (
            <Modal onRequestClose={this._close}
                   visible={this.state.modalVisible}
                   transparent={true}>
                <View style={styles.containerView}>
                    <TouchableOpacity style={styles.topCloseBtn} onPress={this._close}/>
                    <View style={styles.bottomView}>
                        <FlatList/>
                        <TouchableOpacity style={styles.sureBtn} onPress={this._close}>
                            <Text style={styles.sureText}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    sureBtn: {
        justifyContent: 'center', alignItems: 'center',
        alignSelf: 'center',
        height: 44, width: ScreenUtils.width - 30, marginBottom: ScreenUtils.safeBottom,
        backgroundColor: DesignRule.bgColor_btn, borderRadius: 22
    },
    sureText: {
        color: DesignRule.white, fontSize: 17
    }
});

