import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';

const { width, px2dp } = ScreenUtils;
import ViewPager from '../../components/ui/ViewPager';
import ImageLoad from '@mr/image-placeholder';
import {
    MRText as Text
} from '../../components/ui';
import ShowUtils from './utils/ShowUtils';
const maxHeight = ScreenUtils.height*0.72;
const minHeight = ScreenUtils.height*0.36;
export default class ShowImageView extends Component {

    state = {
        items: []
    };

    constructor(props) {
        super(props);
        this.index = 0;
        this.imageHeight = width;
        this.heights = [];
        let changeHeight = true;
        this.state.items = this.props.items.map((value) => {
            if (value.url.indexOf('?') === -1) {
                changeHeight = false;
            } else {
                let params = ShowUtils.getUrlVars(value.url);
                let height = params.height;
                let width = params.width;
                if (height && width) {
                    this.getHeightWithSize(width, height);
                } else {
                    changeHeight = false;
                }
            }
            return value.url;
        });

        if(changeHeight){
            this.heights.sort((a,b)=>{
                return a-b;
            });

            this.imageHeight = this.heights[0];

        }
    }


    getHeightWithSize = (width, height) => {
        let h = height * ScreenUtils.width / width;
        h = h < minHeight ? minHeight : h;
        h = h > maxHeight ? maxHeight : h;
        this.heights.push(h);
    };


    componentWillReceiveProps(nextProps) {
        const { items } = nextProps;
        if (items && items.length !== this.state.items.length) {
            this.state.items = items;
        }
    }

    _renderPagination(index, total) {
        this.index = index;
        return <View style={styles.indexView}>
            <Text style={styles.text} allowFontScaling={false}>{index + 1} / {total}</Text>
        </View>;
    }

    _renderViewPageItem(item) {
        return <TouchableWithoutFeedback onPress={() => this.props.onPress(this.state.items, this.index)}>
            <View>
                <ImageLoad style={ {
                    width: width,
                    height: this.imageHeight
                }} source={{ uri: item }} resizeMode='contain'/>
            </View>
        </TouchableWithoutFeedback>;
    }

    render() {
        let items = this.state.items;
        if (!items) {
            return <View/>;
        }
        return <View style={{
            width: width,
            height: this.imageHeight
        }}>
            <ViewPager
                swiperShow={true}
                arrayData={items}
                renderItem={this._renderViewPageItem.bind(this)}
                autoplay={true}
                loop={false}
                height={this.imageHeight}
                renderPagination={this._renderPagination.bind(this)}
                index={0}
                scrollsToTop={true}
            />
        </View>;
    }
}

let styles = StyleSheet.create({
    indexView: {
        width: px2dp(43),
        height: px2dp(20),
        borderRadius: px2dp(10),
        position: 'absolute',
        right: px2dp(14),
        bottom: px2dp(20),
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: '#fff',
        fontSize: px2dp(10)
    }
});
