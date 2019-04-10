/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/3/1.
 *
 */


'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import CommModal from '../../comm/components/CommModal';
import res from './res';
import ScreenUtils from '../../utils/ScreenUtils';
import { MRText } from '../../components/ui';
import DesignRule from '../../constants/DesignRule';
import OssHelper from '../../utils/OssHelper';
import ImageLoad from '@mr/image-placeholder';
import { categoryHeight } from '../home/view/HomeCategoryView';
import { bannerHeight } from '../home/view/HomeBannerView';
import { homeFocusAdModel , kAdHeight} from '../home/model/HomeFocusAdModel';
import user from '../../model/user';
import { observer } from 'mobx-react';
import { navigate } from '../../navigation/RouterMap';
import { homeModule } from '../home/model/Modules';
import { channelModules } from '../home/model/HomeChannelModel';
import { homeExpandBnnerModel } from '../home/model/HomeExpandBnnerModel';
import HomeModalManager from '../home/manager/HomeModalManager'
import GuideApi from './GuideApi';

const {
    tip_one,
    tip_two,
    tip_three,
    tip_four,
    tip_five,
    tip_six,
    discover,
    group,
    mine,
    next_btn
    // button: {
    //     cancel_white_circle
    // }
} = res;
const autoSizeWidth = ScreenUtils.autoSizeWidth;
const adWidth = (ScreenUtils.width - autoSizeWidth(35)) / 2;
const adHeight = adWidth * (160 / 340);

