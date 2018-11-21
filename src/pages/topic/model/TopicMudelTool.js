

// 状态：0.删除 1.未开始 2.进行中 3.已售完 4.时间结束 5.手动结束

const statues = {
    deleteStatue: 0,
    noBegin: 1,
    isBeginning: 2,
    haveSoldOut: 3,
    timeOver: 4,
    handOver: 5
};
// 1.秒杀 2.降价拍 3.礼包 4.助力免费领 5.专题 99.普通产品
const productTypes = {
    skill: 1,
    down: 2,
    giftPackage: 3,
    helpFree: 4,
    newTopic: 5,
    normalProduct: 99
};
const downPriceParam = {
    [statues.noBegin]: 'startPrice',
    [statues.isBeginning]: 'markdownPrice',
    [statues.haveSoldOut]: 'markdownPrice',
    [statues.timeOver]: 'markdownPrice',
    [statues.handOver]: 'markdownPrice'
};
const typeName = {
    [productTypes.skill]: 'seckillPrice',
    //降价拍需要判断statue 如果为1 则为startPrice 如果为2 则为 markdownPrice
    [productTypes.down]: downPriceParam,
    [productTypes.giftPackage]: 'originalPrice',
    [productTypes.helpFree]: 'originalPrice',
    [productTypes.newTopic]: 'originalPrice',
    [productTypes.normalProduct] : 'originalPrice'
};

function getShowPrice(itemData) {
    let showPrice = itemData.productType === 2
        ?
         '¥'+itemData[typeName[itemData.productType][itemData.status]]
        :
         '¥'+itemData[typeName[itemData.productType]];
    return showPrice;
}

export  {getShowPrice}
