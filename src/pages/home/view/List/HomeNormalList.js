/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/8/9.
 *
 */


'use strict';

import React from 'react';

import { Image, TouchableWithoutFeedback, View } from 'react-native';
import { DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import StickyContainer from 'recyclerlistview/sticky';

import { MRText } from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import HomeAPI from '../../api/HomeAPI';
import ImageLoader from '@mr/image-placeholder';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { DefaultLoadMoreComponent } from '../../../../comm/components/RefreshFlatList';
import RouterMap, { routePush } from '../../../../navigation/RouterMap';
import { track, trackEvent } from '../../../../utils/SensorsTrack';
import res from '../../res';
import HeaderLoading from '../../../../comm/components/lottieheader/ListHeaderLoading';
import { observer } from 'mobx-react';
import { tabModel } from '../../model/HomeTabModel';
import { getSGscm, getSGspm_home, HomeSource, SGscmSource } from '../../../../utils/OrderTrackUtil';
import { asyncHandleTopicData, homeType } from '../../HomeTypes';
import { TopicImageAdView } from '../TopicImageAdView';
import GoodsCustomView from '../GoodsCustomView';
import TextCustomView from '../TextCustomView';

const autoSizeWidth = ScreenUtils.autoSizeWidth;

class GoodView extends React.PureComponent {

    render(){
        let item = this.props.data;
        return (
            <View style={{
                flexDirection: 'row',
                paddingLeft: ScreenUtils.autoSizeWidth(10),
                marginTop: ScreenUtils.autoSizeWidth(4)
            }}>
                {item.map(good => {
                    return (
                        <TouchableWithoutFeedback
                            onPress={() => {
                                routePush(RouterMap.ProductDetailPage, { productCode: good.prodCode });
                                track(trackEvent.CategoryBtnClick, {
                                    firstCategoryId: this.props.p.firstCategoryId,
                                    firstCategoryName: this.props.p.navName,
                                    contentValue: good.name,
                                    contentType: 3,
                                    contentKey: good.prodCode
                                });
                            }}

                        >
                            <View style={{
                                width: ScreenUtils.autoSizeWidth(170),
                                height: ScreenUtils.autoSizeWidth(246),
                                backgroundColor: 'white',
                                borderRadius: 4,
                                overflow: 'hidden',
                                marginLeft: ScreenUtils.autoSizeWidth(5)
                            }}>
                                <Image style={{
                                    width: ScreenUtils.autoSizeWidth(170),
                                    height: ScreenUtils.autoSizeWidth(170)
                                }}
                                       source={{ uri: good.imgUrl }}
                                />
                                <MRText style={{
                                    fontSize: ScreenUtils.autoSizeWidth(12),
                                    color: DesignRule.textColor_mainTitle,
                                    marginTop: ScreenUtils.autoSizeWidth(10),
                                    marginHorizontal: ScreenUtils.autoSizeWidth(10)
                                }}
                                        numberOfLines={2}
                                >{good.name}</MRText>
                                <MRText style={{
                                    fontSize: autoSizeWidth(12),
                                    color: DesignRule.mainColor,
                                    marginLeft: autoSizeWidth(10),
                                    marginTop: autoSizeWidth(3)
                                }}>
                                    ¥<MRText style={{
                                    fontSize: autoSizeWidth(14),
                                    color: DesignRule.mainColor, fontWeight: '600'
                                }}>{good.promotionMinPrice || good.minPrice}</MRText>起
                                </MRText>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                })}
            </View>
        );
    }
}

class IconView extends React.PureComponent {

    render(){
        let item = this.props.data;
        return(
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                paddingLeft: ScreenUtils.autoSizeWidth(10),
                backgroundColor: 'white'
            }}>
                {item.map((icon) => {
                    return (
                        <TouchableWithoutFeedback onPress={() => {
                            let p = {};
                            if (icon.linkType === 'all') {
                                routePush(RouterMap.CategorySearchPage, { typeId: this.props.p.firstCategoryId });
                                p = { contentType: 10, contentKey: '' };
                            }

                            if (icon.linkType === 1) {
                                routePush(RouterMap.SearchResultPage, { categoryId: icon.linkCode });
                                p = { contentType: 12, contentKey: icon.linkCode };
                            }
                            if (icon.linkType === 2) {
                                routePush('HtmlPage', { uri: '/custom/' + icon.linkCode });
                                p = { contentType: 3, contentKey: icon.linkCode };

                            }
                            track(trackEvent.CategoryBtnClick, {
                                firstCategoryId: this.props.p.firstCategoryId,
                                firstCategoryName: this.props.p.navName,
                                contentValue: icon.iconName,
                                ...p
                            });
                        }}>
                            <View style={{
                                alignItems: 'center',
                                height: ScreenUtils.autoSizeWidth(93),
                                width: ScreenUtils.autoSizeWidth(73) - 0.5
                            }}>
                                {typeof (icon.iconImage) === 'string' ? <ImageLoader style={{
                                        width: ScreenUtils.autoSizeWidth(60),
                                        height: ScreenUtils.autoSizeWidth(60)
                                    }}
                                                                                     source={{ uri: icon.iconImage }}
                                    /> :
                                    <Image style={{
                                        width: ScreenUtils.autoSizeWidth(60),
                                        height: ScreenUtils.autoSizeWidth(60)
                                    }}
                                           source={icon.iconImage}/>}
                                <MRText style={{
                                    fontSize: ScreenUtils.autoSizeWidth(12),
                                    height: ScreenUtils.autoSizeWidth(20),
                                    color: '#333333',
                                    marginTop: ScreenUtils.autoSizeWidth(5)
                                }}>{icon.iconName}</MRText>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                })}
            </View>
        )
    }

}

class HeaderView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            index: props.index || 0
        };
    }

    render() {
        let { index } = this.state;
        return (
            <View style={{
                height: 50,
                backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                <TouchableWithoutFeedback onPress={() => this.onPress(0)}>
                    <MRText style={{
                        fontSize: autoSizeWidth(15),
                        color: index === 0 ? DesignRule.mainColor : DesignRule.textColor_instruction
                    }}>综合</MRText>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this.onPress(1)}>
                    <MRText style={{
                        fontSize: autoSizeWidth(15),
                        color: index === 1 ? DesignRule.mainColor : DesignRule.textColor_instruction
                    }}>销量</MRText>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this.onPress(this.state.index === 2 ? 3 : 2)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MRText style={{
                            fontSize: autoSizeWidth(15),
                            color: (index === 2 || index === 3) ? DesignRule.mainColor : DesignRule.textColor_instruction
                        }}>价格</MRText>
                        <View style={{ marginLeft: 2 }}>
                            <Image source={res.arrow_top} style={{
                                height: 6,
                                width: 6,
                                marginBottom: 3,
                                tintColor: index === 3 ? DesignRule.mainColor : DesignRule.textColor_instruction
                            }}/>
                            <Image source={res.arrow_bottom} style={{
                                height: 6,
                                width: 6,
                                tintColor: index === 2 ? DesignRule.mainColor : DesignRule.textColor_instruction
                            }}/>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    onPress(index) {
        if (index === this.state.index) {
            return;
        }
        this.setState({ index });
        this.props.onPress(index);
    }
}

@observer
export default class HomeNormalList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [{type: 'header'}],
            footerStatus: 'hidden',
            refreshing: false,
        };
        this.itemData = [];
        this.header = [{type: 'header'}]
        this.goods = [];
        this.topicList = [];

        this.index = 0;
        this.isRefreshing = true;
        this.isLoadMore = false;
        this.page = 1;
        //排序类型(1.综合 2.销量 3. 价格)
        this.sort = 0;
        //     //排序方式 (1.升序 2.降序)
        // this.sortModel = 2;
    }

    componentDidMount() {
        this.refreshData(true);
    }

    /**
     * 处理icon数据逻辑
     * 1.超出一行，不满2行，显示一行
     * 2.超出2行，显示2行
     * 3.未满一行，有多少显示多少
     * 4.末尾加《全部分类》
     * @param itemData
     */
    handleItemData=(itemData)=> {
        let count = itemData.length;
        if (count === 0) {
            itemData = [];
        } else if (count <= 8) {
            count = count >= 4 ? 4 : count;
            itemData = itemData.slice(0, count);
            itemData.push({
                'iconName': '查看更多',
                'iconImage': res.more,
                'linkType': 'all'
            });
        } else {
            itemData = itemData.slice(0, 9);
            itemData.push({
                'iconName': '查看更多',
                'iconImage': res.more,
                'linkType': 'all'
            });
        }
        this.itemData = [{type: 'icon', data: itemData}];
        this.changeData();
    }

    changeData= ()=>{
        this.setState({data: [...this.itemData,...this.topicList,...this.header, ...this.goods]})
    }

    changeIndex(index) {
        this.index = index;
        switch (index) {
            case 0:
                // alert('综合')
                this.sort = 0;
                break;
            case 1:
                // alert('销量')
                this.sort = 1;
                break;
            case 2:
                this.sort = 2;
                break;
            case 3:
                this.sort = 3;
                break;
        }
        this.refreshData(true);
    }

    dataProvider = new DataProvider((r1, r2) => {
        if (r1.type === 'header' && r2.type === 'header') {
            return false;
        }
        return r1 !== r2;
    });

    layoutProvider = new LayoutProvider((i) => {
        return this.dataProvider.getDataForIndex(i) || {};
    }, (type, dim) => {
        dim.width = ScreenUtils.width;
        switch (type.type) {
            case 'icon':
                if (type.data.length === 0){
                    dim.height = 0;
                } else {
                    dim.height =  type.data.length> 5? ScreenUtils.autoSizeWidth(93)*2: ScreenUtils.autoSizeWidth(93);
                }
                break;
            case 'goods':
                dim.height =  ScreenUtils.autoSizeWidth(174+60+20);
                break;
            case 'header':
                dim.height = 50;
                break;
            case homeType.custom_text:
            case homeType.custom_goods:
            case homeType.custom_imgAD:
                dim.height = type.itemHeight || 0;
                break;
            default:
                dim.height = 0;
        }
    });


    _renderItem = (type, item, index) => {
        type = type.type;
        item.sgscm = getSGscm(SGscmSource.topic,this.code).sgscm;
        item.sgspm = getSGspm_home(HomeSource.marketing,index).sgspm
        let p = {firstCategoryId: this.props.data.firstCategoryId, navName: this.props.data.navName};
        let topic = { specialTopicId: this.props.data.linkCode };
        if (type === 'icon') {
            return <IconView data={item.data} p = {p}/>
        } else if (type === 'goods') {
            return <GoodView data = {item.data} p = {p}/>
        } else if (type === 'header') {
            return <HeaderView
                onPress={(index) => {
                    this.changeIndex(index);
                }}
                index={this.index}
            />
        } else if (type === homeType.custom_text) {
            p.specialTopicArea = 6;
            return <TextCustomView data={item} p={topic}/>;
        } else if (type === homeType.custom_imgAD) {
            p.specialTopicArea = 1;
            return <TopicImageAdView data={item} p={topic}/>;
        } else if (type === homeType.custom_goods) {
            p.specialTopicArea = 3;
            return <GoodsCustomView data={item} p={topic}/>;
        }
        return <View/>;
    };

    getParams() {
        let data = this.props.data || {};
        return {
            page: this.page,
            pageSize: 10,
            categoryId: data.firstCategoryId,
            sort: this.sort
        };
    }

    refreshData=(first) =>{
        if (!first) {
            if (this.isRefreshing || this.isLoadMore) {
                return;
            }
            this.setState({ refreshing: true });
        }
        let data = this.props.data || {};
        let customTopicCode = data.customTopicCode;
        //获取顶部的icon数据
        HomeAPI.getSecondaryList({ navId: data.id }).then((result) => {
            this.handleItemData(result.data || []);
        });
        if (customTopicCode){
            //请求自定义专题数据
            HomeAPI.getCustomTopic({topicCode: customTopicCode, page: '1', pageSize: '10'}).then((data)=> {
                //处理自定义专题的数据
                asyncHandleTopicData(data).then((topticList)=> {
                    this.topicList = topticList;
                    this.changeData();
                })
            })
        }

        this.isRefreshing = true;
        this.page = 1;
        setTimeout(()=> {//为了播放完刷新动画
            this.setState({
                refreshing: false
            });
        }, 1000)
        HomeAPI.productList(this.getParams()).then((data) => {
            this.isRefreshing = false;
            data = data.data || {};
            let dataArr = data.data || [];
            let footerStatus = data.isMore ? 'idle' : 'noMoreData';
            dataArr = this.handleData(dataArr);
            this.goods = dataArr;
            this.changeData();
            this.setState({
                footerStatus,
            });

        }).catch((e) => {
            this.isRefreshing = false;
        });
    }

    getMoreData() {
        if (this.isRefreshing || this.isLoadMore || this.state.footerStatus === 'noMoreData') {
            return;
        }
        this.isLoadMore = true;
        this.page++;
        this.setState({ footerStatus: 'loading' });
        HomeAPI.productList(this.getParams()).then((data) => {
            this.isLoadMore = false;
            data = data.data || {};
            let dataArr = data.data || [];
            let footerStatus = data.isMore ? 'idle' : 'noMoreData';
            dataArr = this.handleMoreData(dataArr);
            this.goods = dataArr;
            this.changeData();
            this.setState({ footerStatus});

        }).catch((e) => {
            this.page--;
            this.isLoadMore = false;
            this.setState({ footerStatus: 'idle' });
        });
    }

    handleData(data) {
        let arr = [];
        let temp = [];

        data.forEach((item) => {
            if (temp.length === 2) {
                arr.push({type: 'goods', data: temp});
                temp = [];
            }
            temp.push(item);

        });
        if (temp.length > 0) {
            arr.push(temp);
        }
        return arr;
    }

    handleMoreData(data) {
        if (data.length === 0 || this.goods.length === 0) {
            return this.goods;
        }
        let arr = [...this.goods];
        let temp = arr.pop();
        data.forEach((item) => {
            if (temp.length === 2) {
                arr.push({type: 'goods', data: temp});
                temp = [];
            }
            temp.push(item);

        });
        if (temp.length > 0) {
            arr.push({type: 'goods', data: temp});
        }
        return arr;
    }


    render() {
        if (Math.abs(tabModel.tabIndex - this.props.index) > 1){
            return null;
        }
        this.dataProvider = this.dataProvider.cloneWithRows(this.state.data);
        let stickyHeaderIndice = 0;
        this.state.data.find((item, index)=> {
            if (item.type === 'header') {
                stickyHeaderIndice = index
                return true
            }
            return false;
        })
        return (
            <View style={[DesignRule.style_container, { marginTop: 42 }]}>
                <StickyContainer stickyHeaderIndices={[stickyHeaderIndice]}>
                    <RecyclerListView
                        refreshControl={<HeaderLoading
                            isRefreshing={this.state.refreshing}
                            onRefresh={()=> this.refreshData(false)}
                        />}
                        style={{ minHeight: ScreenUtils.headerHeight, minWidth: 1, flex: 1, marginTop: 0 }}
                        onEndReached={this.getMoreData.bind(this)}
                        onEndReachedThreshold={ScreenUtils.height / 3}
                        dataProvider={this.dataProvider}
                        rowRenderer={this._renderItem.bind(this)}
                        layoutProvider={this.layoutProvider}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={false}
                        canChangeSize={false}
                        renderFooter={() => <DefaultLoadMoreComponent status={this.state.footerStatus}/>}
                    />
                </StickyContainer>
            </View>
        );
    }
}
