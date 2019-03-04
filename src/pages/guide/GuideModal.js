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
    ImageBackground
} from 'react-native';
import CommModal from '../../comm/components/CommModal';
import res from './res';
import ScreenUtils from '../../utils/ScreenUtils';
import { MRText } from '../../components/ui';
import DesignRule from '../../constants/DesignRule';
import OssHelper from '../../utils/OssHelper';
import ImageLoad from '@mr/image-placeholder';
import {categoryHeight} from '../home/HomeCategoryView'
import { bannerHeight } from '../home/HomeBannerView';
import{ kHomeClassifyHeight } from '../home/HomeClassifyView';
import  { adViewHeight } from '../home/HomeAdView';
import { adModules } from '../home/HomeAdModel';
import user from '../../model/user';
import { observer } from 'mobx-react';
import RouterMap,{ navigate } from '../../navigation/RouterMap';
const {
    tip_one,
    tip_two,
    tip_three,
    tip_four,
    tip_five,
    discover,
    group,
    next_btn,
    bg,
    btn,
    close_white
} = res;
const autoSizeWidth = ScreenUtils.autoSizeWidth;
const adWidth = (ScreenUtils.width - autoSizeWidth(35)) / 2
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
            step: 0, /** 新手引导第几步*/
            visible: false,
            num: 98
        };
        /** type: 0 代表*/
        this.data = [{image: discover, tip: tip_one, text: '秀场'},
            {image: OssHelper('/app/share%403x.png'), tip: tip_two, text: '升级'},
            {image: group, tip: tip_three, text: '拼店'},
            {image: OssHelper(''), tip: tip_four},
            {image: OssHelper('/app/signin%403x.png'), tip: tip_five, text: '签到'}
        ];
    }

    open = () => {
        this.setState({visible: true});
    }
    close = () => {
        this.setState({visible: false});
    }


    componentDidMount() {

    }

    /**
     * 渲染新手引导的内容
     */
    renderContent = () => {
        let {step} = this.state;
        let data = this.data[step];
        if (step < 5) {
            let bgStyle = {};
            let imageStyle = {};
            let textStyle = {};
            let tipStyle = {};
            let next_btnStyle = {
                width: autoSizeWidth(74),
                height: autoSizeWidth(46)
            };
            if (step === 0){
                let bottom = ScreenUtils.tabBarHeight - autoSizeWidth(75/2.0);
                bgStyle = {bottom: bottom, left: ScreenUtils.width/5.0 * 1}
                imageStyle = {width: autoSizeWidth(32), height: autoSizeWidth(32)};
                textStyle = {color: DesignRule.textColor_mainTitle, fontSize: 10, marginTop: 6};
                tipStyle = {
                    width: autoSizeWidth(178),
                    height: autoSizeWidth(117),
                    left: ScreenUtils.width/5.0 * 1,
                    bottom: bottom+autoSizeWidth(75) + 2,
                    position: 'absolute'
                };
                next_btnStyle= {...next_btnStyle,
                    left: autoSizeWidth(225),
                    bottom: ScreenUtils.tabBarHeight,
                    position: 'absolute'};
            }


            if (step === 1){
                let top =  categoryHeight + bannerHeight + ScreenUtils.headerHeight + (user.isLogin?autoSizeWidth(44):0);
                bgStyle = {top: top, left: autoSizeWidth(7)}
                imageStyle = {width: autoSizeWidth(50), height: autoSizeWidth(50)};
                textStyle = {color: DesignRule.textColor_mainTitle, fontSize: 10, marginTop: 1};
                tipStyle = {
                    width: autoSizeWidth(183),
                    height: autoSizeWidth(110),
                    left: autoSizeWidth(71),
                    top: top - autoSizeWidth(110) - 2,
                    position: 'absolute'
                };
                next_btnStyle= {...next_btnStyle,
                    right: autoSizeWidth(97),
                    top: top - autoSizeWidth(46/2),
                    position: 'absolute'};
            }

            if (step === 2){
                let bottom = ScreenUtils.tabBarHeight - autoSizeWidth(75/2.0);
                bgStyle = {bottom: bottom, left: ScreenUtils.width/5.0 * 2}
                imageStyle = {width: autoSizeWidth(32), height: autoSizeWidth(32)};
                textStyle = {color: DesignRule.textColor_mainTitle, fontSize: 10, marginTop: 6};
                tipStyle = {
                    width: autoSizeWidth(144),
                    height: autoSizeWidth(111),
                    left: autoSizeWidth(125),
                    bottom: bottom+autoSizeWidth(75) + 2,
                    position: 'absolute'
                };
                next_btnStyle= {...next_btnStyle,
                    right: autoSizeWidth(33),
                    bottom: ScreenUtils.tabBarHeight,
                    position: 'absolute'};
            }

            if (step === 3){
                let ad = adModules.ad;
                let top =  kHomeClassifyHeight+categoryHeight + bannerHeight + ScreenUtils.headerHeight + (user.isLogin?autoSizeWidth(44):0);
                if (ad.length > 0){
                    data.image = ad[ad.length-1].imgUrl;
                    top = top + adViewHeight - adHeight
                }
                if (top>ScreenUtils.height - ScreenUtils.tabBarHeight - adHeight) {
                    top = ScreenUtils.height - ScreenUtils.tabBarHeight - adHeight;
                }
                bgStyle = {top: top, right: autoSizeWidth(12), height: autoSizeWidth(80), width: autoSizeWidth(180), borderRadius: 5}
                imageStyle = {width: autoSizeWidth(180), height: autoSizeWidth(80)};
                textStyle = {color: DesignRule.textColor_mainTitle, fontSize: 10, marginTop: 1};
                tipStyle = {
                    width: autoSizeWidth(189),
                    height: autoSizeWidth(122),
                    left: autoSizeWidth(67),
                    top: top - autoSizeWidth(122) - 2,
                    position: 'absolute'
                };
                next_btnStyle= {...next_btnStyle,
                    right: autoSizeWidth(65),
                    top: top - autoSizeWidth(189),
                    position: 'absolute'};
            }

            if (step === 4){
                let top =  categoryHeight + bannerHeight + ScreenUtils.headerHeight + (user.isLogin?autoSizeWidth(44):0);
                bgStyle = {top: top, left: autoSizeWidth(148)}
                imageStyle = {width: autoSizeWidth(50), height: autoSizeWidth(50)};
                textStyle = {color: DesignRule.textColor_mainTitle, fontSize: 10, marginTop: 1};
                tipStyle = {
                    width: autoSizeWidth(200),
                    height: autoSizeWidth(120),
                    left: autoSizeWidth(100),
                    top: top - autoSizeWidth(120) - 2,
                    position: 'absolute'
                };
                next_btnStyle= {...next_btnStyle,
                    right: autoSizeWidth(32),
                    top: top - autoSizeWidth(46/2),
                    position: 'absolute'};
            }
            return (
                <View style={DesignRule.style_absoluteFullParent}>
                    <View style={[styles.circleBg, bgStyle]}>
                        { typeof data.image === 'string' ?
                            <ImageLoad source={{uri: data.image}} style = {imageStyle} isAvatar={step!==3}/>:
                            <Image source={data.image} style = {imageStyle}/>
                        }
                        {data.text ? <MRText style={textStyle}>{data.text}</MRText> : null}
                    </View>
                    <Image source={data.tip} style = {tipStyle} resizeMode={'stretch'}/>
                    <TouchableOpacity onPress={this.nextPress} style = {next_btnStyle}>
                        <Image source={next_btn} style={{flex: 1}} resizeMode={'stretch'}/>
                    </TouchableOpacity>
                </View>
            )
        }else {
            return (
                <View style={[DesignRule.style_absoluteFullParent, {alignItems: 'center'}]}>
                    <View style={{flex: 1}}/>
                    <ImageBackground style={{height: autoSizeWidth(345), width: autoSizeWidth(250), justifyContent: 'flex-end',alignItems: 'center'}}
                                     source={bg}
                    >
                        <MRText style={{fontSize: 17, color: '#FFECB6', marginBottom: 10}}>{this.state.num + '枚秀豆送给您'}</MRText>
                        <TouchableOpacity onPress={this.gotoPage} style = {{marginBottom: autoSizeWidth(30), alignItems: 'center'}}>
                            <Image source={btn} style={{height: autoSizeWidth(40), width: autoSizeWidth(145)}} resizeMode={'stretch'}/>
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={{flex: 1}}>
                    <TouchableOpacity onPress={this.close} style = {{marginTop: autoSizeWidth(25)}}>
                        <Image source={close_white} style={{height: autoSizeWidth(24), width: autoSizeWidth(24)}} resizeMode={'stretch'}/>
                    </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    nextPress=()=>{
        this.setState({step: this.state.step + 1})   ;
    }

    gotoPage=()=>{
        navigate(RouterMap.MyIntegralAccountPage);
        this.close();
    }


    render() {
        return (
            <CommModal
                ref={(ref) => {this.modal = ref}}
                visible={this.state.visible}
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
        borderRadius: autoSizeWidth(75/2.0),
        alignItems: 'center',
        position: 'absolute',
        justifyContent: 'center',
        overflow: 'hidden'

    }
});
