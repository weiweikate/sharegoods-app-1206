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


export default class ShowShareImage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {data} = this.props;
        if(data){
            let name = data.titleStr;
            let content = data.titleStr;
            let headerImg = data.imageUrlStr;
            let goodsImg = data.imageUrlStr;

            return (
                <View style={styles.container}>
                    <Image style={{marginTop:10,marginLeft:5,width:230,height:258,borderRadius:5,overflow: 'hidden',}}
                           source={{uri:goodsImg}}/>
                    <View style={{flexDirection:'row',width:230,height:30,alignItems:'center',marginBottom:5,marginTop:5}}>
                        <Image style={{backgroundColor:'red',width:20,height:20,borderRadius:10,overflow: 'hidden',}}
                               source={{uri:headerImg}}/>
                        <Text style={{marginLeft:5,fontSize:13}}>{name ?
                            (name.length > 13 ? name.substr(0, 13) + "..." : name) : ""
                        }</Text>
                    </View>
                    <View style={{width:230}}>
                        <Text style={{fontSize:13}} numberOfLines={2}>{content}就仨贷款卡了解了解阿萨德机器哦电脑就恼羞成怒今年世界看见阿森纳大家安静的擦加快农村</Text>
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
        alignItems: "center",
        width: 250,
        height: 350,
    },
    absolute: {
        position: "absolute",
        flex: 1,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    whiteBg:{

    },
    goodsImg:{

    },
    headerImg:{

    },
    nameText:{

    },
    contentText:{

    }

});
