/**
 * 秀场banner
 */
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    NativeModules,
    NativeEventEmitter
} from 'react-native';
import ScreenUtil from '../../utils/ScreenUtils';
import UIImage from '@mr/image-placeholder';

const { px2dp } = ScreenUtil;
import { observer } from 'mobx-react';
import { showBannerModules } from './Show';
import ScreenUtils from '../../utils/ScreenUtils';
import MRBannerView from '../../components/ui/bannerView/MRBannerView';
import { TrackApi } from '../../utils/SensorsTrack';
import { homeModule } from '../home/model/Modules';
import { homeType } from '../home/HomeTypes';
import DesignRule from '../../constants/DesignRule';

const { JSPushBridge } = NativeModules;
const JSManagerEmitter = new NativeEventEmitter(JSPushBridge);

const HOME_REFRESH = 'homeRefresh';
const width = ScreenUtils.width - px2dp(30);
const height = width * 160 / 345;
@observer
export default class ShowBannerView extends Component {
    state = {
        index: 0
    };

    renderRow = (item) => {
        return <View style={styles.imgView}>
            <UIImage style={styles.img} source={{ uri: item.image }}/>
        </View>;
    };

    _onPressRowWithItem = (item) => {
        let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode) || '';
        let params = homeModule.paramsNavigate(item);
        const { navigate } = this.props;

        TrackApi.BannerClick({
            bannerName: item.imgUrl,
            bannerId: item.id,
            bannerRank: item.rank,
            bannerType: item.linkType,
            bannerContent: item.linkTypeCode,
            bannerLocation: 32
        });

        navigate(router, { ...params });
    };

    _onPressRow = (e) => {
        let index = e.nativeEvent.index;
        const { bannerList } = showBannerModules;
        let item = bannerList[index];
        if (item) {
            let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode) || '';
            let params = homeModule.paramsNavigate(item);
            const { navigate } = this.props;
            TrackApi.BannerClick({
                bannerName: item.imgUrl,
                bannerId: item.id,
                bannerRank: item.rank,
                bannerType: item.linkType,
                bannerContent: item.linkTypeCode,
                bannerLocation: 32
            });
            navigate(router, { ...params });
        }
    };

    renderIndexView() {
        const { index } = this.state;
        const { bannerList } = showBannerModules;
        let items = [];
        for (let i = 0; i < bannerList.length; i++) {
            if (index === i) {
                items.push(<View key={i} style={styles.activityIndex}/>);
            } else {
                items.push(<View key={i} style={styles.index}/>);
            }
        }
        return <View style={styles.indexView}>
            {items}
        </View>;
    }

    _onDidScrollToIndex(e) {
        this.setState({ index: e.nativeEvent.index });
    }

    componentDidMount() {
        this.listenerBannerRefresh = JSManagerEmitter.addListener(HOME_REFRESH, (type) => {
            if (type === homeType.discover) {
                showBannerModules.loadBannerList();
            }
        });
    }

    componentWillUnmount() {
        this.listenerBannerRefresh && this.listenerBannerRefresh.remove();
    }

    render() {
        const { bannerList } = showBannerModules;

        // 此处需返回null，否则指示器有问题
        if (!bannerList || bannerList.length <= 0) {
            return null;
        }
        let items = [];
        bannerList.map(value => {
            items.push(value.image);
        });

        return <View style={{ height, marginTop: px2dp(10), marginBottom: px2dp(ScreenUtils.isIOS ? 5 : 0) }}>
            {
                bannerList.length === 1
                    ?
                    <TouchableWithoutFeedback onPress={() => this._onPressRowWithItem(bannerList[0])}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: px2dp(5),
                            overflow: 'hidden'
                        }}>
                            {this.renderRow(bannerList[0])}
                        </View>
                    </TouchableWithoutFeedback>
                    :

                    <MRBannerView
                        style={{
                            height: height,
                            width: ScreenUtils.width,
                            alignSelf: 'center'
                        }}
                        itemWidth={width + 0.5}
                        autoInterval={5}
                        itemSpace={px2dp(30)}
                        itemRadius={5}
                        imgUrlArray={items}
                        interceptTouchEvent={true}  //android端起作用，是否拦截touch事件
                        pageFocused={this.props.pageFocused}
                        onDidSelectItemAtIndex={(index) => {
                            this._onPressRow(index);
                        }}
                        onDidScrollToIndex={(index) => {
                            this._onDidScrollToIndex(index);
                        }}
                    />
            }
            {this.renderIndexView()}
        </View>;
    }
}

export { width, height };

let styles = StyleSheet.create({
    scroll: {
        height
    },
    swiper: {
        width: ScreenUtils.width,
        height
    },
    img: {
        width: ScreenUtil.width - px2dp(50),
        height,
        justifyContent: 'flex-end'
    },
    imgView: {
        height,
        borderRadius: px2dp(5),
        overflow: 'hidden'
    },
    item: {
        width: px2dp(280),
        height,
        marginLeft: px2dp(10)
    },
    space: {
        width: px2dp(10)
    },
    text: {
        color: '#fff',
        fontSize: px2dp(14)
    },
    mask: {
        position: 'absolute',
        width: ScreenUtil.width - 50,
        bottom: 0,
        height: px2dp(40)
    },
    textView: {
        width: ScreenUtil.width - 50,
        height: px2dp(40),
        alignItems: 'center',
        justifyContent: 'center'
    },
    indexView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -px2dp(10)
    },
    activityIndex: {
        width: px2dp(14),
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
    }
});
