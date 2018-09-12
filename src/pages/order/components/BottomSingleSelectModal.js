import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    NativeModules,
    TouchableOpacity, Button
} from 'react-native';
import { color } from '../../../constants/Theme';
import circleSelect from '../../mine/res/userInfoImg/circleSelect.png';
import circleUnselect from '../../mine/res/userInfoImg/circleUnselect.png';
import {
    UIText, UIImage
} from '../../../components/ui';

export default class BottomSingleSelectModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentSelect: -1
        };
    }

    render() {
        return (
            <Modal
                animationType='slide'
                transparent={true}
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
                        backgroundColor: this.state.currentSelect == i ? color.gray_f7f7 : color.white
                    }} onPress={() => {
                        this.setState({ currentSelect: i });
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ marginLeft: 21 }}>{nameArr[i]}</Text>
                            <UIImage source={this.state.currentSelect == i ? circleSelect : circleUnselect}
                                     style={{ width: 22, height: 22, marginRight: 22 }}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: color.gray_EEE, height: 1 }}></View>
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
                <View style={{ flex: 1, backgroundColor: color.white }}>
                    <View style={{
                        height: 48,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignContent: 'center',
                        flexDirection: 'row'
                    }}>
                        <TouchableOpacity style={{ paddingLeft: 17, width: 50 }}
                                          onPress={() => this.props.closeWindow()}>
                            <UIText value={'x'} style={{ color: color.gray_bbb, fontSize: 24 }}/>
                        </TouchableOpacity>
                        <UIText value={'请选择'}/>
                        <TouchableOpacity style={{ paddingRight: 17, width: 50 }}>
                            <UIText value={' '} style={{ color: color.gray_bbb, fontSize: 24 }}/>
                        </TouchableOpacity>
                    </View>
                    {this.renderMenu()}
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: 64 }}>
                        <Button
                            title='确定'
                            style={{ height: 43 }}
                            color={color.red}
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
        flex: 1
    }
});


