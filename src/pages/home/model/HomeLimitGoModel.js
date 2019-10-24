import { action, computed, flow, observable } from 'mobx';
import ScreenUtils from '../../../utils/ScreenUtils';
import { asyncHandleTopicData, homeType } from '../HomeTypes';
import { homeModule } from './Modules';
import HomeApi from '../api/HomeAPI';
import { differenceInCalendarDays, format } from 'date-fns';
import bridge from '../../../utils/bridge';

const { px2dp } = ScreenUtils;

export const limitStatus = {
    del: 0, //删除
    noBegin: 1, //未开始
    doing: 2, //进行中
    end: 3, //已售完
    endTime: 4, //时间结束
    endDone: 5 //手动结束
};

const res = {
    'code': 10000,
    'msg': '业务处理成功',
    'data': [
        {
            'simpleActivity': {
                'code': 'MSHD1910150007',
                'name': '限时购10.17日15点',
                'memo': null,
                'type': 0,
                'activityTag': 0,
                'activityTagDesc': null,
                'groupNum': null,
                'startTime': 1571295600000,
                'endTime': 1571382000000,
                'publishTime': 1571252400000,
                'currentTime': 1571377348495,
                'couponLimit': false,
                'tag': null,
                'extraProperty': 'toSpike',
                'status': 2
            },
            'productDetailList': [
                {
                    'prodCode': 'SPU00027044',
                    'name': '儿童加绒保暖内衣套装1',
                    'secondName': '卡通印花 柔软舒适1',
                    'videoUrl': null,
                    'imgUrl': 'https://cdn.sharegoodsmall.com/sharegoods/42ee56f7387a4b6182c9039a882ad613.jpg',
                    'firstCategoryId': 334,
                    'secCategoryId': 346,
                    'thirdCategoryId': 347,
                    'brandId': 1735,
                    'supplierCode': null,
                    'sendMode': null,
                    'afterSaleServiceDays': 15,
                    'buyLimit': null,
                    'leftBuyNum': null,
                    'upTime': null,
                    'content': 'https://cdn.sharegoodsmall.com/sharegoods/5ef34d6e953a41eb9d9fb173de00ff1f.jpg',
                    'firstCategoryName': '母婴玩具',
                    'secCategoryName': '童装裤袜',
                    'thirdCategoryName': '套装',
                    'brandName': '顶瓜瓜',
                    'supplierName': null,
                    'restrictions': null,
                    'overtimeComment': 0,
                    'totalComment': 0,
                    'originalPrice': '119',
                    'groupPrice': '52.9',
                    'minPrice': '52.9',
                    'maxPrice': '52.9',
                    'v0Price': '52.9',
                    'priceType': null,
                    'monthSaleCount': 125,
                    'freight': '0.00',
                    'productStatus': 1,
                    'shareMoney': null,
                    'now': null,
                    'shopId': null,
                    'title': null,
                    'promotionResult': null,
                    'promotionDecreaseAmount': '13',
                    'promotionSaleNum': 106,
                    'promotionStockNum': 1574,
                    'promotionPurchasedNum': null,
                    'promotionMinPrice': '39.9',
                    'promotionMaxPrice': '39.9',
                    'promotionPrice': '39.9',
                    'promotionLimitNum': null,
                    'promotionSort': 12,
                    'promotionStatus': 2,
                    'promotionAttentionNum': 383,
                    'promotionAttention': false,
                    'promotionSaleRate': 0.6924
                },
                {
                    'specialSubject': {
                        'config': {
                            'topicCode': 'ZDYZT201910181820021',
                            'code': 'WIDGET-CONFIG:157139333497716093',
                            'sharePosterUrl': 'https://cdn.sharegoodsmall.com/sharegoods/3a702720979e4a419a798d7c0ee2a129.jpg',
                            'release': 1,
                            'type': 'WIDGET-CONFIG',
                            'title': '基础配置',
                            'timingNotExists': true,
                            'timingEnabled': false,
                            'shareTitle': '秀购精选爆款',
                            'bgColor': '#CB2544',
                            'overIsShow': true,
                            'shareImgUrl': 'http://uatcdn.sharegoodsmall.com/sharegoods/h5/resource/custom/logo.png',
                            'isShare': true,
                            'topicName': '秀购精选爆款',
                            'time': [
                                1571328000000,
                                1635350400000
                            ],
                            'beginTime': 1571328000000,
                            'endTime': 1635350400000,
                            'shareSubTitle': '搜罗大牌 对标底价',
                            'status': 1
                        },
                        'widgets': {
                            'currentPage': 1,
                            'data': [
                                {
                                    'layout': '1',
                                    'bgImgSrc': '',
                                    'imgs': [
                                        {
                                            'code': '1571393388365183',
                                            'src': 'https://cdn.sharegoodsmall.com/sharegoods/f5abc28530d34d90b452e70a9b3baf60.jpg',
                                            'width': 750,
                                            'links': [
                                                {
                                                    'linkValue': [],
                                                    'linkId': 22,
                                                    'linkType': 5
                                                }
                                            ],
                                            'height': 486
                                        }
                                    ],
                                    'timingEnabled': false,
                                    'itemPadding': 20,
                                    'code': 'WIDGET-IMAGE-ADV:157139338562112523',
                                    'data': [],
                                    'boxPadding': 0,
                                    'type': 'WIDGET-IMAGE-ADV',
                                    'title': '图片广告',
                                    'timingValue': [],
                                    'navStyle': 1
                                },
                                {
                                    'layout': '1',
                                    'bgImgSrc': '',
                                    'imgs': [
                                        {
                                            'code': '1571393402125853',
                                            'src': 'https://cdn.sharegoodsmall.com/sharegoods/5e665fda45774858a470143bba5c96d8.jpg',
                                            'width': 750,
                                            'links': [
                                                {
                                                    'linkValue': [],
                                                    'linkId': 23,
                                                    'linkType': 5
                                                }
                                            ],
                                            'height': 128
                                        }
                                    ],
                                    'timingEnabled': false,
                                    'itemPadding': 20,
                                    'code': 'WIDGET-IMAGE-ADV:157139339978918655',
                                    'data': [],
                                    'boxPadding': 0,
                                    'type': 'WIDGET-IMAGE-ADV',
                                    'title': '图片广告',
                                    'timingValue': [],
                                    'navStyle': 1
                                },
                                {
                                    'codes': [
                                        'SPU00028462'
                                    ],
                                    'priceInMainPicVisible': false,
                                    'cornerImgSrc': 'https://uatcdn.sharegoodsmall.com/sharegoods/h5/resource/custom/hot.png',
                                    'code': 'WIDGET-GOODS:157139341143013673',
                                    'data': [
                                        {
                                            'brandName': '白熊心品',
                                            'firstCategoryId': 419,
                                            'firstCategoryName': '日用百货',
                                            'freight': 0,
                                            'freightTemplateName': '白熊心品珐琅锅',
                                            'groupPrice': 260,
                                            'imgUrl': 'https://cdn.sharegoodsmall.com/sharegoods/894505fc3bbd4b95870873c869faa74f.jpg',
                                            'maxPrice': 260,
                                            'minPrice': 159,
                                            'name': '白熊心品多功能珐琅铸铁锅',
                                            'nondeliveryTemplateName': '珐琅锅',
                                            'originalPrice': 399,
                                            'prodCode': 'SPU00028462',
                                            'productStatus': 1,
                                            'secCategoryId': 428,
                                            'secCategoryName': '厨房用品',
                                            'secondName': '',
                                            'status': 3,
                                            'thirdCategoryId': 429,
                                            'thirdCategoryName': '锅具炊具',
                                            'v0Price': 260
                                        }
                                    ],
                                    'priceNameAlias': '活动价',
                                    'buyButtonText': '立即抢购',
                                    'priceBelowTitleVisible': true,
                                    'cornerPosition': 'left-top',
                                    'type': 'WIDGET-GOODS',
                                    'title': '商品',
                                    'buyButtonType': 2,
                                    'timingEnabled': false,
                                    'subtitleVisible': true,
                                    'priceNameVisible': true,
                                    'priceHasInvalidVisible': true,
                                    'mainPicBorderVisible': false,
                                    'timingValue': [],
                                    'cornerType': 'hot',
                                    'itemPadding': 0,
                                    'titleVisible': true,
                                    'priceVisible': true,
                                    'commissionVisible': false,
                                    'layout': 1,
                                    'buyButtonVisible': true,
                                    'cornerVisible': true,
                                    'showMore': {
                                        'linkValue': [],
                                        'visible': true,
                                        'linkId': 24
                                    },
                                    'boxPadding': 30
                                },
                                {
                                    'layout': '1',
                                    'bgImgSrc': '',
                                    'imgs': [
                                        {
                                            'code': '1571393543286938',
                                            'src': 'https://cdn.sharegoodsmall.com/sharegoods/c8b66c0adff9481984cb0ab4c4635159.jpg',
                                            'width': 750,
                                            'links': [
                                                {
                                                    'linkValue': [],
                                                    'linkId': 25,
                                                    'linkType': 5
                                                }
                                            ],
                                            'height': 185
                                        }
                                    ],
                                    'timingEnabled': false,
                                    'itemPadding': 20,
                                    'code': 'WIDGET-IMAGE-ADV:157139354037518397',
                                    'data': [],
                                    'boxPadding': 0,
                                    'type': 'WIDGET-IMAGE-ADV',
                                    'title': '图片广告',
                                    'timingValue': [],
                                    'navStyle': 1
                                },
                                {
                                    'codes': [
                                        'SPU00027155'
                                    ],
                                    'priceInMainPicVisible': false,
                                    'cornerImgSrc': 'https://uatcdn.sharegoodsmall.com/sharegoods/h5/resource/custom/hot.png',
                                    'code': 'WIDGET-GOODS:157139355815815318',
                                    'data': [
                                        {
                                            'brandName': '果耶',
                                            'firstCategoryId': 119,
                                            'firstCategoryName': '生鲜果蔬',
                                            'freight': 0,
                                            'freightTemplateName': '一件代发模板',
                                            'groupPrice': 26.9,
                                            'imgUrl': 'https://cdn.sharegoodsmall.com/sharegoods/b70d885522114ccea969402e7dbfdd05.jpg',
                                            'maxPrice': 36.9,
                                            'minPrice': 26.9,
                                            'name': '【长在高原 够野够甜】 四川盐源丑苹果 大凉山红富士 顺丰包邮 5斤果径70-80mm',
                                            'nondeliveryTemplateName': '平台不支持配送区域SPU00002598',
                                            'originalPrice': 59,
                                            'prodCode': 'SPU00027155',
                                            'productStatus': 1,
                                            'secCategoryId': 120,
                                            'secCategoryName': '新鲜水果',
                                            'secondName': '',
                                            'status': 3,
                                            'thirdCategoryId': 123,
                                            'thirdCategoryName': '苹果',
                                            'v0Price': 26.9
                                        }
                                    ],
                                    'priceNameAlias': '活动价',
                                    'buyButtonText': '立即抢购',
                                    'priceBelowTitleVisible': true,
                                    'cornerPosition': 'left-top',
                                    'type': 'WIDGET-GOODS',
                                    'title': '商品',
                                    'buyButtonType': 2,
                                    'timingEnabled': false,
                                    'subtitleVisible': true,
                                    'priceNameVisible': true,
                                    'priceHasInvalidVisible': true,
                                    'mainPicBorderVisible': false,
                                    'timingValue': [],
                                    'cornerType': 'hot',
                                    'itemPadding': 0,
                                    'titleVisible': true,
                                    'priceVisible': true,
                                    'commissionVisible': false,
                                    'layout': 1,
                                    'buyButtonVisible': true,
                                    'cornerVisible': false,
                                    'showMore': {
                                        'linkValue': [],
                                        'visible': true,
                                        'linkId': 26
                                    },
                                    'boxPadding': 30
                                }
                            ],
                            'isMore': 1,
                            'pageSize': 5,
                            'startIndex': 0,
                            'totalNum': 7,
                            'totalPage': 2
                        }
                    }
                },
                {
                    'prodCode': 'SPU00027044',
                    'name': '儿童加绒保暖内衣套装',
                    'secondName': '卡通印花 柔软舒适',
                    'videoUrl': null,
                    'imgUrl': 'https://cdn.sharegoodsmall.com/sharegoods/42ee56f7387a4b6182c9039a882ad613.jpg',
                    'firstCategoryId': 334,
                    'secCategoryId': 346,
                    'thirdCategoryId': 347,
                    'brandId': 1735,
                    'supplierCode': null,
                    'sendMode': null,
                    'afterSaleServiceDays': 15,
                    'buyLimit': null,
                    'leftBuyNum': null,
                    'upTime': null,
                    'content': 'https://cdn.sharegoodsmall.com/sharegoods/5ef34d6e953a41eb9d9fb173de00ff1f.jpg',
                    'firstCategoryName': '母婴玩具',
                    'secCategoryName': '童装裤袜',
                    'thirdCategoryName': '套装',
                    'brandName': '顶瓜瓜',
                    'supplierName': null,
                    'restrictions': null,
                    'overtimeComment': 0,
                    'totalComment': 0,
                    'originalPrice': '119',
                    'groupPrice': '52.9',
                    'minPrice': '52.9',
                    'maxPrice': '52.9',
                    'v0Price': '52.9',
                    'priceType': null,
                    'monthSaleCount': 125,
                    'freight': '0.00',
                    'productStatus': 1,
                    'shareMoney': null,
                    'now': null,
                    'shopId': null,
                    'title': null,
                    'promotionResult': null,
                    'promotionDecreaseAmount': '13',
                    'promotionSaleNum': 106,
                    'promotionStockNum': 1574,
                    'promotionPurchasedNum': null,
                    'promotionMinPrice': '39.9',
                    'promotionMaxPrice': '39.9',
                    'promotionPrice': '39.9',
                    'promotionLimitNum': null,
                    'promotionSort': 12,
                    'promotionStatus': 2,
                    'promotionAttentionNum': 383,
                    'promotionAttention': false,
                    'promotionSaleRate': 0.6924
                }
            ]
        }, {
            'simpleActivity': {
                'code': 'MSHD1910150007',
                'name': '限时购10.17日15点',
                'memo': null,
                'type': 0,
                'activityTag': 0,
                'activityTagDesc': null,
                'groupNum': null,
                'startTime': 1571295700000,
                'endTime': 1571382000000,
                'publishTime': 1571252400000,
                'currentTime': 1571377348495,
                'couponLimit': false,
                'tag': null,
                'extraProperty': 'toSpike',
                'status': 2
            },
            'productDetailList': [
                {
                    'specialSubject': {
                        'config': {
                            'topicCode': 'ZDYZT201910181820021',
                            'code': 'WIDGET-CONFIG:157139333497716093',
                            'sharePosterUrl': 'https://cdn.sharegoodsmall.com/sharegoods/3a702720979e4a419a798d7c0ee2a129.jpg',
                            'release': 1,
                            'type': 'WIDGET-CONFIG',
                            'title': '基础配置',
                            'timingNotExists': true,
                            'timingEnabled': false,
                            'shareTitle': '秀购精选爆款',
                            'bgColor': '#CB2544',
                            'overIsShow': true,
                            'shareImgUrl': 'http://uatcdn.sharegoodsmall.com/sharegoods/h5/resource/custom/logo.png',
                            'isShare': true,
                            'topicName': '秀购精选爆款',
                            'time': [
                                1571328000000,
                                1635350400000
                            ],
                            'beginTime': 1571328000000,
                            'endTime': 1635350400000,
                            'shareSubTitle': '搜罗大牌 对标底价',
                            'status': 1
                        },
                        'widgets': {
                            'currentPage': 1,
                            'data': [
                                {
                                    'layout': '1',
                                    'bgImgSrc': '',
                                    'imgs': [
                                        {
                                            'code': '1571393388365183',
                                            'src': 'https://cdn.sharegoodsmall.com/sharegoods/f5abc28530d34d90b452e70a9b3baf60.jpg',
                                            'width': 750,
                                            'links': [
                                                {
                                                    'linkValue': [],
                                                    'linkId': 22,
                                                    'linkType': 5
                                                }
                                            ],
                                            'height': 486
                                        }
                                    ],
                                    'timingEnabled': false,
                                    'itemPadding': 20,
                                    'code': 'WIDGET-IMAGE-ADV:157139338562112523',
                                    'data': [],
                                    'boxPadding': 0,
                                    'type': 'WIDGET-IMAGE-ADV',
                                    'title': '图片广告',
                                    'timingValue': [],
                                    'navStyle': 1
                                },
                                {
                                    'layout': '1',
                                    'bgImgSrc': '',
                                    'imgs': [
                                        {
                                            'code': '1571393402125853',
                                            'src': 'https://cdn.sharegoodsmall.com/sharegoods/5e665fda45774858a470143bba5c96d8.jpg',
                                            'width': 750,
                                            'links': [
                                                {
                                                    'linkValue': [],
                                                    'linkId': 23,
                                                    'linkType': 5
                                                }
                                            ],
                                            'height': 128
                                        }
                                    ],
                                    'timingEnabled': false,
                                    'itemPadding': 20,
                                    'code': 'WIDGET-IMAGE-ADV:157139339978918655',
                                    'data': [],
                                    'boxPadding': 0,
                                    'type': 'WIDGET-IMAGE-ADV',
                                    'title': '图片广告',
                                    'timingValue': [],
                                    'navStyle': 1
                                },
                                {
                                    'codes': [
                                        'SPU00028462'
                                    ],
                                    'priceInMainPicVisible': false,
                                    'cornerImgSrc': 'https://uatcdn.sharegoodsmall.com/sharegoods/h5/resource/custom/hot.png',
                                    'code': 'WIDGET-GOODS:157139341143013673',
                                    'data': [
                                        {
                                            'brandName': '白熊心品',
                                            'firstCategoryId': 419,
                                            'firstCategoryName': '日用百货',
                                            'freight': 0,
                                            'freightTemplateName': '白熊心品珐琅锅',
                                            'groupPrice': 260,
                                            'imgUrl': 'https://cdn.sharegoodsmall.com/sharegoods/894505fc3bbd4b95870873c869faa74f.jpg',
                                            'maxPrice': 260,
                                            'minPrice': 159,
                                            'name': '白熊心品多功能珐琅铸铁锅',
                                            'nondeliveryTemplateName': '珐琅锅',
                                            'originalPrice': 399,
                                            'prodCode': 'SPU00028462',
                                            'productStatus': 1,
                                            'secCategoryId': 428,
                                            'secCategoryName': '厨房用品',
                                            'secondName': '',
                                            'status': 3,
                                            'thirdCategoryId': 429,
                                            'thirdCategoryName': '锅具炊具',
                                            'v0Price': 260
                                        }
                                    ],
                                    'priceNameAlias': '活动价',
                                    'buyButtonText': '立即抢购',
                                    'priceBelowTitleVisible': true,
                                    'cornerPosition': 'left-top',
                                    'type': 'WIDGET-GOODS',
                                    'title': '商品',
                                    'buyButtonType': 2,
                                    'timingEnabled': false,
                                    'subtitleVisible': true,
                                    'priceNameVisible': true,
                                    'priceHasInvalidVisible': true,
                                    'mainPicBorderVisible': false,
                                    'timingValue': [],
                                    'cornerType': 'hot',
                                    'itemPadding': 0,
                                    'titleVisible': true,
                                    'priceVisible': true,
                                    'commissionVisible': false,
                                    'layout': 1,
                                    'buyButtonVisible': true,
                                    'cornerVisible': true,
                                    'showMore': {
                                        'linkValue': [],
                                        'visible': true,
                                        'linkId': 24
                                    },
                                    'boxPadding': 30
                                },
                                {
                                    'layout': '1',
                                    'bgImgSrc': '',
                                    'imgs': [
                                        {
                                            'code': '1571393543286938',
                                            'src': 'https://cdn.sharegoodsmall.com/sharegoods/c8b66c0adff9481984cb0ab4c4635159.jpg',
                                            'width': 750,
                                            'links': [
                                                {
                                                    'linkValue': [],
                                                    'linkId': 25,
                                                    'linkType': 5
                                                }
                                            ],
                                            'height': 185
                                        }
                                    ],
                                    'timingEnabled': false,
                                    'itemPadding': 20,
                                    'code': 'WIDGET-IMAGE-ADV:157139354037518397',
                                    'data': [],
                                    'boxPadding': 0,
                                    'type': 'WIDGET-IMAGE-ADV',
                                    'title': '图片广告',
                                    'timingValue': [],
                                    'navStyle': 1
                                },
                                {
                                    'codes': [
                                        'SPU00027155'
                                    ],
                                    'priceInMainPicVisible': false,
                                    'cornerImgSrc': 'https://uatcdn.sharegoodsmall.com/sharegoods/h5/resource/custom/hot.png',
                                    'code': 'WIDGET-GOODS:157139355815815318',
                                    'data': [
                                        {
                                            'brandName': '果耶',
                                            'firstCategoryId': 119,
                                            'firstCategoryName': '生鲜果蔬',
                                            'freight': 0,
                                            'freightTemplateName': '一件代发模板',
                                            'groupPrice': 26.9,
                                            'imgUrl': 'https://cdn.sharegoodsmall.com/sharegoods/b70d885522114ccea969402e7dbfdd05.jpg',
                                            'maxPrice': 36.9,
                                            'minPrice': 26.9,
                                            'name': '【长在高原 够野够甜】 四川盐源丑苹果 大凉山红富士 顺丰包邮 5斤果径70-80mm',
                                            'nondeliveryTemplateName': '平台不支持配送区域SPU00002598',
                                            'originalPrice': 59,
                                            'prodCode': 'SPU00027155',
                                            'productStatus': 1,
                                            'secCategoryId': 120,
                                            'secCategoryName': '新鲜水果',
                                            'secondName': '',
                                            'status': 3,
                                            'thirdCategoryId': 123,
                                            'thirdCategoryName': '苹果',
                                            'v0Price': 26.9
                                        }
                                    ],
                                    'priceNameAlias': '活动价',
                                    'buyButtonText': '立即抢购',
                                    'priceBelowTitleVisible': true,
                                    'cornerPosition': 'left-top',
                                    'type': 'WIDGET-GOODS',
                                    'title': '商品',
                                    'buyButtonType': 2,
                                    'timingEnabled': false,
                                    'subtitleVisible': true,
                                    'priceNameVisible': true,
                                    'priceHasInvalidVisible': true,
                                    'mainPicBorderVisible': false,
                                    'timingValue': [],
                                    'cornerType': 'hot',
                                    'itemPadding': 0,
                                    'titleVisible': true,
                                    'priceVisible': true,
                                    'commissionVisible': false,
                                    'layout': 1,
                                    'buyButtonVisible': true,
                                    'cornerVisible': false,
                                    'showMore': {
                                        'linkValue': [],
                                        'visible': true,
                                        'linkId': 26
                                    },
                                    'boxPadding': 30
                                }
                            ],
                            'isMore': 1,
                            'pageSize': 5,
                            'startIndex': 0,
                            'totalNum': 7,
                            'totalPage': 2
                        }
                    }
                },
                {
                    'prodCode': 'SPU00027044',
                    'name': '儿童加绒保暖内衣套装',
                    'secondName': '卡通印花 柔软舒适',
                    'videoUrl': null,
                    'imgUrl': 'https://cdn.sharegoodsmall.com/sharegoods/42ee56f7387a4b6182c9039a882ad613.jpg',
                    'firstCategoryId': 334,
                    'secCategoryId': 346,
                    'thirdCategoryId': 347,
                    'brandId': 1735,
                    'supplierCode': null,
                    'sendMode': null,
                    'afterSaleServiceDays': 15,
                    'buyLimit': null,
                    'leftBuyNum': null,
                    'upTime': null,
                    'content': 'https://cdn.sharegoodsmall.com/sharegoods/5ef34d6e953a41eb9d9fb173de00ff1f.jpg',
                    'firstCategoryName': '母婴玩具',
                    'secCategoryName': '童装裤袜',
                    'thirdCategoryName': '套装',
                    'brandName': '顶瓜瓜',
                    'supplierName': null,
                    'restrictions': null,
                    'overtimeComment': 0,
                    'totalComment': 0,
                    'originalPrice': '119',
                    'groupPrice': '52.9',
                    'minPrice': '52.9',
                    'maxPrice': '52.9',
                    'v0Price': '52.9',
                    'priceType': null,
                    'monthSaleCount': 125,
                    'freight': '0.00',
                    'productStatus': 1,
                    'shareMoney': null,
                    'now': null,
                    'shopId': null,
                    'title': null,
                    'promotionResult': null,
                    'promotionDecreaseAmount': '13',
                    'promotionSaleNum': 106,
                    'promotionStockNum': 1574,
                    'promotionPurchasedNum': null,
                    'promotionMinPrice': '39.9',
                    'promotionMaxPrice': '39.9',
                    'promotionPrice': '39.9',
                    'promotionLimitNum': null,
                    'promotionSort': 12,
                    'promotionStatus': 2,
                    'promotionAttentionNum': 383,
                    'promotionAttention': false,
                    'promotionSaleRate': 0.6924
                }
            ]
        }
    ]
};

