/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 *
 * @providesModule DesignRule
 * @flow111
 * Created by huchao on 2018/10/22.
 */

import ScreenUtils from '../utils/ScreenUtils';

const autoSizeWidth = ScreenUtils.autoSizeWidth;

const colors = {
    mainColor: '#FF1A54',
    white: '#FFFFFF',
    bgColor: '#F7F7F7',
    bgColor_btn: '#FF1A54',
    bgColor_btnSelect: '#EF154C',
    bgColor_LVLabel: '#F2D3A2',
    bgColor_redCard: '#FF4F6E',
    bgColor_blueCard: '#8EC7FF',
    bgColor_yellowCard: '#F2D4A2',
    bgColor_grayHeader: '#CCCCCC',
    bgColor_redHeader: '#FF5781',
    lineColor_inColorBg: '#EEEEEE',
    lineColor_inWhiteBg: '#E4E4E4',
    lineColor_inGrayBg: '#D9D9D9',
    textColor_pureBlack: '#000000',
    textColor_mainTitle: '#333333',
    textColor_secondTitle: '#666666',
    textColor_instruction: '#999999',
    textColor_placeholder: '#CCCCCC',
    textColor_white: '#FFFFFF',
    textColor_redWarn: '#FF1A54',
    textColor_blueURL: '#38ADFF',
    textColor_btnText: '#FF1A54'
};

const sizes = {
    /** 字体*/
    fontSize_48: autoSizeWidth(24),
    fontSize_NavTitle: 19,
    fontSize_bigBtnText: autoSizeWidth(17),
    fontSize_mediumBtnText: autoSizeWidth(15),
    fontSize_secondTitle: autoSizeWidth(15),
    fontSize_threeTitle: autoSizeWidth(13),
    fontSize_24: autoSizeWidth(12),
    fontSize_22: autoSizeWidth(11),
    fontSize_20: autoSizeWidth(10),
    /** 边距 、尺寸 */
    margin_page: autoSizeWidth(15),
    margin_card: autoSizeWidth(10),
    margin_listGroup: autoSizeWidth(10),
    margin_imageText: autoSizeWidth(10),
    height_bigBtn: autoSizeWidth(49)
};

const styles = {
    /** 常用的style */
    style_container: {
        flex: 1,
        bgColor: colors.bgColor
    },
    style_absoluteFullParent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    style_contentCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    style_bigRedBtn: {
        bgColor: colors.bgColor_btn,
        height: sizes.height_bigBtn,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: sizes.margin_page
    },
    style_bigRedRadiusBtn: {
        bgColor: colors.bgColor_btn,
        height: sizes.height_bigBtn,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: sizes.margin_page,
        borderRadius: sizes.height_bigBtn / 2,
        overflow: 'hidden'
    },
    style_bigRedBorderBtn: {
        height: sizes.height_bigBtn,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: sizes.margin_page,
        borderWidth: 1,
        borderColor: colors.bgColor_btn
    },
    style_btnRedText: {
        fontSize: sizes.fontSize_bigBtnText,
        color: colors.bgColor_btn
    },
    style_btnWhiteText: {
        fontSize: sizes.fontSize_bigBtnText,
        color: colors.white
    }
};

const DesignRule = {
    ...colors,
    ...sizes,
    ...styles
};

export default DesignRule;


