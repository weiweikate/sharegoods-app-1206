/**
 * 精选热门
 */
import React, { PureComponent } from 'react';
import { View, StyleSheet,Platform } from 'react-native';
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
        this.state = {
            headerView:null
        }

    }

    componentDidMount() {
        if (this.firstLoad === true) {
            console.log('ShowHotView firstLoad');
            this.loadData();
        }
    }

    refresh() {
        console.log('ShowHotView refresh ');
        if (this.firstLoad === true) {
            return;
        }
        this.loadData();
    }

    loadData() {
        showChoiceModules.loadChoiceList().then(data => {

            if (Platform.OS !== 'ios') {
                this.setState({
                    headerView:this.renderHeader()
                })
            }
        });
        showBannerModules.loadBannerList();
    }

    _gotoDetail(data) {
        const { navigate } = this.props;
        navigate('show/ShowDetailPage', { id: data.id, code: data.code });
    }

    renderHeader = () => {
        return (<View style={{backgroundColor: '#f5f5f5',  width: ScreenUtils.width}}>
                <ShowBannerView navigate={this.props.navigate} pageFocused={this.props.pageFocus}/>
                <ShowChoiceView navigate={this.props.navigate} ref={(ref)=> {this.choiceView = ref}}/>
                <View style={styles.titleView}>
                    <Text style={styles.recTitle} allowFontScaling={false}>推荐</Text>
                </View>
            </View>
        )
    };

    render() {
        return (
            <View style={styles.container}>
                <ShowGroundView style={{flex:1}}
                    uri={'/discover/query@GET'}
                                headerHeight={showBannerModules.bannerHeight + showChoiceModules.choiceHeight + px2dp(116)}
                    renderHeader={Platform.OS === 'ios' ? this.renderHeader() : this.state.headerView}
                    onStartRefresh={()=> {
                        this.loadData()

                    }}
                    params={{generalize: tag.Recommend + ''}}
                    onStartScroll={()=> {
                        console.log('_onChoiceAction star' )
                       this.timer && clearTimeout(this.timer)
                       this.choiceView && this.choiceView.changeIsScroll(true)
                        // this.choiceView && this.choiceView.isScroll = true;
                    }}
                    onEndScroll={() => {

                        console.log('_onChoiceAction end1' )
                      this.timer = setTimeout(()=> {
                            this.choiceView && this.choiceView.changeIsScroll(false)
                        }, 500)
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
