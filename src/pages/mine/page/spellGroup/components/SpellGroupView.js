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
    FlatList
} from 'react-native';
// import RefreshFlatList from '../../../../../comm/components/RefreshFlatList';
import ListItemView from './ListItemView'

export default class SpellGroupView extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={[
                        {
                            'id': 741,  // 团ID
                            'activityCode': 'PTHD10002', //活动编号
                            'activityTag': 101105, // 活动tags
                            'groupType': 1,// 拼团类型 1 普通团 2 老带新团
                            'groupCount': 50,// 5人团
                            'surplusPerson': 20,//剩余人数
                            'goodsName': '我是商品名称12', // 商品名称
                            'image': 'https://cdn.sharegoodsmall.com/sharegoods/cc49225d27ae4c35ac62b4fbe6718b55.png', //商品图片
                            "prodCode":"SPU00021596", // prodCode
                            "skuCode":"SKU000215960003", // skuCode
                            "activityAmount":32336.22, //活动价格
                            "startTime":1599444000000, // 获取开始时间
                            "endTime":150001231314,  // 获取结束时间
                            "initiatorUserCode": "活动发起人",
                            "merchatOrderCode":"SJ0123123", // 商家订单号
                            "isJoinGroup":true, // 是否已经参团,
                            "nowTime":150001231314 , //服务器当前时间
                            "groupStatus":1,  // 1 开团 2 参团中 3 已成团 -1 拼团失败,

                        },
                        {
                            "id":741,  // 团ID
                            "activityCode":"PTHD10002", //活动编号
                            "activityTag":101105, // 活动tags
                            "groupType":1,// 拼团类型 1 普通团 2 老带新团
                            "groupCount":15,// 5人团
                            "surplusPerson": 4,//剩余人数
                            "goodsName":"我是商品名称122222", // 商品名称
                            "image":"https://cdn.sharegoodsmall.com/sharegoods/cc49225d27ae4c35ac62b4fbe6718b55.png", //商品图片
                            "prodCode":"SPU00021596", // prodCode
                            "skuCode":"SKU000215960003", // skuCode
                            "activityAmount":12336.22, //活动价格
                            "startTime":1599444000000, // 获取开始时间
                            "endTime":1599444000000,  // 获取结束时间
                            "initiatorUserCode": "活动发起人",
                            "merchatOrderCode":"SJ0123123", // 商家订单号
                            "isJoinGroup":true, // 是否已经参团,
                            "nowTime":150001231314 , //服务器当前时间
                            "groupStatus":2,  // 1 开团 2 参团中 3 已成团 -1 拼团失败,

                        },
                        {
                            "id":742,  // 团ID
                            "activityCode":"PTHD10003", //活动编号
                            "activityTag":101105, // 活动tags
                            "groupType":2,// 拼团类型 1 普通团 2 老带新团
                            "groupCount":15,// 5人团
                            "surplusPerson": 5,//剩余人数
                            "goodsName":"我是商品名称32323232", // 商品名称
                            "image":"https://cdn.sharegoodsmall.com/sharegoods/cc49225d27ae4c35ac62b4fbe6718b55.png", //商品图片
                            "prodCode":"SPU00021596", // prodCode
                            "skuCode":"SKU000215960003", // skuCode
                            "activityAmount":316.22, //活动价格
                            "startTime":1599444000000, // 获取开始时间
                            "endTime":1599444000000,  // 获取结束时间
                            "initiatorUserCode": "活动发起人",
                            "merchatOrderCode":"SJ0123123", // 商家订单号
                            "isJoinGroup":false, // 是否已经参团,
                            "nowTime":150001231314 , //服务器当前时间
                            "groupStatus":3,  // 1 开团 2 参团中 3 已成团 -1 拼团失败,
                        },
                        {
                            "id":742,  // 团ID
                            "activityCode":"PTHD10003", //活动编号
                            "activityTag":101105, // 活动tags
                            "groupType":2,// 拼团类型 1 普通团 2 老带新团
                            "groupCount":5,// 5人团
                            "surplusPerson": 2,//剩余人数
                            "goodsName":"我是商品名称我是商品名称我是商品名称我是商品名称我是商品名称", // 商品名称
                            "image":"https://cdn.sharegoodsmall.com/sharegoods/cc49225d27ae4c35ac62b4fbe6718b55.png", //商品图片
                            "prodCode":"SPU00021596", // prodCode
                            "skuCode":"SKU000215960003", // skuCode
                            "activityAmount":3236.22, //活动价格
                            "startTime":1599444000000, // 获取开始时间
                            "endTime":1599444000000,  // 获取结束时间
                            "initiatorUserCode": "活动发起人",
                            "merchatOrderCode":"SJ0123123", // 商家订单号
                            "isJoinGroup":false, // 是否已经参团,
                            "nowTime":150001231314 , //服务器当前时间
                            "groupStatus":-1,  // 1 开团 2 参团中 3 已成团 -1 拼团失败,
                        }
                    ]}//{[1,2,3,4,5,6,7,8,9,0,8,7,6,5,4,3]}
                    keyExtractor={(item, index)=>this.props.title+index}
                    renderItem = {this.renderItem}
                />

            </View>
        );
    }

    renderItem = ({item,index}) => {
        const {title } = this.props;
        return(
            <ListItemView
                item={item}
                index={index}
                title={title}
                onClick={(type)=>{
                    if(type){
                        alert('123')
                    }else {
                        alert('456')
                    }
                }}
            />
        )

    };


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },

});
