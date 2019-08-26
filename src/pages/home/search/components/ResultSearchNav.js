import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import StringUtils from '../../../../utils/StringUtils';
import { MRTextInputWithCancel } from '../../../../components/ui/UIText';

const {
    button: {
        icon_header_back: navBack
    },
    search: {
        verticalRow,
        horizontalRow
    }
} = res;


export default class ResultSearchNav extends Component {

    constructor(props) {
        super(props);
        this.state = { inputText: props.defaultValue || '' };
    }

    onChangeText = (text) => {
        if (text.length > 60) {
            text = text.substring(0, 60);
        }
        this.setState({
            inputText: text
        }, () => {
            text = StringUtils.trim(text);
            this.props.onChangeText(text);
        });
    };

    onSubmitEditing = (text) => {
        text = StringUtils.trim(text);
        //把输入框中的文字传给父组件
        if (this.props.onSubmitEditing) {
            this.props.onSubmitEditing(text);
        }
    };

    //点击key列表赋值
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
                        <Image source={navBack} style={{ width: 30, height: 30 }}/>
                    </TouchableOpacity>
                    <View style={styles.inputView}>
                        <MRTextInputWithCancel style={{ paddingHorizontal: 16 }}
                                               keyboardType='web-search'
                                               placeholder={'请输入关键词搜索'}
                                               placeholderTextColor={DesignRule.textColor_hint}
                                               value={this.state.inputText}
                                               onChangeText={this.onChangeText}
                                               onSubmitEditing={(event) => this.onSubmitEditing(event.nativeEvent.text)}
                                               onFocus={this.props.onFocus}
                        />
                    </View>
                    <TouchableOpacity style={styles.styleTypeBtn} onPress={this.props.changeLayout}>
                        <Image source={this.props.isHorizontal ? horizontalRow : verticalRow}
                               style={{ width: 23, height: 23 }}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.lineView}/>
            </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        height: ScreenUtils.headerHeight,
        width: ScreenUtils.width,
        backgroundColor: 'white'
    },
    lineView: {
        height: 0.5, backgroundColor: DesignRule.lineColor_inWhiteBg
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
        backgroundColor: DesignRule.bgColor,
        justifyContent: 'center',
        flex: 1,
        marginRight: 10
    }


});

