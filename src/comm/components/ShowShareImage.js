/**
 * Created by zhoujianxin on 2019/5/8.
 * @Desc
 */

import React, {Component} from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback} from 'react-native';
import res from '../../comm/res';
import PreLoadImage from '../../components/ui/preLoadImage/PreLoadImage';
import ScreenUtils from '../../utils/ScreenUtils';
import {MRText} from '../../components/ui';

const autoSizeWidth = ScreenUtils.autoSizeWidth;

export default class ShowShareImage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {data, modal} = this.props;
        if(data){
            let name = data.userName;
            let content = data.titleStr;
            let headerImg = data.headerImage;
            let goodsImg = data.imageUrlStr;
            console.log(JSON.stringify(data))
            let scale = ScreenUtils.height/ScreenUtils.width
            this.imageHeight = autoSizeWidth((200)*scale);
            this.imageWidth = autoSizeWidth(ScreenUtils.width-60);
            return (
                <View style={styles.container}>
                    <Image style={[styles.goodsImg,{width:autoSizeWidth(this.imageWidth-20),height:autoSizeWidth(this.imageHeight)}]}
                           source={{uri:goodsImg}}/>
                    <View style={{flexDirection:'row',width:autoSizeWidth(this.imageWidth-20),height:autoSizeWidth(30),alignItems:'center'}}>
                        <PreLoadImage
                            imageUri={headerImg}
                            style={{
                                width: autoSizeWidth(20),
                                height: autoSizeWidth(20),
                                borderRadius: 10
                            }}
                            defaultImage={res.placeholder.noHeadImage}
                            errImage={res.placeholder.noHeadImage}
                        />

                        <Text style={{marginLeft:5,fontSize:15, color:'#333333'}}>{name ?
                            (name.length > 13 ? name.substr(0, 13) + '...' : name) : ''
                        }</Text>
                    </View>
                    <View style={{width: autoSizeWidth(this.imageWidth-20)}}>
                        {ScreenUtils.isIOS ?
                            <Text style={{fontSize: 13, color: '#333333'}}
                                  numberOfLines={2}>
                                {content}
                            </Text> :
                            <MRText style={{fontSize: 13, color: '#333333'}}
                                    numberOfLines={2}>
                                {content}
                            </MRText>
                        }
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{modal&&modal.close()}}>
                    <Image style={styles.closeImgStyle}
                           source={res.share.close_black}/>
                    </TouchableWithoutFeedback>
                </View>
            );
        }

        return null;
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor:'white',
        justifyContent: "center",
        alignItems: 'center',
        // width: autoSizeWidth(250),
        // height: autoSizeWidth(350),
        flex:1
    },
    absolute: {
        position: 'absolute',
        flex: 1,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    whiteBg:{

    },
    goodsImg:{
        marginTop:10,
        borderRadius:5,
        overflow: 'hidden',
    },
    closeImgStyle:{
        position: 'absolute',
        top: 10,
        right:10,
        width: autoSizeWidth(18),
        height: autoSizeWidth(18),

    },
    nameText:{

    },
    contentText:{

    }

});
