/**
 * Created by zhoujianxin on 2019/5/9.
 * @Desc
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react';
import RefreshList from '../../components/ui/RefreshList';
import Toast from '../../utils/bridge';
import res from './res';
import DesignRule from '../../constants/DesignRule';
import ScreenUtils from '../../utils/ScreenUtils';
import {showActiveModules} from './Show'

@observer
export default class ShowActivityView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewData:[1,2,3,4,5,6,7,8,9,0],
            isEmpty: false,
            currentPage: 1,
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
            this.getDataFromNetwork();
        }
    }

    onLoadMore = () => {
        if (!this.noMoreData) {
            console.log('onLoadMore',this.currentPage++);
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

    clickItem = (index) => {

    };

    getDataFromNetwork = () => {
        if (!this.isRefresh) {
            Toast.showLoading('加载中...');
        }
        setTimeout(()=>{
            this.isRefresh = false;
            Toast.hiddenLoading();
            this.isFirst = false;
            this.setState({ isError: false });
        },2000);

    };


    onListViewScroll = (event) => {
        let offsetY = event.nativeEvent.contentOffset.y;
        this.item0 && this.item0.measure((fx, fy, w, h, left, top) => {
            if(offsetY > ScreenUtils.height - 100){
                showActiveModules.setTopBtnHide(true);
            }else {
                showActiveModules.setTopBtnHide(false);
            }
        });
    };

    render() {
        return (
            <View style={styles.container} >
                {this.state.isError ? this.renderError() : <RefreshList
                    topBtn={showActiveModules.topBtnHide}
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    onListViewScroll={(e)=>{this.onListViewScroll(e)}}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    initialNumToRender={5}
                    ListHeaderComponent={<View style={{ height: 10 }}/>}
                />}
            </View>
        );
    }

    renderError() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.errContainer}>
                    <Image source={res.placeholder.netError}
                           style={{ width: DesignRule.autoSizeWidth(120), height: DesignRule.autoSizeWidth(120) }}
                           resizeMode={'contain'}/>
                    <Text style={styles.titleStyle} allowFontScaling={false}>
                        {this.state.errMsgText}
                    </Text>
                    <TouchableOpacity activeOpacity={0.5} style={styles.btnStyle}
                                      onPress={() => this.getDataFromNetwork()}>
                        <Text style={{
                            color: DesignRule.bgColor_btn,
                            fontSize: DesignRule.fontSize_mediumBtnText
                        }} allowFontScaling={false}>
                            重新加载
                        </Text>
                    </TouchableOpacity>

                </View>
            </TouchableWithoutFeedback>
        );
    }

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity ref={(ref)=>{this['item' + index] = ref}} key={'row' + index} onPress={()=>this.clickItem(index)}>
                <View style={styles.itemBgStyle}>
                    <Image style={styles.itemImgStyle} source={res.likeIcon}/>
                    <Text style={{marginLeft: 10, marginRight: 10, marginTop: 10}} numberOfLines={2}>
                        {index == 0 ? '马赛克妈妈说看看马上快递马上都没啦' : '你卡上你家阿三开电脑就看谁对你撒的缴纳进口税都能健康三等奖剋三角裤对你撒娇看到你就可能经常能看见吃的蔬菜十年春季开始接触拿手机看电脑'}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
                        <Image style={{width: 24, height: 24, borderRadius: 12, overflow: 'hidden',}}
                               source={res.hotIcon}/>
                        <Text style={{flex: 1, marginLeft: 5}} numberOfLines={1}>mksmaksdmkdksja你家阿三开电脑就看谁对你撒的缴纳进口税都能健康三等奖剋三角裤对你撒</Text>
                        <Image style={{width: 12, height: 16,}} source={res.hotIcon}/>
                        <Text style={{marginLeft:8}}>10000</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#F7F7F7'
    },
    errContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleStyle: {
        fontSize: 15,
        color: DesignRule.textColor_instruction,
        marginTop: 10,
        textAlign: 'center'
    },
    itemBgStyle:{
        marginLeft:15,
        marginTop:10,
        marginRight:15,
        backgroundColor:'white',
        // height:247,
        borderRadius: 5,
        overflow: 'hidden',
    },
    itemImgStyle:{
        height: 160,
        width: ScreenUtils.width - 30,
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
    }
});
