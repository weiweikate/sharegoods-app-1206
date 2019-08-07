/**
 * @author xzm
 * @date 2019/7/19
 */

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import { MRText } from '../../../components/ui';
import { routePush } from '../../../navigation/RouterMap';
import RouterMap from '../../../navigation/RouterMap';
import ShowUtils from '../utils/ShowUtils';

const { px2dp } = ScreenUtils;

export default class WriterInfoView extends PureComponent {

    render() {
        return (
            <View style={[styles.wrapper, this.props.style]}>
                <TouchableWithoutFeedback onPress={() => {
                    let params = {};
                    if(this.props.userType === 'mineWriter' || this.props.userType === 'mineNormal'){
                        params.type = 1;
                    }else {
                        params.type = 3;
                        params.id = this.props.userNo;
                    }
                    routePush(RouterMap.FansListPage, params );
                }}>
                    <View style={styles.itemWrapper}>
                        <MRText style={styles.numStyle}>
                            {ShowUtils.formatShowNum(this.props.attentions)}
                        </MRText>
                        <MRText style={styles.textStyle}>
                            关注
                        </MRText>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => {
                    let params = {};
                    if(this.props.userType === 'mineWriter' || this.props.userType === 'mineNormal'){
                        params.type = 0;
                    }else {
                        params.type = 2;
                        params.id = this.props.userNo;
                    }
                    routePush(RouterMap.FansListPage, params);
                }}>
                    <View style={styles.itemWrapper}>
                        <MRText style={styles.numStyle}>
                            {ShowUtils.formatShowNum(this.props.fans)}
                        </MRText>
                        <MRText style={styles.textStyle}>
                            粉丝
                        </MRText>
                    </View>
                </TouchableWithoutFeedback>

                <View style={styles.itemWrapper}>
                    <MRText style={styles.numStyle}>
                        {ShowUtils.formatShowNum(this.props.hot)}
                    </MRText>
                    <MRText style={styles.textStyle}>
                        收藏与获赞
                    </MRText>
                </View>

            </View>
        );
    }
}

var styles = StyleSheet.create({
    wrapper: {
        height: px2dp(70),
        width: DesignRule.margin_width,
        backgroundColor: DesignRule.white,
        borderRadius: px2dp(5),
        paddingHorizontal: px2dp(30),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemWrapper: {
        alignItems: 'center'
    },
    numStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_bigBtnText,
        fontWeight: '400'
    },
    textStyle: {
        color: DesignRule.textColor_secondTitle,
        fontSize: DesignRule.fontSize_24
    }
});

