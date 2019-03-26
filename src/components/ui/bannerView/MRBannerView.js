import React, { Component } from 'react';
import { requireNativeComponent } from 'react-native';
import PropTypes from 'prop-types';

const RCTMRBannerView = requireNativeComponent('MRBannerView', MRBannerView);

export default class MRBannerView extends Component {
    static propTypes = {
        //图片url数组
        imgUrlArray: PropTypes.array.isRequired,
        //选择index
        onDidSelectItemAtIndex: PropTypes.func,
        //滚动到index
        onDidScrollToIndex: PropTypes.func,

        //滚动间隔 设置0为不滚动  默认3
        autoInterval: PropTypes.number,
        //是否轮播 默认true
        autoLoop: PropTypes.bool,

        //卡片文字数组
        tittleArray: PropTypes.array,
        //卡片宽
        itemWidth: PropTypes.number,
        //卡片间距
        itemSpace: PropTypes.number,
        //卡片圆角
        itemRadius: PropTypes.number,
        pageFocused: PropTypes.bool
    };

    render() {
        return (
            <RCTMRBannerView {...this.props} data={{imgUrlArray:this.props.imgUrlArray,itemWidth:this.props.itemWidth}}/>
        );
    }
}
