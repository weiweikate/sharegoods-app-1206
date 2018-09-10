import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    TouchableOpacity
} from 'react-native';
import CommTabImag from '../../../../comm/res/CommTabImag';
import ScreenUtils from '../../../../utils/ScreenUtils';
import SearchInputModel from '../../model/SearchInputModel';


export default class SearchInput extends Component {
    searchModel = new SearchInputModel();

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <View style={[styles.container, { paddingTop: ScreenUtils.isIOS ? (ScreenUtils.isIOSX ? 44 : 20) : 20 }]}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.buttonNavigateBack()}>
                    <Image source={CommTabImag.comm_back_img} style={{
                        width: 10,
                        height: 18
                    }}/>
                </TouchableOpacity>
                <View style={styles.searchBox}>
                    <Image
                        style={{ marginLeft: 8, width: 12.5, height: 12.5 }}
                        // source={search_img}
                    />
                    <TextInput style={styles.inputText}
                        // keyboardType='web-search'
                        // underlineColorAndroid='transparent'
                        // placeholder={this.props.placeHolder}
                        // placeholderTextColor='#6C6F74'
                        // value={this.searchModel.inputText}
                        // onChangeText={(text) => this.onChangeText(text)}
                        // onChangeText={this.onChangeText(text)}
                        //        onSubmitEditing={(event) => this.onSubmitEditing(event.nativeEvent.text)}
                               ref={'textInput'}
                    />
                </View>
                <TouchableOpacity onPress={this.finish}>
                    <Text style={styles.text}>取消</Text>
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create(
    {
        //根布局
        container: {
            flexDirection: 'row',   // 水平排布
            paddingLeft: 16,
            // paddingRight: 16,

            backgroundColor: '#fff',
            alignItems: 'center' //元素垂直居中排布
        },

        searchBox: { //搜索框
            height: 32,
            flexDirection: 'row',   // 水平排布,输入文字后有X
            flex: 1,
            borderRadius: 4, //设置圆角边
            backgroundColor: '#F0F0F0',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 8,
            marginBottom: 6,
            marginLeft: 5
        },

        inputText: {
            flex: 1,
            height: 40,
            fontSize: 12,
            marginLeft: 12
        },

        text: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 5,
            marginBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            fontSize: 14,
            color: '#333333',
            backgroundColor: '#F0F0F0',
            borderRadius: 15
        },
        image: {
            width: 20,
            height: 20,
            marginRight: 3,
            alignItems: 'flex-end'
        }
    }
);
