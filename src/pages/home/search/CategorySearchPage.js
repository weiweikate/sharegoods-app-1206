import React from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Image, ScrollView
} from 'react-native';
import BasePage from '../../../BasePage';
import { UIImage, PreLoadImage } from '../../../components/ui';
import HomeAPI from '../api/HomeAPI';
import ScreenUtils from '../../../utils/ScreenUtils';
import ViewPager from '../../../components/ui/ViewPager';

const imageUrls = [
    'https://yanxuan.nosdn.127.net/2ac89fb96fe24a2b69cae74a571244cb.jpg?imageView&quality=75&thumbnail=750x0',
    'https://yanxuan.nosdn.127.net/8f283dd0ad76bb48ef9c29a04690816a.jpg?imageView&quality=75&thumbnail=750x0',
    'https://yanxuan.nosdn.127.net/a9e80a3516c99ce550c7b5574973c22f.jpg?imageView&quality=75&thumbnail=750x0',
    'https://yanxuan.nosdn.127.net/11b673687ae33f87168cc7b93250c331.jpg?imageView&quality=75&thumbnail=750x0'
];
export default class CategorySearchPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [
                //     {
                //     "createTime": "2018-09-27T02:36:10.076Z",
                //     "fatherId": 0,
                //     "hotFlag": 0,
                //     "hotSort": 0,
                //     "id": 0,
                //     "img": "string",
                //     "level": 0,
                //     "name": "string",
                //     "productCategoryList": [
                //         null
                //     ],
                //     "status": 0,
                //     "type": 0,
                //     "updateTime": "2018-09-27T02:36:10.076Z",
                // },
            ],
            leftIndex: 0,
            swiperShow: false,
            leftArr: [],
            rightSuperArr: [],
            hotData: []
        };
    }

    $navigationBarOptions = {
        show: true,
        title: '商品分类'
    };

    async componentDidMount() {
        this.$loadingShow();
        let leftArr = [];
        setTimeout(() => {
            this.setState({
                swiperShow: true
            });
        }, 0);
        await   HomeAPI.findHotList().then((data) => {
            this.$loadingDismiss();
            let datas = data.data || [];
            this.setState({
                hotData: datas,
                viewData: datas
            });
        }).catch((data) => {
            this.$loadingDismiss();
            this.$toastShow(data.msg);
        });
        HomeAPI.findNameList().then(res => {
            if (res.code === 10000) {
                let data = res.data || [];
                data.map((item, index) => {
                    leftArr.push({
                        name: item.name,
                        id: item.id,
                        hotFlag: item.id
                    });
                });
                leftArr.unshift({
                    name: '为您推荐',
                    id: 0,
                    hotFlag: 0
                });
                this.setState({ leftArr: leftArr });
            }
        }).catch(err => {
            console.log(err);
        });


    }

    renderViewPageItem = (item) => {
        console.log(item);
        return (
            <UIImage
                source={{ uri: item }}
                style={{ height: 110, width: ScreenUtils.width - 110, borderRadius: 5 }}
                onPress={() => {

                }}
                resizeMode="cover"
            />);
    };
    checkoutLeft = (index, id) => {
        // this.setState({viewData:[]})
        let viewData = [];
        if (index !== 0) {
            HomeAPI.findProductCategoryList({ id: id }).then(res => {
                if (res.code === 10000) {
                    let data = res.data || [];
                    data.map((item, index) => {
                        viewData.push({
                            title: item.name,
                            hotFlag: item.hotFlag,
                            productCategoryList: item.productCategoryList || [],
                            name: item.name,
                            img: item.img
                        });
                    });
                    this.setState({
                        leftIndex: index,
                        viewData: viewData
                    });
                }
            });
        } else {
            this.setState({
                leftIndex: index,
                viewData: this.state.hotData
            });
        }

    };
    go2SearchPage = () => {
        this.$navigate('home/search/SearchPage');
    };

    _render() {
        return (
            <View style={styles.container}>
                <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.searchBox} onPress={this.go2SearchPage}>
                        <Image source={require('../res/icon_search.png')}
                               style={{ width: 22, height: 21, marginLeft: 20 }}/>
                        <View style={styles.inputText}/>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {this.state.leftArr.map((item, index) => {
                            return (
                                <TouchableOpacity style={{
                                    flexDirection: 'row',
                                    backgroundColor: index == this.state.leftIndex ? 'white' : '#EEEEEE',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 90,
                                    height: 45
                                }} onPress={() => this.checkoutLeft(index, item.id)} key={index}>
                                    <View style={{
                                        width: 1,
                                        height: '100%',
                                        backgroundColor: index == this.state.leftIndex ? 'red' : 'white',
                                        position: 'absolute',
                                        left: 0,
                                        top: 0
                                    }}/>
                                    <Text style={{ fontSize: 13, fontFamily: 'PingFang-SC-Medium', color: '#222222' }}
                                          key={index}>{item.name}</Text>
                                </TouchableOpacity>
                            );

                        })}
                    </ScrollView>
                    <View style={{ width: ScreenUtils.width - 90, padding: 10, backgroundColor: 'white' }}>
                        <ViewPager style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            width: ScreenUtils.width - 110,
                            // height:110
                        }}
                                   swiperShow={this.state.swiperShow}
                                   arrayData={imageUrls}
                                   renderItem={(item) => this.renderViewPageItem(item)}
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
                                   height={110}

                        />
                        <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
                            {this.renderHotFlagView()}
                            {this.renderNormalView()}
                        </ScrollView>
                    </View>
                </View>
            </View>
        );
    }

    go2ResultPage(categoryId,name) {
        this.$navigate('home/search/SearchResultPage', { categoryId: categoryId ,name:name});
    }

    renderHotFlagView = () => {
        if (this.state.leftIndex == 0) {
            return (
                <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: 'black'
                        }}/>
                        <Text style={{ fontSize: 13, marginLeft: 5 }}>热门推荐</Text>
                    </View>
                    <View style={{
                        marginLeft: 23,
                        marginRight: 23,
                        flexDirection: 'row',
                        flexWrap: 'wrap'
                    }}>
                        {this.state.viewData.map((item, index) => {
                                return (
                                    <TouchableOpacity style={{ justifyContent: 'center', width: '33.3%', marginTop: 10 }}
                                                      key={index} onPress={() => this.go2ResultPage(item.id,item.name)}>
                                        <PreLoadImage style={{
                                            width: 60,
                                            height: 60,
                                            alignSelf: 'center'
                                        }} imageUri={item.img}/>
                                        <Text style={{
                                            fontSize: 13,
                                            marginTop: 10,
                                            alignSelf: 'center'
                                        }}>{item.name}</Text>
                                    </TouchableOpacity>
                                );
                            }
                        )}
                    </View>
                </View>

            );
        } else {
            return null;
        }

    };

    renderNormalView = () => {
        if (this.state.leftIndex != 0) {
            return (
                this.state.viewData.map((item, index) => {
                    return (
                        <View key={index} style={{ marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 6,
                                    backgroundColor: 'black'
                                }}/>
                                <Text style={{ fontSize: 13, marginLeft: 5 }}>{item.name}</Text>
                            </View>

                            <View style={{
                                marginLeft: 23,
                                marginRight: 23,
                                flexDirection: 'row',
                                flexWrap: 'wrap'
                            }}>
                                {this.state.viewData[index].productCategoryList ? this.state.viewData[index].productCategoryList.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            style={{ justifyContent: 'center', width: '33.3%', marginTop: 10 }}
                                            key={index} onPress={() => this.go2ResultPage(item.id,item.name)}>
                                            <PreLoadImage style={{
                                                width: 60,
                                                height: 60,
                                                alignSelf: 'center'
                                            }} imageUri={item.img}/>
                                            <Text style={{
                                                fontSize: 13,
                                                marginTop: 10,
                                                alignSelf: 'center'
                                            }}>{item.name}</Text>
                                        </TouchableOpacity>
                                    );
                                }) : null}
                            </View>
                        </View>
                    );
                })
            );
        }

    };

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
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
