import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableOpacity
} from 'react-native';
import UIText from '../../../components/ui/UIText';
import UIImage from '../../../components/ui/UIImage';
import res from '../res';
import DesignRule from 'DesignRule';

const circleSelect = res.button.selected_circle_red;
const circleUnselect = res.button.unselected_circle;

class TakePhotoModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentSelect: 0
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
                <View>
                    <TouchableOpacity key={i} style={{
                        height: 48,
                        justifyContent: 'center',
                        backgroundColor: this.state.currentSelect === i ? DesignRule.bgColor : 'white'
                    }} onPress={() => {
                        this.setState({ currentSelect: i });
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ marginLeft: 21 }}>{nameArr[i]}</Text>
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

    renderContent() {
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                flexDirection: 'row'
            }}>
                <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
                    <View style={{
                        flexDirection: 'row',
                        height: 40,
                        backgroundColor: DesignRule.lineColor_inColorBg,
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}>
                        <UIText value={'取消'} style={{ color: DesignRule.textColor_instruction, fontSize: 15, marginRight: 16 }}
                                onPress={() => {
                                    this.props.closeWindow();
                                }}/>
                    </View>
                    <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => {
                        this.props.takePhoto();
                    }}>
                        <UIText style={styles.textStyle} value={'拍照'}/>
                    </TouchableOpacity>
                    <View style={{ height: 1, backgroundColor: DesignRule.lineColor_inColorBg }}/>
                    <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => {
                        this.props.selectPhoto();
                    }}>
                        <UIText style={styles.textStyle} value={'相册'}/>
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
        flex: 1
    }, TouchableOpacityStyle: {
        height: 60,
        backgroundColor: DesignRule.bgColor,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        alignContent: 'center'
    }, textStyle: {
        justifyContent: 'center', textAlign: 'center', alignItems: 'center', alignContent: 'center', color: DesignRule.textColor_mainTitle
    }
});

export default TakePhotoModal;
