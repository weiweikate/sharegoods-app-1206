import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    InteractionManager,
    ViewPropTypes
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
const {px2dp} = ScreenUtils;
import {MRTextInput as TextInput} from '../../../components/ui'
export default class PasswordInput extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        inputItemStyle: ViewPropTypes.style,
        iconStyle: ViewPropTypes.style,
        // maxLength: TextInput.propTypes.maxLength.isRequired,
        onChange: PropTypes.func,
        onEnd: PropTypes.func,
        autoFocus: PropTypes.bool
    };

    static defaultProps = {
        autoFocus: false,
        onChange: () => {
        },
        onEnd: () => {
        },
        onTextFocus: () => {

        },
        onTextBlur: () => {

        }
    };

    state = {
        text: ''
    };

    clear() {
        this.setState({
            text: ''
        });
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            InteractionManager.runAfterInteractions(() => {
                this._onPress();
            });
        }
    }

    render() {
        return (
            <View
                onPress={this._onPress.bind(this)}
                activeOpacity={1}
                underlayColor='transparent'>
                <View style={[styles.container, this.props.style]}>
                    <TextInput
                        style={{
                            height: px2dp(57),
                            zIndex: 99,
                            position: 'absolute',
                            width: 45 * this.props.maxLength,
                            opacity: 0
                        }}
                        ref='textInput'
                        maxLength={this.props.maxLength}
                        autoFocus={this.props.autoFocus}
                        value={this.state.text}
                        keyboardType="numeric"
                        onChangeText={
                            (text) => {
                                this.setState({ text });
                                this.props.onChange(text);
                                if (text.length === this.props.maxLength) {
                                    this.props.onEnd(text);
                                }
                            }
                        }
                        onFocus={() => this.props.onTextFocus()}
                        onBlur={() => this.props.onTextBlur()}
                    />
                    {
                        this._getInputItem()
                    }
                </View>
            </View>
        );

    }

    _clearTextInputContent = () => {
        this.setState({
            text: ''
        });
    };

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
        borderWidth: ScreenUtils.isIOS ? 1.0 : 0.5,
        borderColor: '#ccc',
        backgroundColor: '#fff'
    },
    inputItem: {
        height: px2dp(57),
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputItemBorderLeftWidth: {
        borderLeftWidth: ScreenUtils.isIOS ? 1.0 : 0.5,
        borderColor: DesignRule.lineColor_inGrayBg
    },
    iconStyle: {
        width: px2dp(14),
        height: px2dp(14),
        backgroundColor: DesignRule.textColor_mainTitle,
        borderRadius: px2dp(7)
    }
});
