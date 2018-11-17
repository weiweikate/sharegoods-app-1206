import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    // Modal,
    TouchableOpacity
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import Modal from 'CommModal';
import DesignRule from 'DesignRule';

class ShowMessageModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dis: true
        };
    }

    open = () => {
        this.modal && this.modal.open();
    };

    render() {
        return (
            <Modal
                transparent={true}
                onRequestClose={() => {
                }}
                ref={(ref) => {
                    this.modal = ref;
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
                                      style={{ height: 48, justifyContent: 'center', backgroundColor: 'white' }}
                                      onPress={() => {
                                          this.props.clickSelect(i);
                                      }}>
                        <View style={{ flexDirection: 'row', height: 40, alignItems: 'center', paddingLeft: 17 }}>
                            <Image source={this.props.detail[i].icon} style={{ height: 18, width: 18 }}/>
                            <Text style={{
                                marginLeft: 16,
                                fontSize: 13,
                                color: DesignRule.textColor_mainTitle
                            }}>{this.props.detail[i].title}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: DesignRule.lineColor_inColorBg, height: 1, marginLeft: 50 }}/>
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
                paddingRight: 20,
                paddingTop: ScreenUtils.headerHeight
            }}>
                <View style={{ backgroundColor: 'white', width: 143 }}>
                    {this.renderMenu()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modalStyle: {
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'flex-end',
        flex: 1,
        width:ScreenUtils.width
    }
});

export default ShowMessageModal;
