/**
 * 精品推荐
 */
import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import ScreenUtil from '../../utils/ScreenUtils';
import MRBannerView from '../../components/ui/bannerView/MRBannerView';

const { px2dp } = ScreenUtil;
import { observer } from 'mobx-react';
import { homeModule } from './Modules';
import DesignRule from '../../constants/DesignRule';
import { recommendModule } from './HomeRecommendModel';
import HomeTitleView from './HomeTitleView';

export const recommendHeight = px2dp(240);

@observer
export default class HomeRecommendView extends Component {

    state = {
        index: 0
    };

    _onPressRow(e) {
        let index = e.nativeEvent.index;
        const { recommendList } = recommendModule;
        let item = recommendList[index];
        let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode);
        const { navigate } = this.props;
        let params = homeModule.paramsNavigate(item);
        navigate(router, { ...params, preseat: 'home_recommend' });
    }

    _onDidScrollToIndex(e) {
        this.setState({ index: e.nativeEvent.index });
    }

    renderIndexView() {
        const { index } = this.state;
        const { recommendList } = recommendModule;
        let items = [];
        for (let i = 0; i < recommendList.length; i++) {
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

    render() {
        const { recommendList } = recommendModule;

        if (recommendList.length === 0) {
            return <View/>;
        }

        let items = [];
        recommendList.map((item, index) => {
            items.push(item.imgUrl);
        });
        return <View style={styles.container}>
            <HomeTitleView title={'精品推荐'}/>
            {
                recommendList.length === 1
                    ?
                    <TouchableWithoutFeedback onPress={() => this._onPressRowWithItem(recommendList[0])}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            {this.renderRow(recommendList[0])}
                        </View>
                    </TouchableWithoutFeedback>
                    :
                    <MRBannerView
                        style={{
                            height: px2dp(160),
                            width: ScreenUtil.width - px2dp(30)
                        }}
                        imgUrlArray={items}
                        itemWidth={px2dp(295)}
                        itemSpace={px2dp(10)}
                        itemRadius={5}
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
        height: px2dp(225),
        marginTop: px2dp(15),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        width: ScreenUtil.width - px2dp(30),
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#fff'
    },
    scroll: {
        height: px2dp(175)
    },
    text: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(13),
        marginTop: px2dp(10)
    },
    indexView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    activityIndex: {
        width: px2dp(10),
        height: px2dp(3),
        borderRadius: px2dp(1.5),
        backgroundColor: '#FF0050',
        margin: 2
    },
    index: {
        width: px2dp(5),
        height: px2dp(3),
        borderRadius: px2dp(1.5),
        backgroundColor: '#E4E4E4',
        margin: 2
    }
});
