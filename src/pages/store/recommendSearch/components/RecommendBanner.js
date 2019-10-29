import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MRBannerView from '../../../../components/ui/bannerView/MRBannerView';
import DesignRule from '../../../../constants/DesignRule';
import { bannerModule } from '../PinShopBannerModel';
import { observer } from 'mobx-react';

const { px2dp } = ScreenUtils;

@observer
export class RecommendBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        };
    }

    renderIndexView() {
        const { index } = this.state;
        const { bannerList } = bannerModule;
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

    _onPress = (item) => {
        this.props.onPress && this.props.onPress(item);
    };

    _onDidScrollToIndex(e) {
        this.setState({ index: e.nativeEvent.index });
    }

    render() {
        const { bannerList } = bannerModule;
        if (bannerList.length === 0) {
            return null;
        }

        let items = [];
        bannerList.map(value => {
            items.push(value.image);
        });

        return (
            <View>
                <MRBannerView style={styles.bannerView}
                              interceptTouchEvent={true}//android端起作用，是否拦截touch事件
                              itemWidth={px2dp(345) + 0.5}
                              itemSpace={0}
                              imgUrlArray={items}
                              onDidSelectItemAtIndex={(e) => {
                                  bannerList[e.nativeEvent.index] && this._onPress(bannerList[e.nativeEvent.index]);
                              }}
                              onDidScrollToIndex={(index) => {
                                  this._onDidScrollToIndex(index);
                              }}/>
                {this.renderIndexView()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bannerView: {
        height: px2dp(345) * 460 / 750, width: px2dp(345) + 0.5, borderRadius: 5, overflow: 'hidden',
        alignSelf: 'center'
    },

    indexView: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        width: ScreenUtils.width,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    activityIndex: {
        width: 14,
        height: 4,
        borderRadius: 2,
        backgroundColor: DesignRule.mainColor,
        margin: 3
    },
    index: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'white',
        margin: 3
    }
});


export default RecommendBanner;
