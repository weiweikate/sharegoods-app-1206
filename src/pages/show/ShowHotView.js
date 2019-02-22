/**
 * 精选热门
 */
import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
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
import ShowGroundView from './components/ShowGroundView';

@observer
export default class ShowHotView extends PureComponent {

    state = {
        isEnd: false,
        isFetching: false,
        hasRecommend: false,
        isScroll: false
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

    renderHeader = () => {
        const { hasRecommend } = this.state;
        return (<View style={{backgroundColor: '#f5f5f5', height: showBannerModules.bannerHeight + showChoiceModules.choiceHeight + px2dp(116), width: ScreenUtils.width}}>
                <ShowBannerView navigate={this.props.navigate} pageFocused={this.props.pageFocus}/>
                <ShowChoiceView navigate={this.props.navigate} ref={(ref)=> {this.choiceView = ref}}/>
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

    render() {
        return (
            <View style={styles.container}>
                <ShowGroundView style={{flex:1}}
                    uri={'/discover/query@GET'}
                    renderHeader={this.renderHeader}
                    onStartRefresh={()=> {}}
                    params={{generalize: tag.Recommend + ''}}
                    onStartScroll={()=> {
                        console.log('_onChoiceAction star' )
                       this.choiceView && this.choiceView.changeIsScroll(true)
                        // this.choiceView && this.choiceView.isScroll = true;
                    }}
                    onEndScroll={() => {

                        console.log('_onChoiceAction end1' )
                        setTimeout(()=> {
                            this.choiceView && this.choiceView.changeIsScroll(false)
                        }, 700)
                    }}
                    onItemPress={({nativeEvent})=> {
                        const { navigate } = this.props;
                        navigate('show/ShowDetailPage', { id: nativeEvent.id, code: nativeEvent.code });}}
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
