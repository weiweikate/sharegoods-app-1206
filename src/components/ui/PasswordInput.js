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
            text: '',
            borderColor: null,
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

    changeRedBorderColor = () => {
        this.setState({borderColor: DesignRule.mainColor, text: ''})
        this.refs.textInput && this.refs.textInput.clear()

    }

    clean = () => {
        this.setState({text: ''});
    }

    render() {
        return (
            <TouchableHighlight
                onPress={this._onPress.bind(this)}
                activeOpacity={1}
                underlayColor='transparent'>
                <View style={this.props.style}>
                <View style={[styles.container, {borderColor: this.state.borderColor}]}>
                    {
                        this._getInputItem()
                    }
                    <TextInput
                        style={{ top: 0, zIndex: 99, position: 'absolute', bottom: 0, left: 0, right: 0, opacity: 0 }}
                        ref='textInput'
                        maxLength={this.props.maxLength}
                        autoFocus={true}
                        caretHidden={true}
                        keyboardType="numeric"
                        value={this.state.text}
                        contextMenuHidden={true}
                        selectionColor={'transparent'}
                        onChangeText={
                            (text) => {
                                let newText = text.replace(/[^\d]+/, '');
                                if (this.state.text.length - newText.length > 1){
                                    newText = this.state.text.slice(0, -1);
                                }
                                this.setState({ text: newText ,borderColor: null});
                                this.props.onChange(newText);
                                if (newText.length === this.props.maxLength) {
                                    this.props.onEnd(newText);
                                }
                            }
                        }
                    />
                </View>
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
                    <View key={i} style={[styles.inputItem,styles.inputItemBorderLeftWidth, this.props.inputItemStyle]}>
                        {i < text.length ? <View style={[styles.iconStyle, this.props.iconStyle]}/> : null}
                    </View>);
            }
            else {
                inputItem.push(
                    <View key={i}
                          style={[styles.inputItem, styles.inputItemBorderLeftWidth, this.props.inputItemStyle, {borderColor: this.state.borderColor}]}>
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
        flexDirection: 'row',
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    },
    inputItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
