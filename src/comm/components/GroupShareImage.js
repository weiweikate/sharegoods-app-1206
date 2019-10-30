/**
 * @author zhoujianxin
 * @date on 2019/9/6
 * @desc 拼团海报页面
 * @org  www.sharegoodsmall.com
 * @email zhoujianxin@meeruu.com
 */

import React, {Component} from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Platform
} from 'react-native';
import res from '../../comm/res';
import mineRes from '../../pages/mine/res';

import PreLoadImage from '../../components/ui/preLoadImage/PreLoadImage';
// import ScreenUtils from '../../utils/ScreenUtils';
import LinearGradient from 'react-native-linear-gradient';
import bridge from '../../utils/bridge';
import user from '../../model/user';

const groupIcon = mineRes.groupIcon;
export default class GroupShareImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            path:'',
            error:''
        };
    }

    componentDidMount() {
        const {data} = this.props;
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
        },()=>{},'GroupShareImage');
    }

    render() {
        const {data, download} = this.props;
        if(data){
            let headerImg = user.headImg;

            return (
                <View style={styles.container}>
                    <LinearGradient style={{borderRadius: 10}}
                                    start={{x: 0, y: 1}}
                                    end={{x: 0.89, y: 0}}
                                    colors={['#D3001C', '#FFC100']}
                    >
                        <TouchableWithoutFeedback>
                            <View style={{width: 320, height: 480, alignItems: 'center'}}>
                                <Image source={groupIcon.group_header} style={{width: '100%', height: 172}}/>

                                <ImageBackground style={styles.imgBgStyle}
                                                 resizeMode={'contain'}
                                                 source={groupIcon.group_bg}
                                >
                                    <View style={styles.goodsInfo}>
                                        <View style={{flexDirection: 'row', justifyContent: 'center',}}>
                                            {data.imageUrlStr ?
                                                <Image
                                                    source={{uri:data.imageUrlStr}}
                                                    style={styles.goodsImg}/>
                                                :
                                                <View style={[styles.goodsImg,{backgroundColor:'#f5f5f5'}]}/>
                                            }
                                            <View style={{flex: 1, marginHorizontal: 7}}>
                                                <View>
                                                    <Text numberOfLines={1} style={{fontSize: 14, color: '#333333'}}>
                                                        {data.titleStr ? data.titleStr : '秀一秀，赚到够'}
                                                    </Text>
                                                </View>

                                                <View style={{flexDirection: 'row'}}>
                                                    <View style={styles.tagStyle}>
                                                        <Text style={{
                                                            color: '#FF0050',
                                                            fontSize: 10,
                                                            margin: 2,
                                                        }}>拼团</Text>

                                                    </View></View>
                                                <View style={{flex:1}}/>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <Text style={{color: '#FF0050', fontSize: 17}}>
                                                        ¥{data.priceStr ? data.priceStr : '0.0'}
                                                    </Text>
                                                    <Text style={{color: '#999999', fontSize: 11, marginLeft: 5, textDecorationLine: 'line-through'}}>
                                                        ¥{data.originalPrice ? data.originalPrice : '0.0'}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.QRCodeViewStyle}>
                                        <PreLoadImage
                                            imageUri={this.state.path}
                                            style={{width: 70, height: 70}}
                                            defaultImage={res.placeholder.avatar_default}
                                            errImage={res.placeholder.avatar_default}
                                        />
                                        <Text style={{width:98, marginTop:10, fontSize:14, color:'#333333', textAlign:'center'}}>
                                            长按识别二维码立即参团
                                        </Text>
                                    </View>
                                </ImageBackground>

                                <View style={{position: 'absolute', top: 113}}>
                                    <PreLoadImage
                                        imageUri={headerImg}
                                        style={styles.headerImg}
                                        defaultImage={res.placeholder.noHeadImage}
                                        errImage={res.placeholder.noHeadImage}
                                    />

                                </View>

                            </View>
                        </TouchableWithoutFeedback>

                    </LinearGradient>
                    <TouchableOpacity activeOpacity={0.8} onPress={()=>{
                        //下载图片到本地
                        download && download()
                    }}>
                        <ImageBackground style={styles.btnImagStyle} source={groupIcon.group_btn}>
                            <Text style={{fontSize:16, color:'#C73908',marginBottom:8}}>保存图片分享</Text>
                        </ImageBackground>
                    </TouchableOpacity>

                </View>
            );
        }

        return null;
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex'
    },
    absolute: {
        position: 'absolute',
        flex: 1,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    headerImg:{
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    goodsInfo:{
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingTop: 18
    },
    goodsImg:{
        width:80,
        height:80,
        borderRadius:5,
        overflow: 'hidden',
    },
    imgBgStyle:{
        position: 'absolute',
        top: 135,
        flex: 1,
        width: '100%',
        alignItems: 'center',
        height: 335,
    },
    tagStyle:{
        backgroundColor: 'rgba(255,0,80,0.1)',
        borderRadius: 2,
        marginTop: 6,
    },
    QRCodeViewStyle:{
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingBottom: 18
    },
    btnImagStyle:{
        width:260,
        height:48,
        alignItems:'center',
        justifyContent:'center',
        marginTop: 25
    }


});