// import {
//   UIText,
//   UIImage
// } from '../../../components/ui';
// import DesignRule from 'DesignRule';
@observer
export default class GuideModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showActivityIndicator: true
        };
        /** 每一步引导的数据*/
        this.data = [{ image: discover, tip: tip_one, text: '秀场' },
            { image: OssHelper('/app/share11.png'), tip: tip_two, text: '升级' },
            { image: group, tip: tip_three, text: '拼店' },
            { image: '', tip: tip_four },//这个图片从 mobox获取
            { image: OssHelper('/app/signin11.png'), tip: tip_five, text: '签到' },
            { image: mine, tip: tip_six, text: '我的' }

        ];
    }

    componentDidMount() {

    }

    /**
     * 渲染新手引导的内容
     */
    renderContent = () => {
        let { step } = HomeModalManager;
        let data = this.data[step];
        let _categoryHeight = categoryHeight;
        if (step < 6) {
            let bgStyle = {};
            let imageStyle = {};
            let textStyle = {};
            let tipStyle = {};
            let next_btnStyle = {
                width: autoSizeWidth(74),
                height: autoSizeWidth(46)
            };
            // alert(ScreenUtils.headerHeight);
            if (step === 0) {
                let bg_offsety = ScreenUtils.tabBarHeight > 49 ? 49 : ScreenUtils.tabBarHeight;
                let bottom = ScreenUtils.tabBarHeight - bg_offsety + 3;
                bgStyle = { bottom: bottom, left: ScreenUtils.width / 5.0 * 1 };
                imageStyle = { width: autoSizeWidth(32), height: autoSizeWidth(32) };
                textStyle = { color: DesignRule.textColor_mainTitle, fontSize: 10, marginTop: 6 };
                tipStyle = {
                    width: autoSizeWidth(178),
                    height: autoSizeWidth(117),
                    left: ScreenUtils.width / 5.0 * 1,
                    bottom: bottom + autoSizeWidth(75) + 2,
                    position: 'absolute'
                };
                next_btnStyle = {
                    ...next_btnStyle,
                    left: autoSizeWidth(225),
                    bottom: ScreenUtils.tabBarHeight,
                    position: 'absolute'
                };
            }


            if (step === 1) {
                let top = _categoryHeight + bannerHeight + ScreenUtils.headerHeight + (user.isLogin ? autoSizeWidth(44) : 0) - (ScreenUtils.isIphonex ? 10 : 0) + 6;
                bgStyle = { top: top, left: autoSizeWidth(7) };
                imageStyle = { width: autoSizeWidth(50), height: autoSizeWidth(50) };
                textStyle = { color: DesignRule.textColor_mainTitle, fontSize: 10, marginTop: 1 };
                tipStyle = {
                    width: autoSizeWidth(183),
                    height: autoSizeWidth(110),
                    left: autoSizeWidth(71),
                    top: top - autoSizeWidth(110) - 2,
                    position: 'absolute'
                };
                next_btnStyle = {
                    ...next_btnStyle,
                    right: autoSizeWidth(97),
                    top: top - autoSizeWidth(46 / 2),
                    position: 'absolute'
                };
            }

            if (step === 2) {
                let bg_offsety = ScreenUtils.tabBarHeight > 49 ? 49 : ScreenUtils.tabBarHeight;
                let bottom = ScreenUtils.tabBarHeight - bg_offsety + 3;
                bgStyle = { bottom: bottom, left: ScreenUtils.width / 5.0 * 2 };
                imageStyle = { width: autoSizeWidth(32), height: autoSizeWidth(32) };
                textStyle = { color: DesignRule.textColor_mainTitle, fontSize: 10, marginTop: 6 };
                tipStyle = {
                    width: autoSizeWidth(144),
                    height: autoSizeWidth(111),
                    left: autoSizeWidth(125),
                    bottom: bottom + autoSizeWidth(75) + 2,
                    position: 'absolute'
                };
                next_btnStyle = {
                    ...next_btnStyle,
                    right: autoSizeWidth(33),
                    bottom: ScreenUtils.tabBarHeight,
                    position: 'absolute'
                };
            }

            if (step === 3) {
                let ad = homeExpandBnnerModel.banner;
                let top =  _categoryHeight + bannerHeight + ScreenUtils.headerHeight + (user.isLogin ? autoSizeWidth(44) : 0) - (ScreenUtils.isIphonex ? 10 : 0) + homeExpandBnnerModel.getExpandHeigh + channelModules.channelHeight;
                if (ad.length > 0) {
                    data.image = ad[ad.length - 1].image || '';//获取最后一个图片地址
                    top = top + homeFocusAdModel.foucusHeight - kAdHeight;
                }
                if (top > ScreenUtils.height - ScreenUtils.tabBarHeight - adHeight) {
                    top = ScreenUtils.height - ScreenUtils.tabBarHeight - adHeight;
                }
                bgStyle = {
                    top: top,
                    right: autoSizeWidth(12),
                    height: autoSizeWidth(80),
                    width: autoSizeWidth(180),
                    borderRadius: 5
                };
                imageStyle = { width: autoSizeWidth(180), height: autoSizeWidth(80) };
                textStyle = { color: DesignRule.textColor_mainTitle, fontSize: 10, marginTop: 1 };
                tipStyle = {
                    width: autoSizeWidth(189),
                    height: autoSizeWidth(122),
                    left: autoSizeWidth(67),
                    top: top - autoSizeWidth(122) - 2,
                    position: 'absolute'
                };
                next_btnStyle = {
                    ...next_btnStyle,
                    right: autoSizeWidth(65),
                    top: top - autoSizeWidth(189),
                    position: 'absolute'
                };
            }

            if (step === 4) {
                let top = _categoryHeight + bannerHeight + ScreenUtils.headerHeight + (user.isLogin ? autoSizeWidth(44) : 0) - (ScreenUtils.isIphonex ? 10 : 0) + 6;
                bgStyle = { top: top, left: autoSizeWidth(148) };
                imageStyle = { width: autoSizeWidth(50), height: autoSizeWidth(50) };
                textStyle = { color: DesignRule.textColor_mainTitle, fontSize: 10, marginTop: 1 };
                tipStyle = {
                    width: autoSizeWidth(200),
                    height: autoSizeWidth(120),
                    left: autoSizeWidth(100),
                    top: top - autoSizeWidth(120) - 2,
                    position: 'absolute'
                };
                next_btnStyle = {
                    ...next_btnStyle,
                    right: autoSizeWidth(32),
                    top: top - autoSizeWidth(46 / 2),
                    position: 'absolute'
                };
            }

            if (step === 5) {
                let bg_offsety = ScreenUtils.tabBarHeight > 49 ? 49 : ScreenUtils.tabBarHeight;
                let bottom = ScreenUtils.tabBarHeight - bg_offsety + 3;
                bgStyle = { bottom: bottom, right: 8 };
                imageStyle = { width: autoSizeWidth(32), height: autoSizeWidth(32) };
                textStyle = { color: DesignRule.textColor_mainTitle, fontSize: 10, marginTop: 6 };
                tipStyle = {
                    width: autoSizeWidth(260),
                    height: autoSizeWidth(130),
                    left: autoSizeWidth(67),
                    bottom: bottom + autoSizeWidth(75) + 2,
                    position: 'absolute'
                };
                next_btnStyle = {
                    ...next_btnStyle,
                    right: autoSizeWidth(51),
                    bottom: ScreenUtils.tabBarHeight + autoSizeWidth(130) + autoSizeWidth(37) + autoSizeWidth(75 / 2.0),
                    position: 'absolute'
                };
            }
            return (
                <View style={DesignRule.style_absoluteFullParent}>
                    <View style={[styles.circleBg, bgStyle]}>
                        {typeof data.image === 'string' ?
                            <ImageLoad source={{ uri: data.image }} style={imageStyle} key={step + ''}/> :
                            <Image source={data.image} style={imageStyle}/>
                        }
                        {data.text ? <MRText style={textStyle}>{data.text}</MRText> : null}
                    </View>
                    <Image source={data.tip} style={tipStyle} resizeMode={'stretch'}/>
                    <TouchableOpacity onPress={this.nextPress} style={next_btnStyle}>
                        <Image source={next_btn} style={{ flex: 1 }} resizeMode={'stretch'}/>
                    </TouchableOpacity>
                </View>
            );
        } else {
            let imageStyle = {
                height: autoSizeWidth(375),
                width: autoSizeWidth(315),
                justifyContent: 'flex-end',
                alignItems: 'center'
            };
            return (
                <View style={[DesignRule.style_absoluteFullParent, { alignItems: 'center' }]}>
                    <View style={{ flex: 1 }}/>
                    <TouchableWithoutFeedback onPress={this.gotoPage}>
                        <View>
                            <ImageLoad style={imageStyle}
                                       source={{ uri: HomeModalManager.guideData.image || '' }}
                                       resizeMode={'contain'}
                                       onError={() => {
                                           this.setState({ showActivityIndicator: false });
                                       }}
                                       onLoadEnd={() => {
                                           this.setState({ showActivityIndicator: false });
                                       }}
                            >
                                {
                                    this.state.showActivityIndicator === true ? <ActivityIndicator
                                        color="#aaaaaa"
                                        style={{
                                            position: 'absolute',
                                            width: 10,
                                            height: 10,
                                            top: autoSizeWidth(375) / 2.0 - 5,
                                            left: autoSizeWidth(315) / 2.0 - 5
                                        }}/> : null
                                }
                            </ImageLoad>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{ flex: 1 }}>
                        {/*<TouchableOpacity onPress={this.close} style = {{marginTop: autoSizeWidth(25)}}>*/}
                        {/*<Image source={cancel_white_circle} style={{height: autoSizeWidth(24), width: autoSizeWidth(24)}} resizeMode={'stretch'}/>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                </View>
            );
        }
    };

    nextPress = () => {
        if (HomeModalManager.step === 5) {
            GuideApi.registerSend({});//完成了新手引导
            user.finishGiudeAction();//防止请求失败，重复调用新手引导
        }
        HomeModalManager.guideNextAction();
    };

    gotoPage = () => {
        let data = HomeModalManager.guideData;
        const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
        let params = homeModule.paramsNavigate(data);
        if (router) {
            navigate(router, params);
        }
        HomeModalManager.closeGuide();
    };


    render() {
        if (HomeModalManager.isShowGuide && HomeModalManager.isHome) {
            this.props.onShow && this.props.onShow()
        }
        return (
            <CommModal
                focusable={false}
                ref={(ref) => {
                    this.modal = ref;
                }}
                visible={HomeModalManager.isShowGuide && HomeModalManager.isHome}
            >
                {this.renderContent()}
            </CommModal>
        );
    }
}

const styles = StyleSheet.create({
    circleBg: {
        width: autoSizeWidth(75),
        height: autoSizeWidth(75),
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.05)',
        borderRadius: autoSizeWidth(75 / 2.0),
        alignItems: 'center',
        position: 'absolute',
        justifyContent: 'center',
        overflow: 'hidden'

    }
});
