const deepLinkPath = {
    'DownPricePage': 'path/DownPricePage/:linkTypeCode',
    'ProductDetailPage': 'path/ProductDetailPage/:productCode',
    'TopicDetailPage': 'path/TopicDetailPage/:activityType/:activityCode',
    'ShowDetailPage': 'path/ShowDetailPage/:code',
    'ShowRichTextDetailPage': 'path/ShowRichTextDetailPage/:code',
    'TagDetailPage': 'path/TagDetailPage/:tagId/:name',
    'HtmlPage': 'path/HtmlPage/:uri',
    'MyCashAccountPage': 'path/MyCashAccountPage/:index',
    'ShowVideoPage': 'path/ShowVideoPage/:code',
    /*售后详情*/
    'ExchangeGoodsDetailPage': 'path/ExchangeGoodsDetailPage/:serviceNo',
    /*售后申请*/
    'AfterSaleServicePage': 'path/AfterSaleServicePage/:orderProductNo/:pageType',
    /*物流详情*/
    'LogisticsDetailsPage': 'path/LogisticsDetailsPage/:expressNo/:expressCode/:expressName',
    /*订单列表*/
    'MyOrdersListPage': 'path/MyOrdersListPage'
};

export default deepLinkPath;
