/**
 * 精选热门
 */
import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
// import Waterfall from '../../components/ui/WaterFall';
import ShowBannerView from './ShowBannerView';
import ShowChoiceView from './ShowChoiceView';
import {
    MRText as Text
} from '../../components/ui';
import { observer } from 'mobx-react';
import { ShowRecommendModules, tag, showBannerModules, showChoiceModules } from './Show';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from '../../constants/DesignRule';

const { px2dp } = ScreenUtils;
import ItemView from './ShowHotItem';
import ShowGroundView from './components/ShowGroundView';

const imgWidth = (ScreenUtils.width - px2dp(40)) / 2;

@observer
export default class ShowHotView extends PureComponent {

    state = {
        isEnd: false,
        isFetching: false,
        hasRecommend: false
    };

    constructor(props) {
        super(props);
        this.firstLoad = true;
        this.recommendModules = new ShowRecommendModules();
    }

    componentDidMount() {
        if (this.firstLoad === true) {
            console.log('ShowHotView firstLoad');
            this.loadData();
        }
    }

    infiniting(done) {
        setTimeout(() => {
            const { isFetching } = this.state;
            if (isFetching) {
                return;
            }
            this.setState({ isFetching: true });
            this.recommendModules.getMoreRecommendList({ generalize: tag.Recommend }).then(data => {
                if (data && data.length !== 0) {
                    this.waterfall && this.waterfall.addItems(data);
                    this.setState({ isFetching: false });
                } else {
                    this.setState({ isFetching: false, isEnd: true });
                }
            });
            done();
        }, 1000);
    }

    refresh() {
        console.log('ShowHotView refresh ');
        if (this.firstLoad === true) {
            return;
        }
        this.loadData();
    }

    loadData() {
        this.setState({ isEnd: false, isFetching: true });
        this.waterfall && this.waterfall.scrollToTop();
        this.waterfall && (this.waterfall.index = 1);
        this.waterfall && this.waterfall.clear();
        this.recommendModules.loadRecommendList({ generalize: tag.Recommend, size: 10 }).then(data => {
            this.firstLoad = false;
            let hasRecommend = false;
            console.log('loadRecommendList', data);
            if (data && data.length > 0) {
                hasRecommend = true;
            }
            this.setState({ isFetching: false, hasRecommend: hasRecommend });
            this.waterfall && this.waterfall.addItems(data || []);
        }).catch(() => {
            this.setState({ isFetching: false, hasRecommend: false });
        });
    }

    refreshing(done) {
        setTimeout(() => {
            this.waterfall && this.waterfall.clear();
            this.recommendModules.loadRecommendList({ generalize: tag.Recommend }).then(data => {
                this.waterfall && this.waterfall.addItems(data || []);
            });
            done();
        }, 1000);
    }

    _gotoDetail(data) {
        const { navigate } = this.props;
        navigate('show/ShowDetailPage', { id: data.id, code: data.code });
    }

    renderItem = (data) => {
        let imgWide = 1;
        let imgHigh = 1;
        if (data.coverImg) {
            imgWide = data.coverImgWide ? data.coverImgWide : 1;
            imgHigh = data.coverImgHigh ? data.coverImgHigh : 1;
        } else {
            imgWide = data.imgWide ? data.imgWide : 1;
            imgHigh = data.imgHigh ? data.imgHigh : 1;
        }
        let imgHeight = (imgHigh / imgWide) * imgWidth;
        return <ItemView
            imageStyle={{ height: imgHeight }}
            data={data}
            press={() => {
                this._gotoDetail(data);
            }}
            imageUrl={data.coverImg}
        />;
    };
    renderHeader = () => {
        const { hasRecommend } = this.state;
        return (<View style={{backgroundColor: '#f5f5f5', height: showBannerModules.bannerHeight + showChoiceModules.choiceHeight + px2dp(116), width: ScreenUtils.width}}>
                <ShowBannerView navigate={this.props.navigate} pageFocused={this.props.pageFocus}/>
                <ShowChoiceView navigate={this.props.navigate}/>
                {/*<ShowHotScrollView navigation={this.props.navigation}/>*/}
                {
                    hasRecommend
                        ?
                        <View style={styles.titleView}>
                            <Text style={styles.recTitle} allowFontScaling={false}>推荐</Text>
                        </View>
                        :
                        null
                }
            </View>
        )
    };
    _keyExtractor = (data) => data.code + '';

    _renderInfinite() {
        const { hasRecommend } = this.state;
        if (!hasRecommend) {
            return <View/>;
        }
        let bottomStr = this.state.isEnd ? '我也是有底线的' : (this.state.isFetching
            ? '加载中...' : '加载更多');
        return <View style={{ justifyContent: 'center', alignItems: 'center', height: 50 }}>
            <Text style={styles.text} allowFontScaling={false}>{bottomStr}</Text>
        </View>;
    }

    render() {
        let that = this;
        return (
            <View style={styles.container}>
                {/*<Waterfall*/}
                    {/*space={10}*/}
                    {/*ref={(ref) => {*/}
                        {/*this.waterfall = ref;*/}
                    {/*}}*/}
                    {/*columns={2}*/}
                    {/*infinite={true}*/}
                    {/*hasMore={true}*/}
                    {/*renderItem={item => this.renderItem(item)}*/}
                    {/*// renderInfinite={loading => this.renderLoadMore(loading)}*/}
                    {/*renderHeader={() => this.renderHeader()}*/}
                    {/*containerStyle={{ marginLeft: 15, marginRight: 15 }}*/}
                    {/*keyExtractor={(data) => this._keyExtractor(data)}*/}
                    {/*infiniting={(done) => this.infiniting(done)}*/}
                    {/*showsVerticalScrollIndicator={false}*/}
                    {/*refreshing={(done) => this.refreshing(done)}*/}
                    {/*renderInfinite={() => this._renderInfinite()}*/}
                {/*/>*/}
                <ShowGroundView style={{flex:1}}
                                uri={'/discover/query@GET'}
                                renderHeader={this.renderHeader}
                                onStartRefresh={()=> {}}
                                params={{generalize: tag.Recommend + ''}}
                                onItemPress={({nativeEvent})=> {

                                    that.$navigate('show/ShowDetailPage', { id: nativeEvent.id, code: nativeEvent.code });}}
                />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    titleView: {
        height: px2dp(53),
        alignItems: 'center',
        justifyContent: 'center'
    },
    recTitle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(19),
        fontWeight: '600'
    },
    text: {
        color: '#999',
        fontSize: px2dp(11),
        height: 100,
        width: 100
    },
    container: {
        flex: 1
    }
});
