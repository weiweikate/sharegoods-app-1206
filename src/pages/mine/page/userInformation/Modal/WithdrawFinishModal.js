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
const {close,bounced} = res.bankCard
const { px2dp } = ScreenUtils;


export default class WithdrawFinishModal extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CommModal visible={this.props.visible}
                       onRequestClose={this.props.onRequestClose}>
                <View>
                    <TouchableWithoutFeedback onPress={this.props.onRequestClose}>
                    <Image style={styles.closeIconStyle} source={close}/>
                    </TouchableWithoutFeedback>
                    <ImageBackground style={styles.contentStyle} source={bounced}>
                        <MRText style={styles.titleStyle}>
                            {'提交成功'}
                        </MRText>
                        <MRText style={styles.textStyle}>
                            {`预计1-5个工作日到款\n每月28日到次月5号不进行提现审核`}
                        </MRText>
                    </ImageBackground>
                </View>
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
        alignItems:'center'
    },
    textStyle:{
        color:DesignRule.textColor_instruction,
        fontSize:DesignRule.fontSize_threeTitle_28,
        textAlign:'center'
    },
    titleStyle:{
        color:'#000000',
        fontSize:DesignRule.fontSize_bigBtnText,
        marginTop:px2dp(208),
        marginBottom:px2dp(5)
    }
});


