import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

    static propTypes = {
        value: PropTypes.string,
        placeholder: PropTypes.string,
        onSubmitEditing: PropTypes.func.isRequired,
        goBack: PropTypes.func.isRequired,
        changeLayout: PropTypes.func.isRequired,
        isHorizontal: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || '',
        };
    }


    _onChangeText = (text) => {
        if (text !== '') {
            this.setState({
                isShowInputClear: true,
                inputText: text
            });
        } else {
            this.setState({
                isShowInputClear: false,
                inputText: text
            });
        }

        if (this.props.onChangeText) {
            this.props.onChangeText(text);
        }
    };

    _onSubmitEditing = (text) => {
        if (this.props.onSubmitEditing) {
            this.props.onSubmitEditing(text);
        }
    };

    _selectedIndex = () => {
        if (this.props.changeLayout) {
            this.props.changeLayout();
        }
    };

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.contentView}>
                    <TouchableOpacity style={styles.navBackBtn} onPress={this.props.goBack}>
                        <Image source={navBack}/>
                    </TouchableOpacity>
                    <View style={styles.inputView}>
                        <TextInput style={{ marginLeft: 24 }}
                                   keyboardType='web-search'
                                   underlineColorAndroid='transparent'
                                   placeholder={this.props.placeholder}
                                   placeholderTextColor='#C8C8C8'
                                   value={this.state.value}
                                   onChangeText={(text) => this._onChangeText(text)}
                                   onSubmitEditing={(event) => this._onSubmitEditing(event.nativeEvent.text)}/>
                    </View>
                    <TouchableOpacity style={styles.styleTypeBtn} onPress={this._selectedIndex}>
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

