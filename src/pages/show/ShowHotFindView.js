/**
 * 热门发现
 */
import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Waterfall from '../../components/ui/WaterFall';
import { observer } from 'mobx-react';
import { ShowRecommendModules, tag, showSelectedDetail } from './Show';
import ScreenUtils from '../../utils/ScreenUtils';
import EmptyUtils from '../../utils/EmptyUtils'
const { px2dp } = ScreenUtils;
import ItemView from './ShowHotItem';

const imgWidth = px2dp(168);

@observer
export default class ShowHotView extends Component {

    state = {
        isEnd: false,
        isFetching: false
    }

    constructor(props) {
        super(props);
        this.recommendModules = new ShowRecommendModules()
    }

    componentDidMount() {
        this.refreshing()
    }

    infiniting(done) {
        console.log('infiniting');
        setTimeout(() => {
            const {isFetching} = this.state
            if (isFetching) {
                return
            }
            this.setState({ isFetching: true})
            this.recommendModules.getMoreRecommendList().then(data => {
                console.log('infiniting'.data);
                if (data && data.length !== 0) {
                    this.waterfall.addItems(data);
                    this.setState({ isFetching: false})
                } else {
                    this.setState({ isFetching: false, isEnd: true})
                }
            });
            done();
        }, 1000);
    }

    // refreshing() {
    //     this.waterfall.index = 1
    //     this.setState({ isEnd: false, isFetching: true})
    //     this.recommendModules.loadRecommendList().then(data => {
    //         this.setState({ isFetching: false})
    //         this.waterfall.clear();
    //         this.waterfall.addItems(data);
    //     });
    // }

    refreshing(done) {
        let currentDate = new Date()
        this.setState({ isEnd: false, isFetching: true})
        this.recommendModules.isEnd = false
        setTimeout(() => {
            this.waterfall && this.waterfall.clear();
            this.recommendModules.fetchRecommendList({}, currentDate, 1).then(data => {
                this.setState({ isFetching: false})
                this.waterfall.index = 1
                this.waterfall.addItems(data);
            });
            done && done();
        }, 1000);
    }

    _gotoDetail(data) {
        const { navigate } = this.props;
        data.click = data.click + 1
        // this.recommendModules.recommendList.replace
        showSelectedDetail.selectedShowAction(data, this.recommendModules.type)
        navigate && navigate('show/ShowDetailPage', { id: data.id });
    }

    renderItem = (data) => {
        let imgWide = 1
        let imgHigh = 1
        let img = ''
        if (data.generalize === tag.New || data.generalize === tag.Recommend) {
            imgWide = EmptyUtils.isEmpty(data.coverImgWide) ? 1 : data.coverImgWide;
            imgHigh = EmptyUtils.isEmpty(data.coverImgHigh) ? 1 : data.coverImgHigh;
            img = data.coverImg
        } else {
            imgWide = data.imgWide ? data.imgWide : 1;
            imgHigh = data.imgHigh ? data.imgHigh : 1;
            img = data.img
        }
        let imgHeight = (imgHigh / imgWide) * imgWidth;
       
        // const itemHeight = this._getHeightForItem({item})
        return <ItemView imageStyle={{ height: imgHeight }} data={data} press={() => this._gotoDetail(data)} imageUrl={ img }/>;
    };
    _keyExtractor = (data) => data.id + '' + data.currentDate;

    _renderInfinite() {
        return <View style={{justifyContent: 'center', alignItems: 'center', height: 50}}>
            {this.state.isEnd ? <Text style={styles.text} allowFontScaling={false}>我也是有底线的</Text> : this.state.isFetching ? <Text style={styles.text} allowFontScaling={false}>加载中...</Text> : <Text style={styles.text} allowFontScaling={false}>加载更多</Text>}
        </View>
    }

    render() {
        return (
            <View style={styles.container}>
                <Waterfall
                    space={10}
                    ref={(ref) => {
                        this.waterfall = ref;
                    }}
                    columns={2}
                    infinite={true}
                    hasMore={true}
                    renderItem={item => this.renderItem(item)}
                    containerStyle={{ marginLeft: 15, marginRight: 15 }}
                    keyExtractor={(data) => this._keyExtractor(data)}
                    infiniting={(done) => this.infiniting(done)}
                    refreshing={(done) => this.refreshing(done)}
                    showsVerticalScrollIndicator={false}
                    renderInfinite={()=> this._renderInfinite()}
                />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: px2dp(12)
    },
    text: {
        color: '#999',
        fontSize: px2dp(11)
    }
});