export class LimitGoModules {
    spikeList = [];
    currentGoodsList = [];
    @observable currentPage = -1;
    @observable isShowFreeOrder = false;

    @computed get limitTopHeight() {
        let height = px2dp(42);
        if (this.isShowFreeOrder) {
            height += px2dp(50);
        }
        return height;
    }

    @computed get limitTimeHeight() {
        return px2dp(55);
    }

    @computed get limitGoodsHeight() {
        const len = (this.currentGoodsList && this.currentGoodsList.length) || 0;
        return len * px2dp(130) + (len - 1) * px2dp(10);
    }

    handleData(data) {
        let promises = [];
        data.forEach((sbuData) => {
            (sbuData.productDetailList || []).forEach((item, index) => {
                if (item.specialSubject) {//是定义定义专题
                    promises.push(asyncHandleTopicData({ data: item.specialSubject }).then((data) => {
                        sbuData.productDetailList.splice(index, 1, ...data);
                    }));
                } else if (!item.type) {
                    item.type = homeType.limitGoGoods;
                    item.itemHeight = (index === 0 ? px2dp(130) : px2dp(140));
                    item.marginTop = (index === 0 ? px2dp(0) : px2dp(10));
                }
            });
        });

        return Promise.all(promises).then(() => {
            return data;
        });
    }

