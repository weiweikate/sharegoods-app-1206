/**
 * @author xzm
 * @date 2018/10/13
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
const { px2dp } = ScreenUtils;

import {
    StyleSheet,
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import {MRText as Text} from '../../../../components/ui';
import LinearGradient from "react-native-linear-gradient";


/**
 * 签到圆形view
 */


export default class SignInCircleView extends PureComponent {
    static propTypes = {
        count: PropTypes.number.isRequired,
        kind: PropTypes.oneOf(['signedIn','signingIn','noSignIn','willSignIn']).isRequired
    };

    constructor(props) {
        super(props);
    }

    signedInRender(){
        return (
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            colors={["#FFCB02", "#FF9502"]}
                            style={styles.circleStyle}>
                <Text style={styles.textStyle}>
                    {`+${this.props.count}`}
                </Text>
            </LinearGradient>
        );
    }

    noSignInRender(){
        return (
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            colors={["#FFCB02", "#FF9502"]}
                            style={[styles.circleStyle,{ opacity: 0.5}]}>
                <Text style={styles.textStyle}>
                    {`+${this.props.count}`}
                </Text>
            </LinearGradient>
        );
    }

    render(){
        switch (this.props.kind) {
            case 'signedIn' :
            case 'signingIn' :
                return this.signedInRender();
                break;
            case 'noSignIn' :
            case 'willSignIn' :
                return this.noSignInRender();
                break;
        }
    }
}

const styles = StyleSheet.create({
    circleStyle:{
        width:px2dp(24),
        height:px2dp(24),
        borderRadius:px2dp(12),
        justifyContent:'center',
        alignItems:'center'
    },
    textStyle:{
        fontSize:px2dp(12),
        color:DesignRule.white
    },
    iconStyle:{
        width:px2dp(20),
        height:px2dp(20)
    }
});



