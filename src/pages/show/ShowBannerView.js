/**
 * 秀场banner
 */
import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import ScreenUtil from '../../utils/ScreenUtils';
import UIImage from "@mr/image-placeholder";

const { px2dp } = ScreenUtil;
import { observer } from 'mobx-react';
import { showBannerModules, showSelectedDetail } from './Show';
import ScreenUtils from '../../utils/ScreenUtils';
import MRBannerView from '../../components/ui/bannerView/MRBannerView';

@observer
export default class ShowBannerView extends Component {
    state = {
        index: 0
    };

    renderRow(item) {
        return <View style={styles.imgView}>
            <UIImage style={styles.img} source={{ uri: item.imgUrl }}/>
        </View>;
    }

    _onPressRowWithItem(item) {
        const router = showBannerModules.bannerNavigate(item.linkType, item.linkTypeCode);
        let params = showBannerModules.paramsNavigate(item);
        const { navigate } = this.props;
        navigate(router, params);
    }

    _onPressRow(e) {
        showSelectedDetail.selectedShowAction(1, showBannerModules.type);
        let index = e.nativeEvent.index;
        const { bannerList } = showBannerModules;
        let item = bannerList[index];
        const router = showBannerModules.bannerNavigate(item.linkType, item.linkTypeCode);
        let params = showBannerModules.paramsNavigate(item);
        const { navigate } = this.props;
        navigate(router, params);
    }

    renderIndexView() {
        const { index } = this.state;
        const { bannerCount } = showBannerModules;
        let items = [];
        for (let i = 0; i < bannerCount; i++) {
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
c
    _onDidChange(item, changeIndex) {
        const { index } = this.state;
        if (index !== changeIndex) {
            this.setState({ index: changeIndex });
        }
    }

    render() {
        const { bannerList, bannerCount } = showBannerModules;
        if (!bannerList || bannerList.length <= 0) {
            return <View/>;
        }
        let items = [];
        bannerList.map(value => {
            items.push(value.imgUrl);
        });
        return <View style={styles.container}>
        {
            bannerCount === 1
            ?
            <TouchableWithoutFeedback onPress={()=>this._onPressRowWithItem(bannerList[0])}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                {this.renderRow(bannerList[0])}
            </View>
            </TouchableWithoutFeedback>
            :
            <MRBannerView
                style={{
                    height: px2dp(175),
                    width: ScreenUtils.width
                }}
                imgUrlArray={items}
                itemWidth={px2dp(300)}
                itemSpace={px2dp(10)}
                itemRadius={5}
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

let styles = StyleSheet.create({
    container: {
        height: px2dp(200),
        marginTop: px2dp(10),
        width: ScreenUtils.width
    },
    scroll: {
        height: px2dp(175)
    },
    swiper: {
        width: ScreenUtils.width,
        height: px2dp(175)
    },
    img: {
        width: ScreenUtil.width - px2dp(50),
        height: px2dp(175),
        justifyContent: 'flex-end'
    },
    imgView: {
        height: px2dp(175),
        borderRadius: px2dp(5),
        overflow: 'hidden'
    },
    item: {
        width: px2dp(280),
        height: px2dp(175),
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
        marginTop: px2dp(10)
    },
    activityIndex: {
        width: 14,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#A9B4BC',
        margin: 3
    },
    index: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#DDE1E4',
        margin: 3
    }
});
