module.exports = {
    test: require('./data/test.json'),
    test_data: {
        name: 'jack',
        age: 10
    },

    makeSureOrder_data:{
    'code': 0,
    'msg':'成功',
    'data': {
    'warehouseNo': 'SO4514784441',
        'payTime': '2016-10-10 10:00:00',
        'orderStatus': 40,
        'receiverName': '张三',
        'receiverProvince': '浙江省',
        'receiverCity': '杭州市',
        'receiverArea': '西湖区',
        'receiverAddress': '古荡街道202号',
        'receiverMobile': '0571-45147411',
        'receiverPhone': '139898989898',
        'remark': '帮我快点发货，要发顺丰啊',
        'logisticsPrice':0,
        'orderDetail': [
           {
            'quantity': 10,
            'warehouseSkuCode': '65784554',
            'barcode': '785451112211',
            'name': '大苹果',
            'description': '大苹果',
            'returnStatus': 3,
            'unit': '个',
            'createTime':'2016-10-10 10:00:00',
            'updateTime':'2016-10-10 10:00:00'
        }
    ]

}

    }

};
