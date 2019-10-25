/**
 * @author zhoujianxin
 * @date on 2019/10/25.
 * @desc 面对面扫码
 * @org  www.sharegoodsmall.com
 * @email zhoujianxin@meeruu.com
 */

import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import bridge from '../../../../utils/bridge';
import res from '../../../../comm/res';
import PreLoadImage from '../../../../components/ui/preLoadImage/PreLoadImage';
import mineRes from '../../res';

const groupIcon = mineRes.groupIcon;

export default class FaceToFaceQRcode extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            path:'',
            error:''
        };
    }

    $navigationBarOptions = {
        title: '面对面扫码',
        show: true
    };

    componentDidMount() {
        const {data} = this.params;
        //生成二维码图片路径
        bridge.creatQRCodeImage(data.QRCodeStr,(path)=>{
            this.setState({
                path: Platform.OS === 'android' ? 'file://' + path : '' + path,
                error:''
            })
        },(err)=>{
            console.log(err)
            this.setState({
                path:'',
                error:err
            })
        },()=>{},'FaceToFaceQRcode')
    }

    _render() {
        // const {data} = this.params;
            return (
            <View style={styles.container}>
                <LinearGradient style={{}}
                                start={{x: 0, y: 1}}
                                end={{x: 0.89, y: 0}}
                                colors={['#D3001C', '#FFC100']}
                >
                    <View style={{flex:1,alignItems:'center'}}>
                        <View style={{width: ScreenUtils.width, height: ScreenUtils.height, alignItems: 'center'}}>
                            <Image source={groupIcon.QRcodeHeader} style={{width: ScreenUtils.width, height: 185}}/>
                            <View style={styles.imgBgStyle}>
                                <View style={styles.QRCodeViewStyle}>
                                    {this.state.path !== '' ?
                                        <PreLoadImage
                                            imageUri={this.state.path}
                                            style={{width: 240, height: 240}}
                                            defaultImage={res.placeholder.avatar_default}
                                            errImage={res.placeholder.avatar_default}
                                        /> : <ActivityIndicator
                                            color="#aaaaaa"
                                            style={{width: 10, height: 10,}}/>
                                    }
                                </View>
                            </View>
                            <Text style={{marginTop: 10, fontSize: 14, color: 'white', position: 'absolute', top: 450}}>
                                用手机微信扫一扫二维码，参加我的拼团
                            </Text>
                        </View>

                    </View>
                </LinearGradient>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex'
    },
    imgBgStyle:{
        position: 'absolute',
        top: 135,
        width: 290,
        alignItems: 'center',
        height: 295,
        marginHorizontal: (ScreenUtils.width-290)/2,
        backgroundColor:'white',
        borderRadius: 10
    },
    QRCodeViewStyle:{
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
