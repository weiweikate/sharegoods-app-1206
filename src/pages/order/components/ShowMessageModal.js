import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity, ImageBackground
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import Modal from 'CommModal';
import DesignRule from 'DesignRule';
import res from '../res';

const { message_bg } = res;

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
                <TouchableOpacity style={styles.modalStyle}
                                  activeOpacity={1}
                                  onPress={() => {
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
        let arrLen = nameArr.length;
        for (let i = 0; i < arrLen; i++) {
            itemArr.push(
                <View key={i}>
                    <TouchableOpacity key={i}
                                      style={{ height: 46, justifyContent: 'center', marginTop: 2 }}
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
                    {i === arrLen - 1 ? null : <View
                        style={{
                            backgroundColor: DesignRule.lineColor_inColorBg,
                            height: 1,
                            marginLeft: 48,
                            marginRight: 2
                        }}/>}
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
                paddingRight: 15,
                paddingTop: ScreenUtils.headerHeight
            }}>
                <ImageBackground style={{ width: 143, height: 93 }} source={message_bg} resizeMode={'stretch'}>
                    {this.renderMenu()}
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modalStyle: {
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
        flex: 1,
        width: ScreenUtils.width
    }
});

export default ShowMessageModal;
