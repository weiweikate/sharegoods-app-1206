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
import BonusExchangeSucceedBackground from '../res/userInfoImg/BonusExchangeSucceedBackground.png';
import bonusClose from '../res/userInfoImg/bonusClose.png';
import UIImage from '../../../components/ui/UIImage';
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

    render() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
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
                    backgroundColor: color.red,
                    justifyContent: 'center',
                    borderRadius: 5
                }} onPress={() => this.props.yes()}>
                    <Text style={{ color: color.white, textAlign: 'center' }}>{this.props.detail.yes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: 110,
                    height: 35,
                    backgroundColor: color.gray_DDD,
                    justifyContent: 'center',
                    borderRadius: 5
                }} onPress={() => this.props.no()}>
                    <Text style={{ color: color.black_999, textAlign: 'center' }}>{this.props.detail.no}</Text>
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
                    backgroundColor: color.gray_DDD,
                    justifyContent: 'center',
                    borderRadius: 5
                }} onPress={() => this.props.no()}>
                    <Text style={{ color: color.black_999, textAlign: 'center' }}>{this.props.detail.no}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: 110,
                    height: 35,
                    backgroundColor: color.red,
                    justifyContent: 'center',
                    borderRadius: 5
                }} onPress={() => this.props.yes()}>
                    <Text style={{ color: color.white, textAlign: 'center' }}>{this.props.detail.yes}</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        flex: 1
    }, smallTextStyle: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 15,
        marginTop: 10,
        color: '#666666'
    }, titleTextStyle: {
        fontSize: 24, color: color.blue_222, marginTop: 10
    }, contentTextStyle: {
        fontSize: 15, color: color.blue_222, marginTop: 10
    }
});

