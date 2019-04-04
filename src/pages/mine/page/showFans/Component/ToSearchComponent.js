/**
 * @author xzm
 * @date 2019/4/3
 */

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    PixelRatio,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import DesignRule from '../../../../../constants/DesignRule';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import { MRText } from '../../../../../components/ui';
import RouterMap from '../../../../../navigation/RouterMap';
import res from '../../../res'
const {icon_search} = res.myData;
const { px2dp } = ScreenUtils;
export default class ToSearchComponent extends PureComponent {
    toSearch = () => {
        this.props.navigate && this.props.navigate(RouterMap.SearchShowFansPage,{levelId:this.props.levelId});
    };

    render() {
        return (
            <View style={styles.contain}>
                <TouchableWithoutFeedback onPress={this.toSearch}>
                    <View style={styles.searchWrapper}>
                        <Image source={icon_search} style={styles.iconStyle}/>
                        <MRText style={styles.textStyle}>
                            搜索
                        </MRText>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    contain: {
        width: DesignRule.width,
        height: px2dp(50),
        backgroundColor: DesignRule.white,
        marginTop: -1.0 / PixelRatio.get(),
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchWrapper: {
        height: px2dp(34),
        borderRadius: px2dp(17),
        backgroundColor: '#F7F7F7',
        flexDirection: 'row',
        alignItems: 'center',
        width: DesignRule.width - DesignRule.margin_page * 2
    },
    iconStyle: {
        width: px2dp(18),
        height: px2dp(18),
        marginLeft: px2dp(10)
    },
    textStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_threeTitle,
        marginLeft: px2dp(10)
    }
});


