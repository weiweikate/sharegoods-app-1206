/**
 * Created by zhoujianxin on 2019/5/9.
 * @Desc
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import {observer} from 'mobx-react';
import RefreshList from '../../components/ui/RefreshList';
import Toast from '../../utils/bridge';
import res from './res';
import DesignRule from '../../constants/DesignRule';
import ScreenUtils from '../../utils/ScreenUtils';
import {showActiveModules} from './Show';
import ShowApi from './ShowApi';
import PreLoadImage from '../../components/ui/preLoadImage/PreLoadImage';

import {MRText} from '../../components/ui';
import EmptyUtils from "../../utils/EmptyUtils";

@observer
export default class ShowActivityView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            isEmpty: false,
            currentPage: 1,
            firstLoading: 1, //1：加载动画 2 动画结束
            isError: false,
            errMsgText: '发生错误',
        };
        this.currentPage = 1;
        this.noMoreData = false;
        this.isFirst = true;
        this.isRefresh = false;
    }

    componentDidMount() {
        //网络请求，业务处理
        if (this.isFirst) {
            this.time = setTimeout(() => {
                this.getDataFromNetwork();
            }, 700);
        }
    }

    componentWillUnmount() {
    this.time && this.time.removeAll();
    }

    onLoadMore = () => {
        if (!this.noMoreData) {
            console.log('onLoadMore', this.currentPage++);
            this.currentPage++;
            this.getDataFromNetwork();
        }
    };

    onRefresh = () => {
        console.log('onRefresh', this.currentPage);
        this.currentPage = 1;
        this.isRefresh = true;
        this.getDataFromNetwork();
    };

    clickItem = (item, index) => {
        this.props.clickItem && this.props.clickItem(index,item);
    };

    replaceItemData=(index,data)=>{
        let itemData = JSON.parse(data);
        let dataSource = this.state.viewData;
        dataSource[index] = itemData;
        this.setState({
            viewData:dataSource
        })
    };

    replaceData=(index,data)=>{

    };

    getDataFromNetwork = () => {
        if (!this.isRefresh) {
            // Toast.showLoading('加载中...');
        }
            ShowApi.showActivity({page: this.currentPage, size: 10, spreadPosition: 4}).then(result => {
                if (result.code && result.code === 10000) {
                    if (result.data && result.data.data) {
                        Toast.hiddenLoading();
                        this.isFirst = false;
                        this.setState({
                            firstLoading: 2,
                            viewData: result.data ? result.data.data : [],
                            isEmpty: result.data.totalNum === 0, isError: false
                        });
                    }else {
                        this.setState({isError: true, firstLoading: 2});
                    }
                }
            }).catch(err => {
                Toast.hiddenLoading();
                this.setState({isError: true, firstLoading: 2});
                Toast.$toast(err.msg);
            });
    };


    onListViewScroll = (event) => {
        let offsetY = event.nativeEvent.contentOffset.y;
        this.item0 && this.item0.measure((fx, fy, w, h, left, top) => {
            if (offsetY > ScreenUtils.height - 100) {
                showActiveModules.setTopBtnHide(true);
            } else {
                showActiveModules.setTopBtnHide(false);
            }
        });
    };

    render() {
        return (
            <View style={styles.container}>
                {this.state.isError ? this.renderError() : <RefreshList
                    topBtn={showActiveModules.topBtnHide}
                    isHideFooter={false}
                    firstLoading={this.state.firstLoading}
                    data={this.state.viewData}
                    headerData={[0]}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    onListViewScroll={(e) => {
                        this.onListViewScroll(e)
                    }}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={'暂无数据'}
                    initialNumToRender={5}
                    ListHeaderComponent={<View style={{height: 10}}/>}
                />}
            </View>
        );
    }

    renderError() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.errContainer}>
                    <TouchableOpacity activeOpacity={0.5} style={{alignItems: 'center'}}
                                      onPress={() => this.getDataFromNetwork()}>
                        <Image source={res.placeholder.no_data_img}
                               style={{width: DesignRule.autoSizeWidth(120), height: DesignRule.autoSizeWidth(120)}}
                               resizeMode={'contain'}/>
                        <Text style={{
                            marginTop: 10,
                            color: '#666666',
                            fontSize: DesignRule.fontSize_mediumBtnText
                        }} allowFontScaling={false}>
                            重新加载
                        </Text>
                    </TouchableOpacity>

                </View>
            </TouchableWithoutFeedback>
        );
    }

    renderItem = ({item, index}) => {
        console.log(item)
        let imageUrl = '';
        let len = EmptyUtils.isEmptyArr(item.resource)?0:item.resource.length;
        for(let i = 0;i < len;i++){
            if (item.resource[i].type === 3) {
                imageUrl= item.resource[i].url;
                break;
            }
        }
        console.log(imageUrl)
        return (
            <TouchableOpacity ref={(ref) => {
                this['item' + index] = ref
            }} key={'row' + index} onPress={() => this.clickItem(item, index)}>
                <View style={styles.itemBgStyle}>
                    <Image style={styles.itemImgStyle} source={{uri:imageUrl.length>0 ?imageUrl : '111.png'}}/>
                    {ScreenUtils.isIOS ?
                        <Text style={styles.contentStyle}
                                               numberOfLines={2}>
                            {item.title}
                        </Text> :
                        <MRText style={styles.contentStyle}
                                numberOfLines={2}>
                            {item.title}
                        </MRText>
                    }
                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
                        <PreLoadImage
                            imageUri={item.userInfoVO && item.userInfoVO.userImg}
                            style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12
                            }}
                            defaultImage={res.placeholder.noHeadImage}
                            errImage={res.placeholder.noHeadImage}
                        />
                        <Text style={{flex: 1, marginLeft: 5,color:'#666666',fontSize:DesignRule.fontSize_22}}
                              numberOfLines={1}>{item.userInfoVO && item.userInfoVO.userName}
                        </Text>
                        <Image style={{width: 12, height: 16,marginLeft: 10}} source={res.hotIcon}/>
                        <Text style={{marginLeft: 8,color:'#666666',fontSize:DesignRule.fontSize_22}}>
                            {item.hotCount ? item.hotCount > 999 ? item.hotCount > 100000 ? '10w+' : '999+' : item.hotCount : '0'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7'
    },
    errContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    titleStyle: {
        fontSize: 15,
        color: DesignRule.textColor_instruction,
        marginTop: 10,
        textAlign: 'center'
    },
    itemBgStyle: {
        marginLeft: 15,
        marginTop: 10,
        marginRight: 15,
        backgroundColor: 'white',
        // height:247,
        borderRadius: 5,
        overflow: 'hidden',
    },
    itemImgStyle: {
        height: 160,
        width: ScreenUtils.width - 30,
        backgroundColor: '#a5adb3',
        borderRadius: 5,
        overflow: 'hidden',
    },
    btnText: {
        fontSize: 15,
        color: DesignRule.mainColor,
        textAlign: 'center'
    },
    btnStyle: {
        height: 36,
        width: 115,
        borderRadius: 18,
        borderColor: DesignRule.bgColor_btn,
        borderWidth: DesignRule.lineHeight * 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    contentStyle:{
        flex:1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        fontSize:DesignRule.fontSize_24,
        color:'#333333',
    }
});
