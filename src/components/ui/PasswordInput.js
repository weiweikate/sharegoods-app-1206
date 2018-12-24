import React, {
    Component
} from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    InteractionManager
} from 'react-native';
import PropTypes from 'prop-types';
import DesignRule from '../../constants/DesignRule';
import {MRTextInput as TextInput}from './UIText';
/**
 * 交易密码框
 */
export default class PasswordInput extends Component {
    static propTypes = {
        style: PropTypes.style,
        inputItemStyle: PropTypes.style,
        iconStyle: PropTypes.style,
        // maxLength: TextInput.propTypes.maxLength.isRequired,
        onChange: PropTypes.func,
        onEnd: PropTypes.func,
        autoFocus: PropTypes.bool
    };

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
    }

    static defaultProps = {
        autoFocus: true,
        onChange: () => {
        },
        onEnd: () => {
        }
    };

    componentDidMount() {
        if (this.props.autoFocus) {
            InteractionManager.runAfterInteractions(() => {
                this._onPress();
            });
        }
    }

    render() {
        return (
            <TouchableHighlight
                onPress={this._onPress.bind(this)}
                activeOpacity={1}
                underlayColor='transparent'>
                <View style={[styles.container, this.props.style]}>
                    <TextInput
                        style={{ height: 45, zIndex: 99, position: 'absolute', width: 45 * 6, opacity: 0 }}
                        ref='textInput'
                        maxLength={this.props.maxLength}
                        autoFocus={false}
                        keyboardType="numeric"
                        onChangeText={
                            (text) => {
                                const newText = text.replace(/[^\d]+/, '');
                                this.setState({ text: newText });
                                this.props.onChange(newText);
                                if (newText.length === this.props.maxLength) {
                                    this.props.onEnd(newText);
                                }
                            }
                        }
                    />
                    {
                        this._getInputItem()
                    }
                </View>
            </TouchableHighlight>
        );

    }

    _getInputItem() {
        let inputItem = [];
        let { text } = this.state;
        let maxLen = parseInt(this.props.maxLength);
        for (let i = 0; i < maxLen; i++) {
            if (i === 0) {
                inputItem.push(
                    <View key={i} style={[styles.inputItem, this.props.inputItemStyle]}>
                        {i < text.length ? <View style={[styles.iconStyle, this.props.iconStyle]}/> : null}
                    </View>);
            }
            else {
                inputItem.push(
                    <View key={i}
                          style={[styles.inputItem, styles.inputItemBorderLeftWidth, this.props.inputItemStyle]}>
                        {i < text.length ?
                            <View style={[styles.iconStyle, this.props.iconStyle]}/> : null}
                    </View>);
            }
        }
        return inputItem;
    }

    _onPress() {
        if (this.refs.textInput) {
            this.refs.textInput.focus();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: '#ddd',
        backgroundColor: '#fff'
    },
    inputItem: {
        height: 50,
        width: 57,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputItemBorderLeftWidth: {
        borderLeftWidth: 0.5,
        borderColor: '#ddd'
    },
    iconStyle: {
        width: 10,
        height: 10,
        backgroundColor: DesignRule.textColor_instruction,
        borderRadius: 5
    }
});
