import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableOpacity
} from 'react-native';
import { color } from '../../constants/Theme';
import circleSelect from '../../comm/res/selected_circle_red.png';
import circleUnselect from '../../comm/res/unselected_circle.png';
import {
    UIText, UIImage
} from './../ui';

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
                    <View style={{ backgroundColor: color.gray_EEE, height: 1 }}/>
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
                <View style={{ flex: 1, backgroundColor: color.white, justifyContent: 'center' }}>
                    <View style={{
                        flexDirection: 'row',
                        height: 40,
                        backgroundColor: color.gray_EEE,
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}>
                        <UIText value={'取消'} style={{ color: color.black_999, fontSize: 15, marginRight: 16 }}
                                onPress={() => {
                                    this.props.closeWindow();
                                }}/>
                    </View>
                    <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => {
                        this.props.takePhoto();
                    }}>
                        <UIText style={styles.textStyle} value={'拍照'}/>
                    </TouchableOpacity>
                    <View style={{ height: 1, backgroundColor: color.line }}/>
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
        backgroundColor: color.page_background,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        alignContent: 'center'
    }, textStyle: {
        justifyContent: 'center', textAlign: 'center', alignItems: 'center', alignContent: 'center', color: color.black
    }
});

export default TakePhotoModal;
