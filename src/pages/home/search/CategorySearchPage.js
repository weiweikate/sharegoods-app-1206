import React from 'react';
import { FlatList, SectionList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BasePage from '../../../BasePage';
import { PreLoadImage } from '../../../components/ui';
import HomeAPI from '../api/HomeAPI';
import ScreenUtils from '../../../utils/ScreenUtils';
import bridge from '../../../utils/bridge';
import ViewPager from '../../../components/ui/ViewPager';
import UIText from '../../../components/ui/UIText';
import UIImage from '../../../components/ui/UIImage';

const imageUrls = [
    'https://yanxuan.nosdn.127.net/2ac89fb96fe24a2b69cae74a571244cb.jpg?imageView&quality=75&thumbnail=750x0',
    'https://yanxuan.nosdn.127.net/8f283dd0ad76bb48ef9c29a04690816a.jpg?imageView&quality=75&thumbnail=750x0',
    'https://yanxuan.nosdn.127.net/a9e80a3516c99ce550c7b5574973c22f.jpg?imageView&quality=75&thumbnail=750x0',
    'https://yanxuan.nosdn.127.net/11b673687ae33f87168cc7b93250c331.jpg?imageView&quality=75&thumbnail=750x0'
];
const marginLR = (ScreenUtils.width - 110 - 3 * 60 - 2 * 20) / 2;
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

    async componentDidMount() {
        this.$loadingShow();
        // 分类列表
        HomeAPI.findNameList().then((response) => {
            this.$loadingDismiss();
            setTimeout(() => {
                this.setState({ swiperShow: true });
            }, 0);
            let datas = response.data || [];
            // 将为您推荐id设置为-10
            let item = { id: -10, name: '为您推荐' };
            datas.unshift(item);
            this.setState({
                nameArr: datas
            });
        }).catch((data) => {
            this.$loadingDismiss();
            bridge.$toast(data.msg);
        });

        // 热门分类
        HomeAPI.findHotList().then((response) => {
            let datas = response.data || [];
            this.setState({
                sectionArr: [{ title: '热门分类', data: datas }],
                bannerData: imageUrls
            });
        }).catch((data) => {
            bridge.$toast(data.msg);
        });
    }

    renderViewPageItem = (url) => {
        return (
            <UIImage
                source={{ uri: url }}
                style={{ width: ScreenUtils.width - 110, height: 118, borderRadius: 5 }}
            />);
    };

    go2SearchPage = () => {
        this.$navigate('home/search/SearchPage');
    };

    _render() {
        return (
            <View style={{ flexDirection: 'column' }}>
                <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.searchBox} onPress={this.go2SearchPage}>
                        <Image source={require('../res/icon_search.png')}
                               style={{ width: 22, height: 21, marginLeft: 20 }} resizeMode={'center'}/>
                        <View style={styles.inputText}/>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <FlatList
                        style={{ width: 90, backgroundColor: '#EEEEEE' }}
                        renderItem={this._categoryItem}
                        extraData={this.state}
                        refreshing={false}
                        keyExtractor={(item) => item.id + ''}
                        showsVerticalScrollIndicator={false}
                        getItemLayout={(data, index) => (
                            //行高于分割线高，优化
                            { length: 45, offset: 45 * index, index }
                        )}
                        data={this.state.nameArr}>
                    </FlatList>
                    <View style={{
                        width: ScreenUtils.width - 90,
                        flexDirection: 'column',
                        padding: 10,
                        backgroundColor: 'white'
                    }}>
                        {
                            this.state.bannerData.length > 0 ?
                                <ViewPager swiperShow={this.state.swiperShow}
                                           arrayData={this.state.bannerData}
                                           renderItem={(url) => this.renderViewPageItem(url)}
                                           dotStyle={{
                                               height: 5,
                                               width: 5,
                                               borderRadius: 5,
                                               backgroundColor: '#ffffff',
                                               opacity: 0.4
                                           }}
                                           activeDotStyle={{
                                               height: 5,
                                               width: 20,
                                               borderRadius: 5,
                                               backgroundColor: '#ffffff'
                                           }}
                                           autoplay={true}
                                           height={118}
                                           width={ScreenUtils.width - 110}
                                           style={{ marginBottom: 10 }}
                                /> : null}
                        <SectionList style={{ marginTop: 10 }}
                                     contentContainerStyle={{
                                         flexDirection: 'row',
                                         flexWrap: 'wrap'
                                     }}
                                     renderItem={this._sectionItem}
                                     renderSectionHeader={this._sectionHeader}
                                     ListFooterComponent={this._listFooter}
                                     sections={this.state.sectionArr}
                                     initialNumToRender={9}
                                     removeClippedSubviews={false}
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
                    backgroundColor: item.index === this.state.leftIndex ? '#D51243' : '#EEEEEE'
                }}/>
                <View style={{
                    flex: 1,
                    height: 45,
                    backgroundColor: item.index === this.state.leftIndex ? 'white' : '#EEEEEE',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 13,
                        color: '#222222'
                    }}>
                        {item.item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    _onCategoryClick = (item, index) => {
        this.setState({
            leftIndex: index
        });
        // 点击分类
        if (this.state.leftIndex != index) {
            if (index === 0) {
                // 热门分类
                HomeAPI.findHotList().then((response) => {
                    let datas = response.data || [];
                    this.setState({
                        sectionArr: [{ title: '热门分类', data: datas }],
                        bannerData: imageUrls
                    });
                }).catch((data) => {
                    bridge.$toast(data.msg);
                });
            } else {
                // 分级
                HomeAPI.findProductCategoryList({ id: item.id }).then((response) => {
                    let datas = response.data || [];
                    let arr = [];
                    for (let i = 0, len = datas.length; i < len; i++) {
                        let item = { title: datas[i].name, data: datas[i].productCategoryList };
                        arr.push(item);
                    }
                    this.setState({
                        sectionArr: arr,
                        bannerData: imageUrls
                    });
                }).catch((data) => {
                    bridge.$toast(data.msg);
                });
            }
        }
    };

    _sectionItem = (item) => {
        return (
            <View style={{
                flexDirection: 'column',
                width: 60,
                marginRight: (item.index % 3 == 0 || item.index % 3 == 1) ? 10 : marginLR,
                marginLeft: (item.index % 3 == 1 || item.index % 3 == 2) ? 10 : marginLR,
                alignItems: 'center'
            }}>
                <PreLoadImage imageUri={item.item.img}
                              style={{
                                  height: 60,
                                  width: 60
                              }}
                              resizeMode={'cover'}
                              onClickAction={() => this.go2ResultPage(item.item.id, item.item.name)}/>
                <UIText value={item.item.name}
                        style={{ fontSize: 13, color: '#222222', marginTop: 12, marginBottom: 16 }}/>
            </View>
        );
    };

    _sectionHeader = ({ section }) => {
        return (
            <View style={{
                width: ScreenUtils.width - 110,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10
            }}>
                <View style={{ width: 10, height: 10, marginRight: 3, borderRadius: 5, backgroundColor: 'black' }}/>
                <UIText value={section.title} style={{ fontSize: 13, color: '#222222' }}/>
            </View>
        );
    };

    _listFooter = ({ section }) => {
        return (
            <View style={{
                width: ScreenUtils.width - 110,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30
            }}>
                <View style={{ height: 0.7, width: 20, backgroundColor: '#999999', marginRight: 10 }}/>
                <UIText value={'没有更多啦～'} style={{ fontSize: 12, color: '#999999' }}/>
                <View style={{ height: 0.7, width: 20, backgroundColor: '#999999', marginLeft: 10 }}/>
            </View>
        );
    };

    go2ResultPage(categoryId, name) {
        this.$navigate('home/search/SearchResultPage', { categoryId, name });
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column'
    },
    searchBox: {
        height: 40,
        flexDirection: 'row',
        width: ScreenUtils.width - 30,
        borderRadius: 15,
        backgroundColor: '#EEEEEE',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15
    },
    inputText: {
        flex: 1,
        color: '#666666',
        fontSize: 14,
        padding: 5
    }
});
