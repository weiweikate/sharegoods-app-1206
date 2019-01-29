/**
 * @author xzm
 * @date 2018/10/13
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
const { px2dp } = ScreenUtils;

import {
    StyleSheet,
    View,
    Image
} from 'react-native';
import ScreenUtils from "../../../../utils/ScreenUtils";
import DesignRule from '../../../../constants/DesignRule';
import res from  '../../res';
import {MRText as Text} from '../../../../components/ui';
const signingInIcon = res.signIn.complete_check;


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
            <View style={[styles.circleStyle,{ backgroundColor: 'white'}]}>
                <Text style={[styles.textStyle,{color:DesignRule.textColor_secondTitle}]}>
                    {`+${this.props.count}`}
                </Text>
            </View>
        );
    }

    signingInRender(){
        return (
            <View style={[styles.circleStyle,{ backgroundColor: 'white'}]}>
                <Image source={signingInIcon} style={styles.iconStyle} resizeMode={'stretch'}/>
            </View>
        );
    }

    willSignInRender(){
        return (
            <View style={[styles.circleStyle,{ backgroundColor: '#c6b478'}]}>
                <Text style={[styles.textStyle,{color:DesignRule.bgColor}]}>
                    {`+${this.props.count}`}
                </Text>
            </View>
        );
    }

    noSignInRender(){
        return (
            <View style={[styles.circleStyle,{ width:px2dp(30),
                height:px2dp(30),backgroundColor: '#c6b478',borderRadius:px2dp(15), borderWidth: px2dp(1),
                borderColor:'white'
            }]}>
                <Text style={[styles.textStyle,{color:DesignRule.textColor_secondTitle}]}>
                    {`+${this.props.count}`}
                </Text>
            </View>
        );
    }

    render(){
        switch (this.props.kind) {
            case 'signedIn' :
                return this.signedInRender();
                break;
            case 'signingIn' :
                return this.signingInRender();
                break;
            case 'noSignIn' :
                return this.noSignInRender();
                break;
            case 'willSignIn' :
                return this.willSignInRender();
                break;
        }
    }
}

const styles = StyleSheet.create({
    circleStyle:{
        width:px2dp(28),
        height:px2dp(28),
        borderRadius:px2dp(14),
        justifyContent:'center',
        alignItems:'center'
    },
    textStyle:{
        fontSize:px2dp(12),
    },
    iconStyle:{
        width:px2dp(20),
        height:px2dp(20)
    }
});



