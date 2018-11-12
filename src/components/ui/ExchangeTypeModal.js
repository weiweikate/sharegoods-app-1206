import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    // Modal,
    NativeModules,
    TouchableOpacity
} from 'react-native';
import close from '../../pages/mine/res/userInfoImg/close.png';
import {
    UIText, UIImage
} from '../ui';
import DesignRule from 'DesignRule';

class ExchangeTypeModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            number: 1,
            list: this.props.detail,
            currentSelect: this.getSize()
        };
    }

    getSize = () => {
        this.updateView();
        let arr = new Array(this.props.detail.length);
        arr.fill(-1);
        return arr;
    };
    isSelectFinish = () => {
        for (let i = 0; i < this.state.list.length; i++) {
            if (this.state.currentSelect[i] == -1) {
                return false;
            }
        }
        return true;
    };

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
                visible={this.props.isShow}>
                <View style={styles.modalStyle}>
                    {this.renderContent()}
                </View>
            </Modal>
        );
    }

    renderList = () => {
        let arr = [];
        for (let i = 0; i < this.state.list.length; i++) {
            arr.push(
                <View style={{ paddingLeft: 5, paddingRight: 15 }}>
                    <UIText value={this.state.list[i].title}
                            style={{
                                color: DesignRule.textColor_secondTitle,
                                fontSize: 13,
                                marginTop: 15,
                                paddingLeft: 10
                            }}/>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        {this.renderItemList(i)}
                    </View>
                </View>
            );
        }
        return arr;
    };
    renderItemList = (index) => {
        let arr = [];
        for (let i = 0; i < this.state.list[index].arr.length; i++) {
            arr.push(
                <View style={this.state.currentSelect[index] == i ? styles.viewSelect : styles.viewUnselect}>
                    <UIText value={this.state.list[index].arr[i]}
                            style={this.state.currentSelect[index] == i ? styles.textSelect : styles.textUnselect}
                            onPress={() => {
                                let currentSelect = this.state.currentSelect;
                                currentSelect[index] = i;
                                this.setState({ currentSelect: currentSelect });
                            }}/>
                </View>
            );
        }
        return arr;
    };
    updateView = () => {
        this.setState({ list: this.props.detail });
        setTimeout(() => {
            this.updateView();
        }, 100);

    };

    renderContent() {
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                flexDirection: 'row'
            }}>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View
                        style={{ height: 53, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
                        <UIImage source={close} style={{ width: 23, height: 23, marginRight: 16 }}
                                 onPress={() => this.props.closeWindow()}/>
                    </View>
                    <View style={{
                        height: 1,
                        marginLeft: 15,
                        marginRight: 15,
                        backgroundColor: DesignRule.lineColor_inColorBg
                    }}/>
                    {this.renderList()}
                    <View style={{
                        height: 1,
                        backgroundColor: DesignRule.lineColor_inColorBg,
                        marginTop: 10,
                        marginBottom: 15
                    }}/>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        height: 60,
                        alignItems: 'center',
                        paddingLeft: 15,
                        paddingRight: 15
                    }}>
                        <UIText value={'换货数量'} style={{ fontSize: 13, color: DesignRule.textColor_secondTitle }}/>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.rectangle} onPress={() => {
                                this.reduce();
                            }}>
                                <UIText value={'-'} style={{ fontSize: 15, color: DesignRule.color_ddd }}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.rectangle, { width: 46, borderLeftWidth: 0, borderRightWidth: 0 }]}>
                                <UIText value={this.state.number}
                                        style={{ fontSize: 15, color: DesignRule.textColor_mainTitle }}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.rectangle} onPress={() => {
                                this.add();
                            }}>
                                <UIText value={'+'} style={{ fontSize: 15, color: DesignRule.textColor_mainTitle }}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={{
                        height: 49,
                        backgroundColor: DesignRule.mainColor,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} onPress={() => {

                    }}>
                        <UIText value={'确认'} style={{
                            color: 'white',
                            textAlign: 'center',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }} onPress={() => this.finish()}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    finish = () => {
        if (this.isSelectFinish()) {
            this.props.commit({ currentSelect: this.state.currentSelect, number: this.state.number });
        } else {
            NativeModules.commModule.toast('请勾选完全');
        }
    };
    add = () => {
        let number = this.state.number;
        this.setState({ number: number + 1 });
    };
    reduce = () => {
        let number = this.state.number;
        if (number > 1) {
            this.setState({ number: number - 1 });
        }
    };
}

const styles = StyleSheet.create({
    modalStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        flex: 1
    }, viewUnselect: {
        justifyContent: 'center',
        backgroundColor: DesignRule.lineColor_inColorBg,
        borderRadius: 5,
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 10
    }, textUnselect: {
        color: DesignRule.textColor_mainTitle, fontSize: 13
    }, viewSelect: {
        justifyContent: 'center',
        backgroundColor: DesignRule.mainColor,
        borderRadius: 5,
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 10
    }, textSelect: {
        color: 'white', fontSize: 13
    }, rectangle: {
        height: 30,
        width: 30,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: DesignRule.color_ddd,
        alignItems: 'center'
    }
});

export default ExchangeTypeModal;
