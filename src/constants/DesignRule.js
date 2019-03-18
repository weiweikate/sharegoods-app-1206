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

const {autoSizeWidth, onePixel, safeBottom, width} = ScreenUtils;

const colors = {
        mainColor: '#F00050',//主色调
        white: 'white',
        bgColor: '#F7F7F7',//背景色
        bgColor_btn: '#F00050',//红色按钮背景色
        bgColor_btnSelect: '#EF154C',//红色按钮选中状态背景色
        bgColor_LVLabel: '#F2D3A2',//等级标签背景色
        bgColor_redCard: '#FF4F6E',//红色卡片背景色
        bgColor_blueCard: '#8EC7FF',//蓝色卡片背景色
        bgColor_yellowCard: '#F2D4A2',//黄色卡片背景色
        bgColor_grayHeader: '#CCCCCC',//头像灰色背景
        bgColor_redHeader: '#FF5781',//头像红色背景
        lineColor_inColorBg: '#EEEEEE',//在有色背景的线的颜色
        lineColor_inWhiteBg: '#E4E4E4',//在白色背景的线的颜色
        lineColor_inGrayBg: '#D9D9D9',//在灰色背景的线的颜色
        textColor_mainTitle: '#333333',//主标题
        textColor_mainTitle_222:'#222222',//?黑色的字
        textColor_secondTitle: '#666666',//二级标题
        textColor_instruction: '#999999',//说明文字
        textColor_placeholder: '#CCCCCC',//预填文字
        textColor_white: 'white',//白色文字
        textColor_redWarn: '#F00050',//红色警告、提示文字
        textColor_blueURL: '#38ADFF',//文字链接
        textColor_btnText: '#F00050',//按钮红色文字
        textColor_hint: '#C8C8C8', //输入框背景字颜色
        bgColor_blue: '#33B4FF', //蓝色背景
        bgColor_deepBlue: '#2B99D9',//深蓝背景
        textColor_deepBlue: '#1B7BB3', //深蓝字体
        color_yellow: '#FFFC00', //黄色颜色
        color_deepYellow: '#F1C11B', //深黄色颜色
        color_green: '#47c546', //绿色颜色
        color_ddd: '#dddddd', //ddd颜色
        color_fff: '#ffffff', //fff颜色
        color_f2: '#f2f2f2' ,//f2颜色
        color_90:'#909090',//90颜色
        yellow_FF7: '#FF7E00',//深黄色
        deliveryIncludeBlue: '#0186f5',//深蓝色
        imgBg_color:'#efefef'
    }
;

const sizes = {
    /** 字体*/
    fontSize_48: autoSizeWidth(24),//特殊文字大小
    fontSize_NavTitle: 19,//导航lan文字大小
    fontSize_bigBtnText: autoSizeWidth(17),//大按钮里面的文字大小
    fontSize_mediumBtnText: autoSizeWidth(15),//中等大小按钮的文字大小
    fontSize_mainTitle: autoSizeWidth(19),//一级标题文字大小
    fontSize_secondTitle: autoSizeWidth(15),//二级标题文字大小
    fontSize_threeTitle_28: autoSizeWidth(14),//三级标题文字大小
    fontSize_threeTitle: autoSizeWidth(13),//三级标题文字大小
    fontSize_24: autoSizeWidth(12),//四级文案 辅助信息
    fontSize_22: autoSizeWidth(11),//五级文案
    fontSize_20: autoSizeWidth(10),//6级文案 小标签
    /** 边距 、尺寸 */
    margin_page: autoSizeWidth(15),//组件与页面间距
    margin_card: autoSizeWidth(10),//卡片之间的间距
    margin_listGroup: autoSizeWidth(10),//列表组之间的间距
    margin_imageText: autoSizeWidth(10),//图文间距
    height_bigBtn: autoSizeWidth(49),//按钮高度
    lineHeight: onePixel
};

const styles = {
    /** 常用的style */
    style_container: {//页面
        flex: 1,
        backgroundColor: colors.bgColor
    },
    style_absoluteFullParent: {//充满父组件
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    style_contentCenter: {//子组件居中
        alignItems: 'center',
        justifyContent: 'center'
    },
    style_bigRedBtn: {//大的红色背景按钮
        backgroundColor: colors.bgColor_btn,
        height: sizes.height_bigBtn,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: sizes.margin_page
    },
    style_bigRedRadiusBtn: {//大的红色背景按钮带圆角
        backgroundColor: colors.bgColor_btn,
        height: sizes.height_bigBtn,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: sizes.margin_page,
        borderRadius: sizes.height_bigBtn / 2,
        overflow: 'hidden'
    },
    style_bigRedBorderBtn: {//大的红色边框白色背景按钮
        height: sizes.height_bigBtn,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: sizes.margin_page,
        borderWidth: 1,
        borderColor: colors.bgColor_btn
    },
    style_btnRedText: {//按钮的红色文字
        fontSize: sizes.fontSize_bigBtnText,
        color: colors.bgColor_btn
    },
    style_btnWhiteText: {//按钮的白色文字
        fontSize: sizes.fontSize_bigBtnText,
        color: colors.white
    }
};

const DesignRule = {
    ...colors,
    ...sizes,
    ...styles,
    autoSizeWidth,
    safeBottom,
    width
};

export default DesignRule;


