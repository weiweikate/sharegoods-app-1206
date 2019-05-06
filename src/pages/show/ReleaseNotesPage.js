/**
 * @author xzm
 * @date 2019/4/30
 */
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import BasePage from '../../BasePage';
import { MRText, MRTextInput } from '../../components/ui';
import DesignRule from '../../constants/DesignRule';
import ScreenUtils from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;

export default class ReleaseNotesPage extends BasePage {
    $navigationBarOptions = {
        title: '发布心得',
        show: true
    };

    constructor(props) {
        super(props);
    }

    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity>
                <MRText style={styles.publishTextStyle}>
                    发布
                </MRText>
            </TouchableOpacity>
        );
    };

    _render() {
        return (
            <View style={styles.contain}>
                <ScrollView>
                    <View style={styles.noteContain}>
                        <MRTextInput style={styles.textInputStyle}/>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    publishTextStyle: {
        color: DesignRule.mainColor,
        fontSize: DesignRule.fontSize_threeTitle
    },
    contain: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
    },
    noteContain: {
        backgroundColor: DesignRule.white,
        width: DesignRule.width
    },
    textInputStyle: {
        width: DesignRule.width - 2 * DesignRule.margin_page,
        height: px2dp(140)
    }
});

