import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import MRBannerView from './MRBannerView';
import ScreenUtils from '../../../utils/ScreenUtils';
import { MRText as Text } from '../UIText';
import DesignRule from '../../../constants/DesignRule';

const { px2dp } = ScreenUtils;

export default class MRBannerViewComponent extends Component {

    static propTypes = {
        //ModeStyle
        modeStyle: PropTypes.number,//1划点 /2数字  默认无
        bannerHeight: PropTypes.number,

        //图片url数组
        imgUrlArray: PropTypes.array.isRequired,
        //选择index
        onDidSelectItemAtIndex: PropTypes.func,
        //滚动间隔 设置0为不滚动  默认3
        autoInterval: PropTypes.number,
        //是否轮播 默认true
        autoLoop: PropTypes.bool,
        itemRadius: PropTypes.number,
        onDidScrollToIndex: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = { index: 0 };
    }

    _renderPageControl = (arrLen) => {
        const { modeStyle } = this.props;
        switch (modeStyle) {
            case 1:
                return this._renderStyleOne(arrLen);
            case 2:
                return this._renderStyleTwo(arrLen);
            default:
                return null;
        }
    };

    _renderStyleOne = (arrLen) => {
        const { index } = this.state;
        let items = [];
        for (let i = 0; i < arrLen; i++) {
            if (index === i) {
                items.push(<View key={i} style={styles.activityIndex}/>);
            } else {
                items.push(<View key={i} style={styles.index}/>);
            }
        }
        return <View style={styles.indexView}>
            {items}
        </View>;
    };

    _renderStyleTwo = (arrLen) => {
        return <View style={styles.indexViewTwo}>
            <Text style={styles.text} allowFontScaling={false}>{this.state.index + 1} / {arrLen}</Text>
        </View>;
    };

    _onDidSelectItemAtIndex = (e) => {
        const { onDidSelectItemAtIndex } = this.props;
        onDidSelectItemAtIndex && onDidSelectItemAtIndex(e.nativeEvent.index);
    };

    _onDidScrollToIndex(e) {
        const { onDidScrollToIndex } = this.props;
        if (!onDidScrollToIndex) {
            return;
        }
        let index = e.nativeEvent.index;
        this.setState({ index });
        this.props.onDidScrollToIndex(index);
    }


    render() {
        const { bannerHeight, imgUrlArray, autoLoop, itemRadius, pageFocused } = this.props;
        console.log('------' + itemRadius);
        let imgWidth = ScreenUtils.width - ScreenUtils.px2dp(30);
        return (
            <View style={styles.container}>
                {/*加一个0.5修正值*/}
                <MRBannerView
                    ref={(ref) => this.mr_banner = ref}
                    style={[{ height: bannerHeight, width: imgWidth }]}
                    onDidScrollToIndex={(e) => this._onDidScrollToIndex(e)}
                    itemWidth={imgWidth + 0.5}
                    itemRadius={itemRadius}
                    itemSpace={0}
                    pageFocused={pageFocused}
                    onDidSelectItemAtIndex={(e) => this._onDidSelectItemAtIndex(e)}
                    autoLoop={autoLoop === false ? false : true}
                    autoInterval={5}
                    imgUrlArray={imgUrlArray}
                />
                {this._renderPageControl(imgUrlArray.length)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    indexView: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        width: ScreenUtils.width - px2dp(30),
        flexDirection: 'row',
        justifyContent: 'center'
    },
    activityIndex: {
        width: px2dp(10),
        height: px2dp(3),
        borderRadius: px2dp(1.5),
        backgroundColor: DesignRule.mainColor,
        marginLeft: 2,
        marginRight: 2
    },
    index: {
        width: px2dp(5),
        height: px2dp(3),
        borderRadius: px2dp(1.5),
        backgroundColor: DesignRule.lineColor_inWhiteBg,
        marginLeft: 2,
        marginRight: 2
    },
    indexViewTwo: {
        position: 'absolute',
        height: 20,
        borderRadius: 10,
        right: 14,
        bottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: 'white',
        fontSize: 10,
        paddingHorizontal: 8
    }
});
