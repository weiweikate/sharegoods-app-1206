/**
 * @author 陈阳君
 * @date on 2019/09/27
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image
} from 'react-native';
import { MRText } from '../../../../components/ui';
import ScreenUtils from '../../../../utils/ScreenUtils';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import res from '../../res';
import DesignRule from '../../../../constants/DesignRule';
import LinearGradient from 'react-native-linear-gradient';
import { observer } from 'mobx-react';
import { routePush } from '../../../../navigation/RouterMap';

const { waitToNormal } = res;
const { px2dp } = ScreenUtils;

@observer
export default class WaitingToNormalModal extends Component {

    render() {
        const { closeWaiting, waitToNormalUsers } = this.props.MyShopDetailModel;
        if (waitToNormalUsers === 0) {
            return null;
        }
        return (
            <View style={styles.container}>
                <View style={styles.containerView}>
                    <Image source={waitToNormal} style={styles.img}/>
                    <MRText style={styles.text}>{`您有${waitToNormalUsers}位成员待扩容\n请尽快扩容～`}</MRText>
                    <View style={{ flexDirection: 'row', marginBottom: 25 }}>
                        <NoMoreClick style={styles.leftBtn} onPress={closeWaiting}>
                            <MRText style={styles.leftText}>知道了</MRText>
                        </NoMoreClick>
                        <NoMoreClick onPress={() => {
                            closeWaiting();
                            routePush('store/addCapacity/AddCapacityPage');
                        }}>
                            <LinearGradient style={styles.rightBtn}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={['#FF0050', '#FC5D39']}>
                                <MRText style={styles.rightText}>我要扩容</MRText>
                            </LinearGradient>
                        </NoMoreClick>
                    </View>
                    <View style={styles.bottomView}>
                        <MRText
                            style={styles.bottomText}>{`· 扩容后，待扩容成员将成为正式成员\n· 待扩容期内，此成员可自由离店\n· 若指定时间内不扩容，此成员将自动离店`}</MRText>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        zIndex: 1000,
        position: 'absolute', width: ScreenUtils.width, height: ScreenUtils.height,
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center'
    },
    containerView: {
        width: px2dp(275), alignItems: 'center', borderRadius: 15, backgroundColor: 'white', overflow: 'hidden'
    },
    img: {
        width: px2dp(80), height: px2dp(80), marginTop: 20, marginBottom: 15
    },
    text: {
        fontSize: 15, color: DesignRule.textColor_mainTitle, paddingBottom: 25,
        textAlign: 'center'
    },
    btnView: {
        flexDirection: 'row'
    },
    leftBtn: {
        justifyContent: 'center', alignItems: 'center',
        width: px2dp(100), height: 30, borderRadius: 15, borderColor: DesignRule.mainColor, borderWidth: 1
    },
    leftText: {
        fontSize: 14, color: DesignRule.textColor_redWarn
    },
    rightBtn: {
        justifyContent: 'center', alignItems: 'center', marginLeft: 25,
        width: px2dp(100), height: 30, borderRadius: 15
    },
    rightText: {
        fontSize: 14, color: 'white'
    },
    bottomView: {
        backgroundColor: DesignRule.bgColor, alignSelf: 'stretch'
    },
    bottomText: {
        padding: 15,
        fontSize: 12, color: DesignRule.textColor_secondTitle
    }
});