    @action loadLimitGo = flow(function* (change) {
        HomeApi.freeOrderSwitch().then((data) => {
            this.isShowFreeOrder = data.data || false;
        });
        return;
        try {
            // const isShowResult = yield HomeApi.isShowLimitGo();
            // if (!isShowResult.data) {
            //     this.spikeList = [];
            //     this.currentGoodsList = [];
            //     this.currentPage = -1;
            //     throw new Error('不显示秒杀');
            // } else {
            // const res = yield HomeApi.getLimitGo({
            //     type: 0
            // });
            let result = res.data || [];
            result = yield this.handleData(result);

            let _spikeList = [];
            let timeFormats = [];

            let spikeTime = 0;     // 秒杀开始时间
            let lastSeckills = 0;  // 最近的秒杀
            let _currentPage = -1; // 当前page
            result.map((data, index) => {
                spikeTime = (result[index] && result[index].simpleActivity.startTime) || 0;
                const date = (result[index] && result[index].simpleActivity.currentTime) || 0;

                let diffTime = Math.abs(date - parseInt(spikeTime, 0));

                if (lastSeckills === 0) {
                    lastSeckills = diffTime;
                    _currentPage = index;
                } else if (lastSeckills !== 0) {
                    if (lastSeckills > diffTime && date >= parseInt(spikeTime, 0)) {
                        lastSeckills = diffTime;
                        _currentPage = index;
                    }
                }

                let diff = differenceInCalendarDays(date, spikeTime);
                let title = '即将开抢';

                //如果是昨天， title就是昨日精选
                if (diff === 1) {
                    title = '昨日精选';
                } else if (diff === -1) {
                    title = '明日秒杀';
                } else if (diff !== 0) {
                    title = format(spikeTime, 'M月D日');
                }

                if (diff === 0 && date >= parseInt(spikeTime, 0)) {  //今天，已经结束
                    title = '抢购中';
                }

                console.log('loadLimitGo', diff);

                let timeFormat = format(spikeTime, 'HH:mm');

                _spikeList.push({
                    title: title,
                    id: index,
                    time: timeFormat,
                    diff: diff,
                    activityCode: (result[index] && result[index].simpleActivity.code) || '',
                    goods: (result[index] && result[index].productDetailList) || []
                });
                timeFormats.push(timeFormat);
            });

            let currentTimeFormat = null;
            //获取当前选中限时购的名称
            if (this.currentPage > -1 && this.spikeList.length > this.currentPage) {
                currentTimeFormat = this.spikeList[this.currentPage].time;
            }
            // 选中限时购还在请求下来的数组中
            if (currentTimeFormat && timeFormats.indexOf(currentTimeFormat) !== -1 && !change) {
                // 数组越界才进行变动，否则当前页面不必变动
                if (this.currentPage > _spikeList.length - 1) {
                    this.currentPage = timeFormats.indexOf(currentTimeFormat);
                }
            } else {
                //不然显示离当前时间最近的限时购
                this.currentPage = _currentPage;
            }
            this.spikeList = _spikeList;
            this.currentGoodsList = (_spikeList[this.currentPage] && _spikeList[this.currentPage].goods) || [];
            homeModule.changelimitGoods(this.currentGoodsList);
            this.changeLimitHeight();
            // }
        } catch (error) {
            console.log(error);
        }
    });

