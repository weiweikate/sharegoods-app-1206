import React, { Component } from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import MRBannerView from './MRBannerView';
import ScreenUtils from '../../../utils/ScreenUtils';

export default class MRBannerViewMode extends Component {

    static propTypes = {
        bannerHeight:PropTypes.number,
        //ModeStyle
        modeStyle: PropTypes.number,//0划点/1数字/2卡片
        //图片url数组
        imgUrlArray: PropTypes.array.isRequired,
        //选择index
        onDidSelectItemAtIndex: PropTypes.func
    };
    _onDidScrollToIndex = (e) => {
        console.log(`dfshfdkffdjfdsfdjfdddddd${e.nativeEvent.index}`);
    };



    _renderPageControl = () => {
        const { modeStyle } = this.props;
        switch (modeStyle) {
            case 1: {
                break;
            }
            case 2: {
                break;
            }
            default: {
                this._renderStyleDefault();
                break;
            }
        }
    };

    _renderStyleDefault = () => {
        return (
            <View style={{ position: 'absolute', bottom: 0, alignSelf: 'center', flexDirection: 'row' }}>
                <View style={{ height: 5, width: 20, backgroundColor: 'black' }}/>
                <View style={{ height: 5, width: 20, backgroundColor: 'black', marginLeft: 5 }}/>
                <View style={{ height: 5, width: 20, backgroundColor: 'black', marginLeft: 5 }}/>
                <View style={{ height: 5, width: 20, backgroundColor: 'black', marginLeft: 5 }}/>
            </View>
        );
    };

    _renderStyle = () => {
        return (
            <View style={{ position: 'absolute', bottom: 0, alignSelf: 'center', flexDirection: 'row' }}>
                <View style={{ height: 5, width: 20, backgroundColor: 'black' }}/>
                <View style={{ height: 5, width: 20, backgroundColor: 'black', marginLeft: 5 }}/>
                <View style={{ height: 5, width: 20, backgroundColor: 'black', marginLeft: 5 }}/>
                <View style={{ height: 5, width: 20, backgroundColor: 'black', marginLeft: 5 }}/>
            </View>
        );
    };

    render() {
        return (
            <MRBannerView style={[{ height: this.props.bannerHeight, width: ScreenUtils.width}]}
                          onDidScrollToIndex={this._onDidScrollToIndex}
                          imgUrlArray={this.props.imgUrlArray}
                          onDidSelectItemAtIndex={this.props.onDidSelectItemAtIndex}>
                {this._renderPageControl()};
            </MRBannerView>
        );
    }
}
