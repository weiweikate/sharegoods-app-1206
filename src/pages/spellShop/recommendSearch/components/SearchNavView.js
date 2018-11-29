import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import StringUtils from '../../../../utils/StringUtils';
import res from '../../../../comm/res';

const icon_header_back = res.button.icon_header_back;


export default class SearchNavView extends Component {

    static propTypes = {
        onSubmitEditing: PropTypes.func.isRequired,
        onFocus: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            onFocus: false
        };
    }

    _onChangeText = (text) => {
        this.setState({
            inputText: text
        });
    };

    onSubmitEditing = (text) => {
        this.setState({ onFocus: false }, () => {
            text = StringUtils.trim(text);
            //把输入框中的文字传给父组件
            if (this.props.onSubmitEditing) {
                this.props.onSubmitEditing(text);
            }
        });

    };

    _onFocus = () => {
        this.setState({ onFocus: true }, () => {
            this.props.onFocus && this.props.onFocus(true);
        });
    };

    _cancel = () => {
        this.setState({ onFocus: false }, () => {
            this.props.onFocus && this.props.onFocus(false);
        });
    };

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.contentView}>
                    {!this.state.onFocus && <TouchableOpacity onPress={() => {
                        this.props.navigation.goBack();
                    }} style={{ width: 48, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={icon_header_back}/>
                    </TouchableOpacity>}
                    <View style={styles.inputView}>
                        <TextInput style={{ marginLeft: 15, padding: 0 }}
                                   keyboardType='web-search'
                                   underlineColorAndroid='transparent'
                                   placeholder={'可通过搜索店铺/ID进行查找'}
                                   placeholderTextColor={DesignRule.textColor_hint}
                                   value={this.state.inputText}
                                   onChangeText={this._onChangeText}
                                   onSubmitEditing={(event) => this.onSubmitEditing(event.nativeEvent.text)}
                                   onFocus={this._onFocus}/>

                    </View>
                    {this.state.onFocus && <TouchableOpacity onPress={this._cancel}>
                        <Text style={{
                            paddingLeft: 10,
                            paddingRight: 15,
                            color: DesignRule.textColor_mainTitle
                        }}>取消</Text>
                    </TouchableOpacity>}
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
    inputView: {
        height: 30,
        borderRadius: 15,
        backgroundColor: DesignRule.bgColor,
        justifyContent: 'center',
        flex: 1,
        marginLeft: 15,
        marginRight: 10
    }
});

