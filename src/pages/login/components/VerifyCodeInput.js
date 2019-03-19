import React, { PureComponent } from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import lodash from 'lodash';
import PropTypes from 'prop-types';
import styles from '../style/VerifyCode.style';
import CustomNumKeyBoard from '../../../comm/components/CustomNumKeyBoard'


const propTypes = {
    onChangeText: PropTypes.func.isRequired, // 验证码实时变化值
    verifyCodeLength: PropTypes.number.isRequired, // 验证码数
    verifyCode: PropTypes.string,
    onTouchInput: PropTypes.func.isRequired,
    showKeyBoard: PropTypes.bool.isRequired
};

const defaultProps = {
    onChangeText: () => {
    },
    verifyCodeLength: 4 // 默认6位
};

// 验证码组件
class VerifyCode extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            verifyCode: '', // 验证码
            showKeyBoard: true
        };
        this.onTouchInput = this.onTouchInput.bind(this);
    }

    onTouchInput(flag) {
        const { onTouchInput } = this.props;
        onTouchInput && onTouchInput(flag);
        this.setState({
            showKeyBoard: !this.state.showKeyBoard
        })
    }

    renderVerifyCode(value) {
        const { verifyCodeLength } = this.props;
        const paddedValue = lodash.padEnd(value, verifyCodeLength, ' ');
        const valueArray = paddedValue.split('');
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={this.onTouchInput}
                style={styles.verifyTextContainer}
            >
                {valueArray.map((digit, index) => (
                    <View
                        key={index}
                        style={digit === ' ' ? styles.textInputItem : styles.textInputItemIn}
                    >
                        <Text style={styles.verifyText}>{digit}</Text>
                    </View>
                ))}
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.verifyContainer}>
                {this.renderVerifyCode(this.state.verifyCode)}
                <CustomNumKeyBoard
                    itemClick={
                        (text) => {
                            this._keyBoardKeyClick(text)
                        }
                    }
                    closeAction={() => {
                        this.setState({
                            showKeyBoard: false
                        })
                    }}
                    maxNumLength={4}
                    visible={this.state.showKeyBoard}
                    transparent={true}
                    isSaveCurrentInputState={false}
                />
            </View>
        );
    }

    _keyBoardKeyClick = (text) => {
        const { onChangeText, verifyCodeLength } = this.props;
        if (text !== '回退') {
            if (this.state.verifyCode.length >= verifyCodeLength) {
            } else {
                let currentVerifyCode = this.state.verifyCode;
                currentVerifyCode = currentVerifyCode + text;
                this.setState({
                    verifyCode: currentVerifyCode
                })
                if (currentVerifyCode.length === 4) {
                    this.setState({
                        showKeyBoard: false
                    }, () => {
                        onChangeText(currentVerifyCode);
                    })
                }
            }
        } else {
            this.setState({
                verifyCode: this.state.verifyCode.substr(0, this.state.verifyCode.length - 1)
            })
        }
    }
}

VerifyCode.propTypes = propTypes;
VerifyCode.defaultProps = defaultProps;

export default VerifyCode;
