/**
 * Created by zhoujianxin on 2019/5/8.
 * @Desc
 */

import React, {Component} from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,} from 'react-native';
import res from '../../pages/show/res';
import PreLoadImage from '../../components/ui/preLoadImage/PreLoadImage';
import ScreenUtils from '../../utils/ScreenUtils';

const autoSizeWidth = ScreenUtils.autoSizeWidth;

export default class ShowShareImage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {data} = this.props;
        if(data){
            let name = data.userName;
            let content = data.titleStr;
            let headerImg = data.headerImage;
            let goodsImg = data.imageUrlStr;
            console.log(JSON.stringify(data))
            return (
                <View style={styles.container}>
                    <Image style={styles.goodsImg}
                           source={{uri:goodsImg}}/>
                    <View style={{flexDirection:'row',width:autoSizeWidth(230),height:autoSizeWidth(30),alignItems:'center'}}>
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
                    <View style={{width:autoSizeWidth(230)}}>
                        <Text style={{fontSize:13,color:'#333333'}} numberOfLines={2}>{content}</Text>
                    </View>
                </View>
            );
        }

        return null;
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor:'white',
        // justifyContent: "center",
        alignItems: 'center',
        width: autoSizeWidth(250),
        height: autoSizeWidth(350),
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
        width: autoSizeWidth(230),
        height: autoSizeWidth(258),
        borderRadius:5,
        overflow: 'hidden',
    },
    headerImg:{

    },
    nameText:{

    },
    contentText:{

    }

});
