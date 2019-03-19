import React, { PureComponent } from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import lodash from 'lodash';
import PropTypes from 'prop-types';
import styles from '../style/VerifyCode.style';

const propTypes = {
    onChangeText: PropTypes.func.isRequired, // 验证码实时变化值
    verifyCodeLength: PropTypes.number.isRequired, // 验证码数
    verifyCode: PropTypes.string,
    onTouchInput: PropTypes.func.isRequired
};

const defaultProps = {
    onChangeText: () => {
    },
    verifyCodeLength: 6 // 默认6位
};

// 验证码组件
class VerifyCode extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            verifyCode: props.verifyCode || '' // 验证码
        };
        this.onTouchInput = this.onTouchInput.bind(this);
    }

    onTouchInput() {
        const { onTouchInput } = this.props;
        onTouchInput && onTouchInput();
    }

    componentWillReceiveProps(props){
        const {verifyCode} = props
        if (verifyCode !== this.state.verifyCode)
        {
            this.setState({
                verifyCode:props.verifyCode
            })
        }
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
        const { verifyCode } = this.state;
        // const { onChangeText, verifyCodeLength } = this.props;
        return (
            <View style={styles.verifyContainer}>
                {this.renderVerifyCode(verifyCode)}
            </View>
        );
    }
}

VerifyCode.propTypes = propTypes;
VerifyCode.defaultProps = defaultProps;

export default VerifyCode;