    @action followSpike(spu, code) {
        HomeApi.followLimit({
            spu,
            activityCode: code
        }).then(res => {
            this.loadLimitGo(false);
        }).catch(err => {
            bridge.$toast(err.msg);
        });
    }

    @action cancleFollow(spu, code) {
        HomeApi.cancleFollow({
            spu,
            activityCode: code
        }).then(res => {
            this.loadLimitGo(false);
        }).catch(err => {
            bridge.$toast(err.msg);
        });
    }

    @action changeLimitGo(index) {
        this.currentGoodsList = (this.spikeList[index] && this.spikeList[index].goods) || [];
        this.currentPage = index;
        homeModule.changelimitGoods(this.currentGoodsList);
        // homeModule.changeHomeList(homeType.limitGoGoods, [{
        //     id: 62,
        //     type: homeType.limitGoGoods
        // }]);
    }

    /**
     * 改变限时购高度
     */
    changeLimitHeight() {
        // homeModule.changeHomeList(homeType.limitGoTime, [{
        //     id: 61,
        //     type: homeType.limitGoTime
        // }]);
        // homeModule.changeHomeList(homeType.limitGoGoods, [{
        //     id: 62,
        //     type: homeType.limitGoGoods
        // }]);
        // homeModule.changeHomeList(homeType.limitGoTop, [{
        //     id: 60,
        //     type: homeType.limitGoTop
        // }]);
    }
}

export const limitGoModule = new LimitGoModules();
