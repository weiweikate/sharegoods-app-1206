import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    NativeModules,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Modal from '../../../comm/components/CommModal';
import {
    UIText, UIImage, MRText as Text
} from '../../../components/ui';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';

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
                        backgroundColor: this.state.currentSelect === i ? DesignRule.bgColor : 'white'
                    }} onPress={() => {
                        this.setState({ currentSelect: i });
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ marginLeft: 21 , includeFontPadding: false}}>{nameArr[i]}</Text>
                            <UIImage source={this.state.currentSelect === i ? circleSelect : circleUnselect}
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
        if (this.state.currentSelect === -1) {
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
                        flexDirection: 'row',
                        borderBottomWidth: DesignRule.lineHeight,
                        borderBottomColor: DesignRule.lineColor_inWhiteBg
                    }}>
                        <TouchableOpacity style={{ paddingRight: 17, width: 50 }}>
                            <UIText value={' '} style={{ color: DesignRule.textColor_hint, fontSize: 24 }}/>
                        </TouchableOpacity>
                        <UIText value={'请选择'}/>
                        <TouchableOpacity style={{ paddingLeft: 17, width: 50 }}
                                          onPress={() => {this.props.closeWindow(),this.setState({currentSelect: -1})}}>
                            <UIText value={'x'} style={{ color: DesignRule.textColor_hint, fontSize: 24 }}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView >
                    {this.renderMenu()}
                    </ScrollView>
                    <TouchableOpacity style={{  height:  45 ,justifyContent: 'center', alignItems: 'center',backgroundColor: DesignRule.mainColor}}
                                      onPress={() => {this.commitSelect()}}>
                        <UIText value={'确定'} style={{ color: 'white', fontSize: 16}}/>
                    </TouchableOpacity>
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


