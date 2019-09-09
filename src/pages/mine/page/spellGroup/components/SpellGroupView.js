/**
 * @author zhoujianxin
 * @date on 2019/9/2.
 * @desc 拼团列表组件
 * @org www.sharegoodsmall.com
 * @email zhoujianxin@meeruu.com
 */

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text
} from 'react-native';
import RefreshFlatList from '../../../../../comm/components/RefreshFlatList';
import CommShareModal from '../../../../../comm/components/CommShareModal';
import LinearGradient from 'react-native-linear-gradient';
import ListItemView from './ListItemView';
import GroupSelectModel from './GroupSelectModel';
import MineApi from '../../../api/MineApi';
import res from '../../../../show/res';
import DesignRule from '../../../../../constants/DesignRule';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import apiEnvironment from '../../../../../api/ApiEnvironment';
import RouterMap from '../../../../../navigation/RouterMap';

export default class SpellGroupView extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            shareType:'',
            selectData:{}
        };
    }

    render() {
        const {params} = this.props;
        const {selectData} = this.state;
        return (
            <View style={styles.container}>
                <RefreshFlatList
                    ref={(ref) => {
                        this.List = ref;
                    }}
                    style={styles.container}
                    url={MineApi.getGroupList}
                    renderItem = {this.renderItem}
                    params={{groupStatus: params}}
                    renderError={this.renderEmpty}
                    renderEmpty={this.renderEmpty}
                />
                <GroupSelectModel
                    ref={(ref) => {
                        this.SelectModel = ref
                    }}
                    createAD={(data) => {
                        this.setState({
                            shareType: data
                        }, () => {
                            this.ShareModel.open && this.ShareModel.open();
                        });
                    }}
                    inviteShare={(data) => {
                        this.setState({
                            shareType: data
                        }, () => {
                            this.ShareModel.open && this.ShareModel.open();
                        })
                    }}

                />
                <CommShareModal
                    ref={(ref) => {
                        this.ShareModel = ref
                    }}
                    type={this.state.shareType}
                    imageJson={{ // 分享商品图片的数据
                        imageUrlStr: selectData.image || 'logo.png',
                        imageType: 'group', // 为空就是生成商品分享的图片， web：网页分享的图片 group:生成拼团海报
                        titleStr: selectData.goodsName || '秀一秀，赚到够',
                        priceStr: selectData.activityAmount + '', // 拼团活动价格
                        originalPrice: selectData.skuPrice + '',//划线价格
                        QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/activity/groupBuyDetails/${selectData.id ? selectData.id : ''}`,
                    }}
                    webJson={{
                        title: `[仅剩${selectData.surplusPerson}个名额] 我${selectData.activityAmount || ''}元带走了${selectData.goodsName || ''}` || '秀一秀，赚到够',//分享标题(当为图文分享时候使用)
                        linkUrl: `${apiEnvironment.getCurrentH5Url()}/activity/groupBuyDetails/${selectData.id ? selectData.id : ''}`,//(图文分享下的链接)
                        thumImage: selectData.image || 'logo.png',//(分享图标小图(https链接)图文分享使用)
                        dec: `我买了${selectData.goodsName || ''}，该商品已拼${selectData.alreadySaleNum || ''}件了，快来参团吧!`
                    }}
                />
            </View>
        );
    }

    renderEmpty = ()=>{
        return (
            <View style={styles.errContainer}>

                <Image source={res.placeholder.no_data}
                       style={{width: DesignRule.autoSizeWidth(275), height: DesignRule.autoSizeWidth(150)}}
                       resizeMode={'contain'}/>
                <Text style={{marginTop:6,marginBottom: 20,fontSize:13,color:'#999999'}}> 暂无拼团 </Text>
                <LinearGradient style={{borderRadius: 17}}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                colors={['#FC5D39', '#FF0050']}
                >
                    <TouchableOpacity activeOpacity={0.5} style={{alignItems: 'center'}}
                                      onPress={() => {

                                      }}>
                        <View style={styles.btnStyle}>
                            <Text style={{color: 'white', fontSize: 15}} allowFontScaling={false}>
                                去拼团首页<Text style={{fontSize:17}}> ></Text>
                            </Text>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        );
    };

    renderItem = ({item,index}) => {
        const {title } = this.props;
        console.log('item',item)
        return(
            <ListItemView
                item={item}
                index={index}
                title={title}
                onClick={(type,data) => {
                    if (type) {
                        this.setState({
                            selectData:data
                            });
                        this.SelectModel.onOpen && this.SelectModel.onOpen();
                    } else {
                        this.props.navigate(RouterMap.HtmlPage, {
                            uri: `${apiEnvironment.getCurrentH5Url()}/activity/groupBuyDetails/${item.id}`
                        });
                    }
                }}
            />
        )

    };


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7'
    },
    errContainer: {
        flex: 1,
        height: ScreenUtils.height-ScreenUtils.headerHeight-40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    btnStyle:{
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:20,
        marginVertical:6,
        borderRadius: 17
    }

});
