import React, { Component } from 'react';
import CommModal from '../../comm/components/CommModal';
import {
    Image,
    ImageBackground,
    View,
    TouchableOpacity
} from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import res from './res';
import { MRText } from '../../components/ui';
import LinearGradient from "react-native-linear-gradient";

const {
    finsh_pay_alertbg,
    payClose
} = res;

const { px2dp } = ScreenUtils;

export default class FinshPayAlertView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: props.isShow
        };
    }

    render() {
        const {btnClick,isShow} = this.props;
        return (
            <CommModal
                onRequestClose={this._closeNumKeyBoard}
                ref={(ref) => {
                    this.modal = ref;
                }}
                visible={this.state.isShow && isShow}
                transparent={0.5}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ImageBackground style={{
                        width: ScreenUtils.width - px2dp(66),
                        height: px2dp(386)
                    }} source={finsh_pay_alertbg}>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                isShow: false
                            });
                        }}>
                            <Image style={{
                                marginLeft: ScreenUtils.width - px2dp(66) - px2dp(33),
                                marginTop: px2dp(10),
                                width: px2dp(21),
                                height: px2dp(21)
                            }}
                                   source={payClose}>
                            </Image>
                        </TouchableOpacity>
                            <View style={{
                                marginTop: px2dp(300),
                                width: ScreenUtils.width - px2dp(66),
                                height: px2dp(50),
                                // backgroundColor: 'red',
                                alignItems:'center',
                                justifyContent:'center'
                            }}>
                                <TouchableOpacity onPress={()=>{
                                    btnClick&&btnClick();
                                }}>
                                    <LinearGradient colors={['rgba(255, 0, 80, 1)', 'rgba(252, 93, 57, 1)']}
                                                    style={{width:px2dp(180),height:px2dp(40),alignItems:'center',justifyContent:'center',borderRadius:px2dp(20)}}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}>
                                        <MRText style={{color:'white',fontSize:px2dp(14)}}>
                                            去了解
                                        </MRText>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                    </ImageBackground>
                </View>
            </CommModal>
        );
    }
}
