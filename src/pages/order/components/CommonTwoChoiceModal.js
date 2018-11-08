import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import BonusExchangeSucceedBackground from '../../mine/res/userInfoImg/BonusExchangeSucceedBackground.png';
import bonusClose from '../../mine/res/userInfoImg/bonusClose.png';
import { UIImage } from '../../../components/ui';
import Modal from 'CommModal';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
/*
* usage:
* renderModal = () => {
 return (
 <CommonTwoChoiceModal
 isShow={this.state.isShowModal}
 detail={{title:'是否兑换',context:'请确认是否兑换',no:'稍后再说',yes:'马上兑换'}}
 close={()=>{
 this.setState({isShowModal:false})
 }}
 yes={()=>{
 NativeModules.commModule.toast('马上兑换')
 }}
 no={()=>{
 this.setState({isShowModal:false})
 }}
 />
 )
 }
* */
export default class CommonTwoChoiceModal extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    onRequestClose = () => {

    };

    open = () => {
        this.modal && this.modal.open();
    };

    render() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                ref={ref => {
                    this.modal = ref;
                }}
                onRequestClose={() => this.onRequestClose()}
                visible={this.props.isShow}>
                <View style={styles.modalStyle}>
                    {this.renderContent()}
                </View>
            </Modal>
        );
    }

    renderButton = () => {
        return (this.props.isConfirmButtonLeft ?
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 25,
                marginLeft: 25,
                marginRight: 25
            }}>
                <TouchableOpacity style={{
                    width: 110,
                    height: 35,
                    backgroundColor: DesignRule.mainColor,
                    justifyContent: 'center',
                    borderRadius: 5
                }} onPress={() => this.props.yes()}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>{this.props.detail.yes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: 110,
                    height: 35,
                    backgroundColor: DesignRule.lineColor_inColorBg,
                    justifyContent: 'center',
                    borderRadius: 5
                }} onPress={() => this.props.no()}>
                    <Text style={{
                        color: DesignRule.textColor_instruction,
                        textAlign: 'center'
                    }}>{this.props.detail.no}</Text>
                </TouchableOpacity>
            </View> :
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 25,
                marginLeft: 25,
                marginRight: 25
            }}>
                <TouchableOpacity style={{
                    width: 110,
                    height: 35,
                    backgroundColor: DesignRule.lineColor_inColorBg,
                    justifyContent: 'center',
                    borderRadius: 5
                }} onPress={() => this.props.no()}>
                    <Text style={{
                        color: DesignRule.textColor_instruction,
                        textAlign: 'center'
                    }}>{this.props.detail.no}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: 110,
                    height: 35,
                    backgroundColor: DesignRule.mainColor,
                    justifyContent: 'center',
                    borderRadius: 5
                }} onPress={() => this.props.yes()}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>{this.props.detail.yes}</Text>
                </TouchableOpacity>
            </View>);
    };

    renderContent() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                    <Image source={this.props.backgroundImg ? this.props.backgroundImg : BonusExchangeSucceedBackground}
                           style={{ position: 'absolute' }}/>
                    <View style={{
                        height: 272,
                        width: 295,
                        position: 'absolute',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-end'
                    }}>
                        <UIImage source={bonusClose} style={{ width: 32, height: 32, marginTop: 43 }}
                                 onPress={() => this.props.closeWindow()}/>
                    </View>
                    <View style={{ height: 272, width: 295, justifyContent: 'space-between' }}>
                        <View style={{
                            flex: 1,
                            alignContent: 'center',
                            alignItems: 'center',
                            marginTop: 100,
                            paddingLeft: 26,
                            paddingRight: 26
                        }}>
                            <Text
                                style={this.props.useSmallTextStyle ? styles.smallTextStyle : styles.titleTextStyle}>{this.props.detail.title}</Text>
                            <Text
                                style={this.props.useSmallTextStyle ? styles.smallTextStyle : styles.contentTextStyle}>{this.props.detail.context}</Text>
                        </View>
                        {this.renderButton()}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modalStyle: {
        justifyContent: 'flex-end',
        flex: 1,
        width: ScreenUtils.width
    }, smallTextStyle: {
        fontSize: 15,
        marginTop: 10,
        color: DesignRule.textColor_secondTitle
    }, titleTextStyle: {
        fontSize: 24, color: DesignRule.textColor_mainTitle, marginTop: 10
    }, contentTextStyle: {
        fontSize: 15, color: DesignRule.textColor_mainTitle, marginTop: 10
    }
});

