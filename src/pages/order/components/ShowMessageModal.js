import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity, ImageBackground
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import Modal from '../../../comm/components/CommModal';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import {
    MRText as Text
} from '../../../components/ui';

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
                                      style={{
                                          flexDirection: 'row',
                                          height: 40,
                                          alignItems: 'center',
                                          paddingLeft: 20
                                      }}
                                      onPress={() => {
                                          this.props.clickSelect(i);
                                      }}>
                        <Image source={this.props.detail[i].icon} style={{ height: 18, width: 18 }}/>
                        <Text style={{
                            marginLeft: 12,
                            fontSize: 13,
                            color: DesignRule.textColor_mainTitle
                        }} allowFontScaling={false}>{this.props.detail[i].title}</Text>
                    </TouchableOpacity>
                    {i === arrLen - 1 ? null : <View
                        style={{
                            backgroundColor: DesignRule.lineColor_inColorBg,
                            height: 1,
                            marginLeft: 48,
                            marginRight: 5
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
                paddingRight: 8,
                paddingTop: ScreenUtils.headerHeight - 3
            }}>
                <ImageBackground style={{ width: 143, height: 93, paddingTop: 9 }} source={message_bg}
                                 resizeMode={'stretch'}>
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
