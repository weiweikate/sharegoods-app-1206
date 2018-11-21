/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/11/14.
 *
 */
'use strict';

import React from 'react';

import {
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform
} from 'react-native';
import TimerMixin from 'react-timer-mixin';
import PropTypes from 'prop-types';

export default class LoopScrollView extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,// 数组元素可以是object、string或 既有string 也有object
        imgKey: PropTypes.string,// 当数组元素是object 默认取字段"imgUrl"
        pageWidth: PropTypes.number,//默认填充满
        pageHeight: PropTypes.number,//默认填充满
        pagePadding: PropTypes.number,//默认页面间隔
        automatic: PropTypes.bool,
        interval: PropTypes.number,//秒
        scrollToIndex: PropTypes.func,
        itemCorners: PropTypes.number
    };
    static defaultProps = {
        data: [],
        imgKey: 'imgUrl',
        pagePadding: 10,
        automatic: true,
        interval: 3,
        scrollToIndex: (index) => {
        },
        itemCorners: 0
    };

    constructor(props) {
        super(props);

        this._bind();

        this.state = {};
        this.drag = false;
        this._scrollViewToLast = this._scrollViewToLast.bind(this);
        this._scrollViewToFirst = this._scrollViewToFirst.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState){

        if (nextProps.automatic === true) {
            this._startTimer();
        } else {
            this._endTimer();
        }

        if (this.index >  nextProps.data.length+1 && nextProps.data.length > 0 && nextProps.data.length < this.props.data.length) {
            let { style: { width }, pageWidth, pagePadding } = this.props;
            let imageW = pageWidth || width;
            this.scrollView && this.scrollView.scrollTo({
                x: (imageW + pagePadding) * (nextProps.data.length + 1),
                animated: false
            });
            // this._scrollViewToFirst();
            this.index = 1 + nextProps.data.length;
            this.props.scrollToIndex(nextProps.data.length - 1);
        }
        if (this.props.data.length === 0 && nextProps.data.length > 0){
            this._scrollViewToFirst();
        }

        if (nextProps.data.length === 0){
            this.index == 0;
        }
        return true;
    }


    _startTimer() {
        this._endTimer();
        let that = this;
        this.timer = TimerMixin.setInterval(() => {
            that._handleTimer();
        }, this.props.interval * 1000);
    }

    _handleTimer() {
        if (this.props.data.length < 1) {
            return;
        }
        let { style: { width }, pageWidth, pagePadding } = this.props;
        let imageW = pageWidth || width;
        let index = this.index;
        this.scrollView && this.scrollView.scrollTo({ x: (imageW + pagePadding) * (index + 1), animated: true });
        if (Platform.OS !== 'ios'){
            TimerMixin.setTimeout(()=> {// e.nativeEvent.contentOffset.x
                this._onMomentumScrollEnd({nativeEvent: {contentOffset: {x: (imageW + pagePadding) * (index + 1)}}})
            },750);
        }
    }

    _endTimer() {
        this.timer && TimerMixin.clearInterval(this.timer);
    }

    _bind() {

    }

    _onScrollEndDrag(e) {
        this.drag = false;
        let index = this._getIndex(e);
        let velocityX = Platform.OS === 'ios'?e.nativeEvent.velocity.x: e.nativeEvent.velocity.x * -1;
        if (velocityX > 0){
            index = this.index+1;
        } else if(velocityX < 0){
            index = this.index-1;
        }
        this._scrollViewWithIndex(index);
        if (this.props.automatic) {
            this._startTimer();
        }
    }

    _onScrollBeginDrag() {
        this.drag = true;
        if (this.props.automatic) {
            this._endTimer();
        }
    }

    componentDidMount() {
            if (this.props.data.length < 1) {
                return;
            }
            this._scrollViewToFirst();
            this.index = 2;
            this.props.scrollToIndex(0);
            if (this.props.automatic) {
                this._startTimer();
            }
    }

    _getPageNumWithIndex(index) {
        let data = this.props.data;
        if (data.length === 1) {
            return 0;
        } else if (data.length === 2) {
            return [0, 1, 0, 1, 0, 1][index];
        } else if (data.length === 3) {
            return [1, 2, 0, 1, 2, 0, 1][index];
        } else {
            if (index === 0) {
                return data.length - 2;
            } else if (index === 1) {
                return data.length - 1;
            } else if (index === data.length + 2) {
                return 0;
            } else if (index === data.length + 3) {
                return 1;
            } else {
                return index - 2;
            }
        }
    }

    _onScroll(e) {
        if (this.props.data.length < 1) {
            return;
        }
        let index = this._getIndex(e);
        if (this._getPageNumWithIndex(index) !== this._getPageNumWithIndex(this.index)) {
            this.props.scrollToIndex(this._getPageNumWithIndex(index));
        }

        // if (index !== this.index && this.drag === false){
        //     this._scrollViewWithIndex(index);
        // }
        this.index = index;

    }

    _onMomentumScrollEnd(e) {
         if (this.props.data.length < 1) {
            return;
        }
         let index = this._getIndex(e);
        if (this._isFirst(index) === true) {
            this._scrollViewToLast();
        } else if (this._isLast(index) === true) {
            // alert(index);
            this._scrollViewToFirst();
        } else if (index === 0) {
            if (this.props.data.length === 1) {
                this._scrollViewToLast();
            } else {
                this._scrollViewToLast2();
            }
        }
    }

    _renderItem(item, index) {
        let { style: { width, height }, pageWidth, pageHeight, pagePadding, itemCorners } = this.props;
        let imgUrl = item;
        let imageH = pageHeight || height;
        let imageW = pageWidth || width;
        if (typeof item === 'object') {
            imgUrl = item[this.props.imgKey];
        }
        return (
            <TouchableOpacity key={imgUrl + index}
                              style={{
                                  height: imageH,
                                  width: imageW,
                                  marginHorizontal: pagePadding / 2,
                                  borderRadius: itemCorners,
                                  overflow: 'hidden',
                              }}
            >
                <Image source={{ uri: imgUrl }}
                       user
                       style={{
                           height: imageH,
                           width: imageW
                       }}
                />
            </TouchableOpacity>
        );
    }

    _getIndex(e) {
        let { style: { width }, pageWidth, pagePadding } = this.props;
        let imageW = pageWidth || width;
        let index = e.nativeEvent.contentOffset.x / (imageW + pagePadding * 1.0);
        return (Math.round(index));

    }

    _isFirst(index) {
        return index === 1;
    }

    _isLast(index) {
        return index === this.props.data.length + 2;
    }

    _scrollViewToFirst() {
        TimerMixin.setTimeout(() => {
            let { style: { width }, pageWidth, pagePadding } = this.props;
            this.index = 2;
            let imageW = pageWidth || width;
            this.scrollView && this.scrollView.scrollTo({ x: (imageW + pagePadding) * 2, animated: false });
        }, 100);
    }

    _scrollViewToLast() {
            let { style: { width }, pageWidth, pagePadding } = this.props;
            let imageW = pageWidth || width;
            this.index = this.props.data.length + 1;
            this.scrollView && this.scrollView.scrollTo({
                x: (imageW + pagePadding) * (this.props.data.length + 1),
                animated: false
            });
    }

    _scrollViewToLast2() {
        // alert('_scrollViewToLast')
        let { style: { width }, pageWidth, pagePadding } = this.props;
        let imageW = pageWidth || width;
        this.index = this.props.data.length;
        this.scrollView && this.scrollView.scrollTo({
            x: (imageW + pagePadding) * (this.props.data.length),
            animated: false
        });
    }

    _scrollViewWithIndex(index){
        let { style: { width }, pageWidth, pagePadding } = this.props;
        let imageW = pageWidth || width;
        this.index = this.props.data.length;
        this.scrollView && this.scrollView.scrollTo({
            x: (imageW + pagePadding) * (index),
            animated: true
        });
    }

    _changData(data) {
        if (data.length === 0) {
            return [];
        }
        let arr = [];
        if (data.length === 1) {
            let item = data[0];
            arr = [item, item, ...data, item, item];
        } else if (data.length === 2) {
            let item0 = data[0];
            let item1 = data[1];
            arr = [item0, item1, ...data, item0, item1];
        } else if (data.length === 3) {
            let item0 = data[0];
            let item1 = data[1];
            let item2 = data[2];
            arr = [item1, item2, ...data, item0, item1];
        } else {
            let item0 = data[0];
            let item1 = data[1];
            let item3 = data[data.length - 2];
            let item4 = data[data.length - 1];
            arr = [item3, item4, ...data, item0, item1];
        }

        return arr;
    }

    render() {
        let { style: { width }, pageWidth, data, pagePadding } = this.props;
        // let imageH = pageHeight || height;
        let imageW = pageWidth || width;
        data = this._changData(data);
        return (
            <View style={[this.props.style, { alignItems: 'center', justifyContent: 'center'}]}>
                    <ScrollView
                        style={{
                             paddingHorizontal: (width - imageW - pagePadding)/2
                        }}
                        ref={(ref) => {
                            this.scrollView = ref;
                        }}
                        removeClippedSubviews={false}
                        onScroll={this._onScroll.bind(this)}
                        onMomentumScrollEnd={this._onMomentumScrollEnd.bind(this)}
                        onScrollBeginDrag={this._onScrollBeginDrag.bind(this)}
                        onScrollEndDrag={this._onScrollEndDrag.bind(this)}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        // scrollEventThrottle={6}
                        // scrollEnabled={false}
                        horizontal={true}>
                        {data.map((item, index) => {
                            return (this._renderItem(item, index));
                        })}
                    </ScrollView>
            </View>
        );
    }
}

// const styles = StyleSheet.create({});
