import React from 'react';
import { FlatList, Image, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';
import BasePage from '../../../BasePage';
import HomeAPI from '../api/HomeAPI';
import ScreenUtils from '../../../utils/ScreenUtils';
import bridge from '../../../utils/bridge';
import ViewPager from '../../../components/ui/ViewPager';
import UIText from '../../../components/ui/UIText';
import StringUtils from '../../../utils/StringUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../../order/res';
import ImageLoad from '@mr/image-placeholder';
import { MRText as Text } from '../../../components/ui';
import { TrackApi } from '../../../utils/SensorsTrack';
import { homeModule } from '../model/Modules';
import RouterMap from '../../../navigation/RouterMap';

const icon_search = res.search;


const itemImgW = (ScreenUtils.width - 110 - 2 * 10.5 - 2 * 30) / 3;
const bannerW = ScreenUtils.width - 110;
const bannerH = bannerW * 118 / 265;
const categoryHeight = ScreenUtils.height - 56 - ScreenUtils.headerHeight;

export default class CategorySearchPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            leftIndex: 0,
            swiperShow: false,
            bannerData: [],
            nameArr: [],
            sectionArr: []
        };
    }

    $navigationBarOptions = {
        title: '商品分类'
    };

    componentDidMount() {
        this.$loadingShow('加载中');
        setTimeout(() => {
            this.getTypeList();
            this.getTypeSection();
        }, 100);
    }

    componentWillUnmount() {
        clearTimeout();
    }

    getTypeList = () => {
        // 分类列表
        HomeAPI.findNameList().then((response) => {
            this.$loadingDismiss();
            let datas = response.data || [];
            // 将为您推荐id设置为-10
            let item = { id: -10, name: '为您推荐' };
            datas.unshift(item);
            this.setState({
                nameArr: datas || []
            });
        }).catch((data) => {
            this.$loadingDismiss();
            bridge.$toast(data.msg);
        });
    };

    getTypeSection = () => {
        // 热门分类
        HomeAPI.findHotList().then((response) => {
            let datas = response.data || {};
            this.setState({
                sectionArr: [{ index: 0, title: '热门分类', data: datas.productCategoryList || [] }],
                bannerData: StringUtils.isEmpty(datas.img) ? [] : [{
                    img: datas.img,
                    linkType: datas.linkType,
                    linkTypeCode: datas.linkTypeCode
                }]
            })
            ;
        }).catch((data) => {
            bridge.$toast(data.msg);
        });
    };

    renderViewPageItem = (item) => {
        return (
            <TouchableOpacity onPress={() => {
                this.clickBanner(item);
            }}>
                <ImageLoad
                    source={{ uri: item.img }}
                    borderRadius={5}
                    style={{ width: bannerW, height: bannerH, borderRadius: 5, marginLeft: 10, marginRight: 10 }}
                />
            </TouchableOpacity>
        );
    };

    go2SearchPage = () => {
        this.$navigate(RouterMap.SearchPage);
    };

    _adjustCategory=(index)=>{
        if(index < 7){
            this.categoryRef && this.categoryRef.scrollToOffset({animated:true,offset:0});

            return;
        }
        this.categoryRef && this.categoryRef.scrollToOffset({animated:true,offset:(index-6)*45});
    }

    _render() {
        return (

            <View style={{ flexDirection: 'column' }}>
                <View style={{ height: 56, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.searchBox} activeOpacity={0.5} onPress={() => this.go2SearchPage()}>
                        <Image source={icon_search}
                               style={{ width: 22, height: 21, marginLeft: 20 }}/>
                        <View style={styles.inputText}/>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    {
                        this.state.nameArr && this.state.nameArr.length > 0 ?
                            <FlatList
                                ref={(ref)=>{this.categoryRef=ref;}}
                                style={{
                                    width: 90,
                                    backgroundColor: DesignRule.lineColor_inColorBg,
                                    height:categoryHeight //屏幕高减去搜索框以及头部高
                                }}
                                renderItem={this._categoryItem}
                                refreshing={false}
                                keyExtractor={(item, index) => index}
                                showsVerticalScrollIndicator={false}
                                data={this.state.nameArr}
                            /> : <View style={{ width: 90 }}/>
                    }

                    <View style={{
                        width: bannerW + 20,
                        flexDirection: 'column',
                        backgroundColor: 'white',
                        paddingTop: this.state.bannerData.length > 0 ? 10 : 0,
                        height: ScreenUtils.height - 56 - ScreenUtils.headerHeight //屏幕高减去搜索框以及头部高
                    }}>
                        {
                            this.state.swiperShow ?
                                <ViewPager swiperShow={this.state.swiperShow}
                                           arrayData={this.state.bannerData}
                                           renderItem={(item) => this.renderViewPageItem(item)}
                                           dotStyle={{
                                               height: 5,
                                               width: 5,
                                               borderRadius: 5,
                                               backgroundColor: 'white',
                                               opacity: 0.4
                                           }}
                                           activeDotStyle={{
                                               height: 5,
                                               width: 20,
                                               borderRadius: 5,
                                               backgroundColor: 'white'
                                           }}
                                           autoplay={true}
                                           height={bannerH}
                                           style={{ marginBottom: 10 }}
                                /> : null
                        }
                        <SectionList
                            style={{
                                marginTop: this.state.bannerData.length > 0 ? 10 : 0,
                                marginLeft: 10,
                                marginRight: 10
                            }}
                            contentContainerStyle={{
                                flexWrap: 'wrap',
                                flexDirection: 'row'
                            }}
                            renderItem={this._sectionItem}
                            renderSectionHeader={this._sectionHeader}
                            ListFooterComponent={this._listFooter}
                            sections={this.state.sectionArr || []}
                            initialNumToRender={15}
                            removeClippedSubviews={false}
                            stickySectionHeadersEnabled={false}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item.id + ''}/>
                    </View>
                </View>
            </View>
        );
    }

    _categoryItem = (item) => {
        return (
            <TouchableOpacity style={{ height: 45, flexDirection: 'row' }}
                              onPress={() => this._onCategoryClick(item.item, item.index)}>
                <View style={{
                    height: 45,
                    width: 2,
                    backgroundColor: item.index === this.state.leftIndex ? DesignRule.mainColor : DesignRule.lineColor_inColorBg
                }}/>
                <View style={{
                    flex: 1,
                    height: 45,
                    backgroundColor: item.index === this.state.leftIndex ? 'white' : DesignRule.lineColor_inColorBg,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 13,
                        fontWeight: item.index === this.state.leftIndex ? '600' : 'normal',
                        color: DesignRule.textColor_mainTitle
                    }} allowFontScaling={false}>
                        {item.item.name.length > 4 ? item.item.name.substr(0, 4) + '...' : item.item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    clickBanner = (item) => {
        // banner点击跳转
        let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode) || '';
        let params = homeModule.paramsNavigate(item);
        this.$navigate(router, { ...params });
        let trackDic = homeModule.bannerPoint(item) || {};
        TrackApi.BannerClick({ bannerLocation: 31, ...trackDic });
    };

    _onCategoryClick = (item, index) => {
        this.setState({
            leftIndex: index
        },this._adjustCategory(index));
        // 点击分类
        if (this.state.leftIndex !== index) {
            // 先隐藏，后显示，起到刷新作用
            if (index === 0) {
                // 热门分类
                HomeAPI.findHotList().then((response) => {
                    bridge.hiddenLoading();
                    let datas = response.data || {};
                    this.setState({
                        sectionArr: [{ index: 0, title: '热门分类', data: datas.productCategoryList || [] }],
                        bannerData: StringUtils.isEmpty(datas.img) ? [] : [{
                            img: datas.img,
                            linkType: datas.linkType,
                            linkTypeCode: datas.linkTypeCode
                        }],
                        swiperShow: !StringUtils.isEmpty(datas.img)
                    });
                }).catch((data) => {
                    bridge.hiddenLoading();
                    bridge.$toast(data.msg);
                });
            } else {
                // 分级
                HomeAPI.findProductCategoryList({ id: item.id }).then((response) => {
                    bridge.hiddenLoading();
                    let datas = response.data || {};
                    let arr = datas.productCategoryList && datas.productCategoryList.map((item, index) => {
                        return {
                            index: index,
                            title: item.name,
                            data: item.productCategoryList || []
                        };
                    });
                    this.setState({
                        sectionArr: arr || [],
                        bannerData: StringUtils.isEmpty(datas.img) ? [] : [{
                            img: datas.img,
                            linkType: datas.linkType,
                            linkTypeCode: datas.linkTypeCode
                        }],
                        swiperShow: !StringUtils.isEmpty(datas.img)
                    });
                }).catch((data) => {
                    bridge.hiddenLoading();
                    bridge.$toast(data.msg);
                });
            }
        }
    };

    _sectionItem = (item) => {
        return (
            <View style={{
                flexDirection: 'column',
                width: itemImgW,
                marginRight: (item.index % 3 === 0 || item.index % 3 === 1) ? 15 : 10,
                marginLeft: (item.index % 3 === 1 || item.index % 3 === 2) ? 15 : 10,
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => this.go2ResultPage(item.item.id, item.item.name)}>
                    <ImageLoad source={{ uri: item.item.img }}
                               style={{
                                   height: itemImgW,
                                   width: itemImgW
                               }}/>
                </TouchableOpacity>
                <UIText value={item.item.name}
                        style={{
                            textAlign: 'center',
                            fontSize: 13,
                            color: DesignRule.textColor_mainTitle,
                            marginTop: 10,
                            marginBottom: 22
                        }}
                        numberOfLines={2}/>
            </View>
        );
    };

    _sectionHeader = ({ section }) => {
        return (
            <UIText value={section && section.title}
                    style={{
                        fontWeight: '600',
                        fontSize: 13,
                        width: ScreenUtils.width - 110,
                        color: DesignRule.textColor_mainTitle,
                        marginBottom: 20,
                        marginTop: this.state.bannerData.length === 0 && section.index === 0 ? 10 : 0
                    }}/>
        );
    };

    _listFooter = ({ section }) => {
        return (
            this.state.sectionArr.length > 0 ?
                <View style={{
                    width: ScreenUtils.width - 110,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 30,
                    marginBottom: 30
                }}>
                    <View style={{
                        height: 0.7,
                        width: 20,
                        backgroundColor: DesignRule.textColor_instruction,
                        marginRight: 10
                    }}/>
                    <UIText value={'没有更多啦～'} style={{ fontSize: 12, color: DesignRule.textColor_instruction }}/>
                    <View style={{
                        height: 0.7,
                        width: 20,
                        backgroundColor: DesignRule.textColor_instruction,
                        marginLeft: 10
                    }}/>
                </View> : null
        );
    };

    go2ResultPage(categoryId, name) {
        this.$navigate(RouterMap.SearchResultPage, { categoryId, keywords: name, searchType: 11 });
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column'
    },
    searchBox: {
        height: 36,
        flexDirection: 'row',
        width: ScreenUtils.width - 30,
        borderRadius: 18,
        backgroundColor: DesignRule.lineColor_inColorBg,
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15
    },
    inputText: {
        flex: 1,
        padding: 5
    }
});

