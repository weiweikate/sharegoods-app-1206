import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';

const { width, px2dp } = ScreenUtils;
const imageHeight = width;
import ViewPager from '../../components/ui/ViewPager';
import ImageLoad from '@mr/image-placeholder'
import {
    MRText as Text,
} from '../../components/ui';

const renderPagination = (index, total) => <View style={styles.indexView}>
    <Text style={styles.text} allowFontScaling={false}>{index + 1} / {total}</Text>
</View>;

export default class ShowImageView extends Component {

    state = {
        pageIndex: 0,
        total: 2,
        items:[]
    };

    constructor(props) {
        super(props)
        this.state.items = this.props.items
    }

    componentWillReceiveProps(nextProps) {
        const {items} = nextProps
        console.log('componentWillReceiveProps', items, this.state.items)
        if (items && items.length !== this.state.items.length) {
            this.state.items = items
        }
    }

    _renderViewPageItem(item) {
        return <ImageLoad style={styles.image} source={{ uri: item }} resizeMode='contain'/>;
    }

    render() {
        let items = this.state.items;
        if (!items) {
            return <View/>;
        }
        return <View style={styles.wrapper}>
            <ViewPager
                swiperShow={true}
                arrayData={items}
                renderItem={this._renderViewPageItem.bind(this)}
                autoplay={true}
                loop={false}
                height={imageHeight}
                renderPagination={renderPagination}
                index={0}
                scrollsToTop={true}
            />
        </View>;
    }
}

let styles = StyleSheet.create({
    wrapper: {
        width: width,
        height: imageHeight
    },
    image: {
        width: width,
        height: imageHeight
    },
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
