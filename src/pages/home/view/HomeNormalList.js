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

import {
    View,
    // TouchableOpacity,
    SectionList,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    MRText,
    // UIImage
} from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import HomeAPI from '../api/HomeAPI';
import ImageLoader from '@mr/image-placeholder';
import ScreenUtils from '../../../utils/ScreenUtils';
import { DefaultLoadMoreComponent } from '../../../comm/components/RefreshFlatList';
import { routePush } from '../../../navigation/RouterMap';
import RouterMap from '../../../navigation/RouterMap';
const autoSizeWidth = ScreenUtils.autoSizeWidth;

class HeaderView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: props.index || 0
        };
    }

    render(){
        let {index} = this.state;
        return (
            <View style = {{height: 50, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                <TouchableWithoutFeedback onPress = {() => this.onPress(0)}>
                    <MRText style={{fontSize: autoSizeWidth(15),
                        color: index === 0? DesignRule.mainColor : DesignRule.textColor_instruction}}>综合</MRText>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress = {() =>this.onPress(1)}>
                    <MRText style={{fontSize: autoSizeWidth(15),
                        color: index === 1? DesignRule.mainColor : DesignRule.textColor_instruction}}>销量</MRText>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress = {() =>this.onPress(this.state.index === 2?3:2)}>
                    <View>
                        <MRText style={{fontSize: autoSizeWidth(15),
                            color: (index === 2 || index === 3)? DesignRule.mainColor : DesignRule.textColor_instruction}}>价格</MRText>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    onPress(index){
        if (index === this.state.index){
            return;
        }
        this.setState({index})
        this.props.onPress(index)
    }
}

export default class HomeNormalList extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            itemData: [],
            footerStatus: 'idle',
            refreshing: false,
            goods: []
        };
        this.index = 0;
        this.isRefreshing = true;
        this.isLoadMore = false;
        this.page = 1;
        //排序类型(1.综合 2.销量 3. 价格)
        this.sortType = 1;
            //排序方式 (1.升序 2.降序)
        this.sortModel = 2;
    }

    // case 'idle':
    // return this.renderIdleMore();
    // case 'loading':
    // return this.renderLoadingMore();
    // case 'noMoreData':
    // return this.renderLoadCompleted();

    componentDidMount() {
        this.refreshData(true);
    }

    handleItemData(itemData)
    {
        let count = itemData.length;
        if (count === 0){
            itemData = [];
        } else if (count <= 8){
            count = count>=4 ? 4 :count
            itemData = itemData.slice(0,count)
            itemData.push({

                "iconName": "查看更多",
                "iconImage": "https://devcdn.sharegoodsmall.com/sharegoods/3c43abb4f88942f7b3745bf6a4efd51c.jpg",
                "linkType": 'all',
            })
        } else {
            itemData = itemData.slice(0,9)
            itemData.push({
                "iconName": "查看更多",
                "iconImage": "https://devcdn.sharegoodsmall.com/sharegoods/3c43abb4f88942f7b3745bf6a4efd51c.jpg",
                "linkType": 'all',
            })
        }
        this.setState({itemData})
    }

    changeIndex(index){
        this.index = index;
        switch (index){
            case 0:
                // alert('综合')
                this.sortType = 1;
                this.sortModel = 2;
                break
            case 1:
                // alert('销量')
                this.sortType = 2;
                this.sortModel = 2;
                break
            case 2:
                this.sortType = 3;
                this.sortModel = 2;
                break
            case 3:
                this.sortType = 3;
                this.sortModel = 1;
                break
        }
        this.refreshData(true);
    }

    getParams(){
        let data = this.props.data || {};
        return{
            page: this.page,
            pageSize: 10,
            categoryId: data.firstCategoryId,
            sortType: this.sortType,
            sortModel: this.sortModel
        }
    }

    refreshData(first){
        if (!first){
            if (this.isRefreshing || this.isLoadMore){
                return;
            }
            this.setState({refreshing: true})
        }
        let data = this.props.data || {};
        HomeAPI.getSecondaryList({navId: data.id}).then((result) => {
            this.handleItemData(result.data || []);
        })
        this.isRefreshing = true
        this.page = 1;
        HomeAPI.productList(this.getParams()).then((data)=> {
            this.isRefreshing = false
            data = data.data || {};
            let dataArr = data.data || [];
            let footerStatus = data.isMore?'idle': 'noMoreData';
            dataArr = this.handleData(dataArr);
            this.setState({
                goods:dataArr,
                footerStatus,
                refreshing: false})

        }).catch((e)=> {
            this.isRefreshing = false
            this.setState({ refreshing: false})
        })
    }

    getMoreData(){
        if ( this.isRefreshing || this.isLoadMore || this.state.footerStatus === 'noMoreData') {
            return;
        }
        this.isLoadMore = true;
        this.page++;
        this.setState({ footerStatus: 'loading'})
        HomeAPI.productList(this.getParams()).then((data)=> {
            this.isLoadMore = false;
            data = data.data || {};
            let dataArr = data.data || [];
            let footerStatus = data.isMore?'idle': 'noMoreData';
            dataArr = this.handleMoreData(dataArr);
            this.setState({ footerStatus, goods: dataArr})

        }).catch((e)=> {
            this.page--;
            this.isLoadMore = false
            this.setState({ footerStatus: 'idle'})
        })
    }

    handleData(data){
        let arr = []
        let temp = []

        data.forEach((item)=> {
            if (temp.length === 2){
                arr.push(temp);
                temp = []
            }
            temp.push(item);

        });
        if (temp.length > 0){
            arr.push(temp);
        }
        return arr;
    }

    handleMoreData(data){
        if (data.length === 0 || this.state.goods.length === 0){
            return this.state.goods
        }


        let arr = [...this.state.goods]
        let temp =  arr.pop();
        data.forEach((item)=> {
            if (temp.length === 2){
                arr.push(temp);
                temp = []
            }
            temp.push(item);

        });
        if (temp.length > 0){
            arr.push(temp);
        }
        return arr;
    }


    render() {
        return (
            <View style={[DesignRule.style_container,{marginTop: 40}]}>
                <SectionList
                    renderItem={(item) => this.renderItem(item)}
                    renderSectionHeader={(s) => this.renderSectionHeader(s)}
                    sections={[
                        { type: "icon", data: [{data: this.state.itemData}] },
                        { type: "header", data: this.state.goods }
                    ]}
                    keyExtractor={(item, index) => item + index}
                    stickySectionHeadersEnabled={true}
                    onRefresh={this.refreshData.bind(this)}
                    showsVerticalScrollIndicator={false}
                    refreshing={this.state.refreshing}
                    onEndReached={this.getMoreData.bind(this)}
                    ListFooterComponent={()=> <DefaultLoadMoreComponent status = {this.state.footerStatus}/>}
                />
            </View>
        );
    }

    renderSectionHeader({section}){
        if (section.type === 'icon') {
            return <View />
        }else {
            return <HeaderView
                onPress = {(index) => {this.changeIndex(index)}}
                index = {this.index}
            />
        }
    }

    renderItem({ item, index, section }){
        if (section.type === 'icon') {
            return(
                <View  style={{flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems:'flex-start',
                    paddingLeft: ScreenUtils.autoSizeWidth(10),
                    backgroundColor: 'white'
                }}>
                    {item.data.map((icon)=> {
                        return(
                            <TouchableWithoutFeedback onPress={()=> {
                                if (icon.linkType === 'all'){
                                    routePush(RouterMap.CategorySearchPage)
                                    return;
                                }

                                if (icon.linkType === 1){
                                    routePush(RouterMap.SearchResultPage, { categoryId: icon.linkCode,})
                                    return;
                                }
                                if (icon.linkType === 2){
                                    routePush('HtmlPage', {uri: '/custom/'+icon.linkCode})
                                    return;
                                }
                            }}>
                                <View style={{alignItems: 'center', height:ScreenUtils.autoSizeWidth(93),width: ScreenUtils.autoSizeWidth(73) - 0.5}}>
                                    <ImageLoader style={{width: ScreenUtils.autoSizeWidth(60) , height: ScreenUtils.autoSizeWidth(60)}}
                                                 source = {{uri: icon.iconImage}}
                                    />
                                    <MRText style={{fontSize: ScreenUtils.autoSizeWidth(12),
                                        height:  ScreenUtils.autoSizeWidth(20),
                                        color: '#333333',
                                        marginTop: ScreenUtils.autoSizeWidth(10),
                                    }}>{icon.iconName}</MRText>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })}
                </View>
            )
        }else {//商品
            return (
                <View style={{flexDirection: 'row', paddingLeft: ScreenUtils.autoSizeWidth(10), marginTop: ScreenUtils.autoSizeWidth(4)}}>
                    {item.map(good => {
                        return (
                            <TouchableWithoutFeedback
                                onPress={()=> {routePush(RouterMap.ProductDetailPage, { productCode: good.prodCode })}}
                            >
                                <View style={{width: ScreenUtils.autoSizeWidth(170),
                                    height: ScreenUtils.autoSizeWidth(246),
                                    backgroundColor: 'white',
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    marginLeft: ScreenUtils.autoSizeWidth(5)
                                }}>
                                    <ImageLoader style={{width: ScreenUtils.autoSizeWidth(170),
                                        height: ScreenUtils.autoSizeWidth(170),}}
                                                 source={{uri: good.imgUrl}}
                                    />
                                    <MRText style={{fontSize: ScreenUtils.autoSizeWidth(12),
                                        color: DesignRule.textColor_mainTitle,
                                        marginTop: ScreenUtils.autoSizeWidth(10),
                                        marginHorizontal: ScreenUtils.autoSizeWidth(10),
                                    }}
                                            numberOfLines={2}
                                    >{good.name}</MRText>
                                    <MRText style={{fontSize: autoSizeWidth(12),
                                        color: DesignRule.mainColor,
                                        marginLeft: autoSizeWidth(10),
                                        marginTop: autoSizeWidth(3)
                                    }}>
                                        ¥<MRText  style={{fontSize: autoSizeWidth(14),
                                        color: DesignRule.mainColor, fontWeight: '600'}}>{good.minPrice}</MRText>起
                                    </MRText>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })}
                </View>
            )
        }
    }
}

// const styles = StyleSheet.create({});
