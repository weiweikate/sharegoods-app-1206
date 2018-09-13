import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Modal,
    TouchableOpacity
} from 'react-native';
import { color } from '../../../constants/Theme';
import ScreenUtils from '../../../utils/ScreenUtils';

class ShowMessageModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dis: true
        };
    }

    render() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                onRequestClose={() => {
                }}
                visible={this.props.isShow && this.state.dis}>
                <TouchableOpacity style={styles.modalStyle} onPress={() => {
                    this.props.closeWindow();
                }}>
                    {this.renderContent()}
                </TouchableOpacity>
            </Modal>
        );
    }

    renderMenu = () => {
        let nameArr = this.props.detail;
        let itemArr = [];
        for (let i = 0; i < nameArr.length; i++) {
            itemArr.push(
                <View key={i}>
                    <TouchableOpacity key={i}
                                      style={{ height: 48, justifyContent: 'center', backgroundColor: color.white }}
                                      onPress={() => {
                                          this.props.clickSelect(i);
                                      }}>
                        <View style={{ flexDirection: 'row', height: 40, alignItems: 'center', paddingLeft: 17 }}>
                            <Image source={this.props.detail[i].icon} style={{ height: 18, width: 18 }}/>
                            <Text style={{
                                marginLeft: 16,
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 13,
                                color: '#000000'
                            }}>{this.props.detail[i].title}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: color.gray_EEE, height: 1, marginLeft: 50 }}/>
                </View>
            );
        }
        return itemArr;
    };

    renderContent() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                paddingRight: 35,
                paddingTop: ScreenUtils.headerHeight
            }}>
                <View style={{ backgroundColor: color.white, width: 143 }}>
                    {this.renderMenu()}
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

export default ShowMessageModal;
