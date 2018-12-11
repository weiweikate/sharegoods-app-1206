import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    // Modal,
    NativeModules,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Modal from 'CommModal';
import {
    UIText, UIImage, UIButton
} from '../../../components/ui';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';

import res from '../res';
const circleSelect = res.button.selected_circle_red;
const circleUnselect = res.button.unselected_circle;

export default class BottomSingleSelectModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentSelect: -1
        };
    }

    open = () => {
        this.modal && this.modal.open();
    };

    render() {
        return (
            <Modal
                animationType='slide'
                transparent={true}
                ref={(ref) => {
                    this.modal = ref;
                }}
                onRequestClose={() => {
                }}
                visible={this.props.isShow}>
                <View style={styles.modalStyle}>
                    {this.renderContent()}
                </View>
            </Modal>
        );
    }

    renderMenu = () => {
        let nameArr = this.props.detail;
        let itemArr = [];
        for (let i = 0; i < nameArr.length; i++) {
            itemArr.push(
                <View key={i}>
                    <TouchableOpacity key={i} style={{
                        height: 48,
                        justifyContent: 'center',
                        backgroundColor: this.state.currentSelect == i ? DesignRule.bgColor : 'white'
                    }} onPress={() => {
                        this.setState({ currentSelect: i });
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ marginLeft: 21 }}>{nameArr[i]}</Text>
                            <UIImage source={this.state.currentSelect == i ? circleSelect : circleUnselect}
                                     style={{ width: 22, height: 22, marginRight: 22 }}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: DesignRule.lineColor_inColorBg, height: 1 }}/>
                </View>
            );
        }
        return itemArr;
    };
    commitSelect = () => {
        if (this.state.currentSelect == -1) {
            NativeModules.commModule.toast('请先勾选');
        } else {
            this.props.commit(this.state.currentSelect);
            this.setState({currentSelect:-1})
        }
    };

    renderContent() {

        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                flexDirection: 'row'
            }}>
                <View style={{ height: ScreenUtils.height / 3 * 2, backgroundColor: 'white', flex: 1, paddingBottom: ScreenUtils.safeBottom}}>
                    <View style={{
                        height: 48,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignContent: 'center',
                        flexDirection: 'row'
                    }}>
                        <TouchableOpacity style={{ paddingLeft: 17, width: 50 }}
                                          onPress={() => {this.props.closeWindow(),this.setState({currentSelect: -1})}}>
                            <UIText value={'x'} style={{ color: DesignRule.textColor_hint, fontSize: 24 }}/>
                        </TouchableOpacity>
                        <UIText value={'请选择'}/>
                        <TouchableOpacity style={{ paddingRight: 17, width: 50 }}>
                            <UIText value={' '} style={{ color: DesignRule.textColor_hint, fontSize: 24 }}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView >
                    {this.renderMenu()}
                    </ScrollView>
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: 64 }}>
                        <UIButton
                            value={'确定'}
                            style={{ backgroundColor: DesignRule.mainColor, height: 43 }}
                            onPress={() => this.commitSelect()}/>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modalStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        flex: 1,
        width: ScreenUtils.width
    }
});


