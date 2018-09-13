import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';

/**
 * 商品详情头部view
 */

export default class DetailHeaderView extends Component {
    static propTypes = {
        // clickItemAction: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            imgList: [{}, {}, {}, {}]
        };
    }

    _renderImageItem = (item, index) => {
        const { img_url } = item;
        return (
            <TouchableWithoutFeedback key={index} onPress={() => this._clickItem(item)}>
                <View style={{ flex: 1, backgroundColor: 'red' }}>
                    {
                        img_url ? <Image
                            style={{ flex: 1, width: ScreenUtils.width, height: ScreenUtils.autoSizeWidth(237) }}
                            resizeMode="stretch"
                            source={{ uri: img_url }}/> : null
                    }
                </View>
            </TouchableWithoutFeedback>
        );
    };

    render() {
        return (
            <View>
                <Swiper
                    autoplay
                    horizontal
                    autoplayTimeout={3000}
                    height={ScreenUtils.autoSizeWidth(377)}
                    loop={this.state.imgList.length > 1}
                    dot={<View style={styles.dot}/>}
                    activeDot={<View style={styles.activeDot}/>}
                >
                    {this.state.imgList.map(this._renderImageItem)}
                </Swiper>
                <View style={{ backgroundColor: 'white' }}>
                    <View style={{ marginLeft: 16, width: ScreenUtils.width - 32 }}>
                        <Text style={{ marginTop: 14 }}>创意抱枕午睡枕沙发床头靠枕腰靠垫办公室椅子大靠
                            背汽车车用腰枕 拷贝</Text>
                        <View style={{ flexDirection: 'row', marginTop: 21 }}>
                            <Text>￥1889.99起</Text>
                            <Text style={{ marginLeft: 5 }}>¥2600.00</Text>
                            <Text style={{ marginLeft: 5, backgroundColor: 'red' }}>拼店价</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 18, marginBottom: 14 }}>
                            <Text>包邮</Text>
                            <Text>月销售154335笔</Text>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: 'white', marginTop: 10, marginBottom: 12 }}>
                    <View style={{
                        flexDirection: 'row',
                        marginLeft: 16,
                        width: ScreenUtils.width - 32,
                        marginVertical: 13
                    }}>
                        <Text>服务</Text>
                        <Text style={{ marginLeft: 11 }}>正品保证·急速发货 7天无理由退换</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    activeDot: {
        backgroundColor: 'white',
        width: 12,
        height: 2,
        marginLeft: 3,
        marginRight: 3
    },
    dot: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        width: 12,
        height: 2,
        marginLeft: 3,
        marginRight: 3
    }
});
