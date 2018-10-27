/**
 * 首页轮播图
 */
import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtils;
import { observer } from 'mobx-react';
import { bannerModule, homeModule } from './Modules'
import XGSwiper from '../../components/ui/XGSwiper'

const bannerHeight = px2dp(220);

@observer
export default class HomeBannerView extends Component {
    constructor(props) {
        super(props);
        bannerModule.loadBannerList();
    }
    state = {
        index : 0
    }
    _renderViewPageItem = (item, index) => {
        return <Image source={{ uri: item.imgUrl }} style={styles.img} resizeMode="cover"/>
    }
    _onDidChange = (item, index) => {
        this.setState({index: index})
    }
    _onPressRow = (item) => {
        const router = homeModule.homeNavigate(item.linkType, item.linkTypeCode);
        let params = homeModule.paramsNavigate(item);
        const { navigation } = this.props;
        navigation.navigate(router, params);
    }
    render() {
        const { bannerList } = bannerModule;
        if (bannerList.length === 0) {
            return null;
        }
        return <View>
            <XGSwiper style={styles.swiper}
                dataSource={bannerList}
                width={ ScreenUtils.width }
                height={ bannerHeight }
                renderRow={this._renderViewPageItem.bind(this)}
                onPress={this._onPressRow.bind(this)}
                onDidChange={this._onDidChange.bind(this)}
                />
            {this.renderIndexView()}
        </View>
    }

    renderIndexView() {
        const { index } = this.state
        const { bannerCount } = bannerModule
        let items = []
        for (let i = 0; i < bannerCount; i++) {
            if (index === i) {
                items.push(<View key={i} style={styles.activityIndex}/>)
            } else {
                items.push(<View key={i} style={styles.index}/>)
            } 
        }
        return  <View style={styles.indexView}>
            {items}
        </View>
    }
}

const styles = StyleSheet.create({
    img: {
        height: bannerHeight,
        width: ScreenUtils.width
    },
    indexView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: ScreenUtils.width,
        height: px2dp(15)
    },
    activityIndex: {
        width: px2dp(24),
        height: px2dp(6),
        borderRadius: px2dp(3),
        backgroundColor: '#fff',
        marginLeft: px2dp(2.5),
        marginRight: px2dp(2.5)
    },
    index: {
        width: px2dp(6),
        height: px2dp(6),
        borderRadius: px2dp(3),
        backgroundColor: '#f4f4f4',
        marginLeft: px2dp(2.5),
        marginRight: px2dp(2.5)
    }
});
