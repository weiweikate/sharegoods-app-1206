import React, { Component } from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

import DesignRule from '../../../constants/DesignRule';
import { MRText } from '../../../components/ui';
import ScreenUtils from '../../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;

export const SectionNullView = () => {
    return <View style={{ height: 10 }}/>;
};

export const SectionLineView = () => {
    return <View style={{ backgroundColor: DesignRule.white }}>
        <View style={{ height: 0.5, marginLeft: 15, backgroundColor: DesignRule.lineColor_inWhiteBg }}/>
    </View>;
};

export class ContentSectionView extends Component {
    render() {
        return (
            <View style={ContentSectionViewStyles.contentView}>
                <View style={ContentSectionViewStyles.contentLineView}/>
                <MRText style={ContentSectionViewStyles.contentText}>商品详情</MRText>
                <View style={ContentSectionViewStyles.contentLineView}/>
            </View>
        );
    }
}

const ContentSectionViewStyles = StyleSheet.create({
    contentView: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        height: 37
    },
    contentLineView: {
        height: 1, width: px2dp(48), backgroundColor: DesignRule.lineColor_inGrayBg
    },
    contentText: {
        paddingHorizontal: 20, color: DesignRule.textColor_instruction, fontSize: 12
    }
});

