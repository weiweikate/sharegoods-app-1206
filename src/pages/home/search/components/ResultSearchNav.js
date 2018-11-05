import React, { Component } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import navBack from '../../../../components/pageDecorator/NavigatorBar/source/icon_header_back.png';
import verticalRow from '../res/verticalRow.png';
import horizontalRow from '../res/horizontalRow.png';

export default class ResultSearchNav extends Component {

    constructor(props) {
        super(props);
        this.state = { inputText: props.defaultValue || '' };
    }

    onChangeText = (text) => {
        this.setState({
            inputText: text
        }, () => {
            this.props.onChangeText(text);
        });
    };

    changeText = (text) => {
        this.setState({
            inputText: text
        });
    };

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.contentView}>
                    <TouchableOpacity style={styles.navBackBtn} onPress={this.props.goBack}>
                        <Image source={navBack}/>
                    </TouchableOpacity>
                    <View style={styles.inputView}>
                        <TextInput style={{ marginLeft: 24, padding: 0, color: '#212121' }}
                                   keyboardType='web-search'
                                   underlineColorAndroid='transparent'
                                   placeholder={'请输入关键词搜索'}
                                   placeholderTextColor='#C8C8C8'
                                   value={this.state.inputText}
                                   onChangeText={this.onChangeText}
                                   onSubmitEditing={this.props.onSubmitEditing}
                                   onFocus={this.props.onFocus}
                        />
                    </View>
                    <TouchableOpacity style={styles.styleTypeBtn} onPress={this.props.changeLayout}>
                        <Image source={this.props.isHorizontal ? horizontalRow : verticalRow}/>
                    </TouchableOpacity>
                </View>
            </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        height: ScreenUtils.headerHeight,
        width: ScreenUtils.width,
        backgroundColor: 'white'
    },
    contentView: {
        marginTop: ScreenUtils.statusBarHeight,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },

    navBackBtn: {
        alignItems: 'center',
        width: 42
    },
    styleTypeBtn: {
        alignItems: 'center',
        width: 58
    },

    inputView: {
        height: 30,
        borderRadius: 15,
        backgroundColor: '#F7F7F7',
        justifyContent: 'center',
        flex: 1,
        marginRight: 10
    }


});

