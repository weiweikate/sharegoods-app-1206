/**
 * @author xzm
 * @date 2019/3/18
 */

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Image,
    ImageBackground
} from 'react-native';
import CommModal from '../../../../../comm/components/CommModal';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import res from '../../../res';
import { MRText } from '../../../../../components/ui';
import DesignRule from '../../../../../constants/DesignRule';

const { withdraw_success_icon, withdraw_success_btn } = res.bankCard;
const { px2dp } = ScreenUtils;


export default class WithdrawFinishModal extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CommModal visible={this.props.visible}
                       onRequestClose={this.props.onRequestClose}>
                <TouchableWithoutFeedback onPress={this.props.onRequestClose}>
                    <View style={styles.contentStyle}>
                        <Image style={styles.iconStyle} source={withdraw_success_icon}/>
                        <MRText style={styles.textStyle}>
                            提交成功
                        </MRText>
                        <ImageBackground source={withdraw_success_btn} style={styles.btnStyle}>
                            <MRText style={styles.btnTextStyle}>
                                知道了
                            </MRText>
                        </ImageBackground>
                    </View>
                </TouchableWithoutFeedback>
            </CommModal>
        );
    }
}

const styles = StyleSheet.create({
    closeIconStyle: {
        width: px2dp(35),
        height: px2dp(35),
        alignSelf: 'flex-end'
    },
    contentStyle: {
        width: px2dp(300),
        height: px2dp(320),
        marginTop: px2dp(35),
        alignItems: 'center',
        backgroundColor: DesignRule.white,
        borderRadius: px2dp(5)
    },
    textStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_bigBtnText,
        textAlign: 'center',
        marginTop: px2dp(25)
    },
    titleStyle: {
        color: '#000000',
        fontSize: DesignRule.fontSize_bigBtnText,
        marginTop: px2dp(208),
        marginBottom: px2dp(5)
    },
    iconStyle: {
        width: px2dp(140),
        height: px2dp(140),
        marginTop: px2dp(30)
    },
    btnStyle: {
        width: px2dp(195),
        height: px2dp(50),
        marginTop: px2dp(30)
    },
    btnTextStyle: {
        color: DesignRule.white,
        fontSize: DesignRule.fontSize_bigBtnText,
        alignSelf: 'center',
        marginTop: px2dp(8)
    }
});


