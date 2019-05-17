/**
 * 状态：0.删除 1.未开始 2.进行中 3.已售完 4.时间结束 5.手动结束
 */
import StringUtils from '../../../utils/StringUtils';

const statues = {
    deleteStatue: 0,
    noBegin: 1,
    isBeginning: 2,
    haveSoldOut: 3,
    timeOver: 4,
    handOver: 5
};
/**
 * 不同状态对应的价格字段
 * @type {{[p: string]: string, [p: number]: string}}
 */
const downPriceParam = {
    [statues.noBegin]: 'startPrice',
    [statues.isBeginning]: 'markdownPrice',
    [statues.haveSoldOut]: 'markdownPrice',
    [statues.timeOver]: 'markdownPrice',
    [statues.handOver]: 'markdownPrice'
};

/**
 * 1.秒杀 2.降价拍 3.礼包 4.助力免费领 5.专题 6 经验值专区 99.普通产品
 */
const productTypes = {
    skill: 1,
    down: 2,
    giftPackage: 3,
    helpFree: 4,
    newTopic: 5,
    experienceValue: 6,
    normalProduct: 99
};

const typeName = {
    [productTypes.skill]: 'seckillPrice',
    //降价拍需要判断statue 如果为1 则为startPrice 如果为2 则为 markdownPrice
    [productTypes.down]: downPriceParam,
    [productTypes.giftPackage]: 'originalPrice',
    [productTypes.helpFree]: 'originalPrice',
    [productTypes.newTopic]: 'originalPrice',
    [productTypes.normalProduct]: 'originalPrice',
    [productTypes.experienceValue]: 'originalPrice'
};

/**
 * 获取跳转路由
 * @type {{[p: string]: string, [p: number]: string}}
 */
const jumpPageParams = {
    [productTypes.skill]: 'product/ProductDetailPage',
    //降价拍需要判断statue 如果为1 则为startPrice 如果为2 则为 markdownPrice
    [productTypes.down]: 'topic/TopicDetailPage',
    [productTypes.giftPackage]: 'topic/TopicDetailPage',
    [productTypes.helpFree]: 'topic/TopicDetailPage',
    [productTypes.newTopic]: 'topic/DownPricePage',
    [productTypes.normalProduct]: 'product/ProductDetailPage',
    [productTypes.experienceValue]: 'product/xpProduct/XpDetailPage'
};

/**
 * @param itemDta 数据源
 * @param preseat 埋点所需来源字符串
 */
function getTopicJumpPageParam(itemData) {
    return {
        pageRoute: jumpPageParams[itemData.productType],
        params: {
            productId: itemData.productId,
            productCode: itemData.prodCode,
            linkTypeCode: itemData.prodCode,
            activityType: itemData.productType,
            activityCode: itemData.prodCode,
            productType: itemData.productType
        }
    };
}

/**
 * 获取不同状态下的价格
 * @param itemData
 * @returns {string}
 */
function getShowPrice(itemData) {
    if (itemData.productType === productTypes.newTopic) {
        return '';
    }
    let showPrice = itemData.productType === 2
        ?
        `￥${StringUtils.isEmpty(itemData.promotionMinPrice) ? itemData[typeName[itemData.productType][itemData.status]] : itemData.promotionMinPrice}`
        // '¥' +  itemData[typeName[itemData.productType][itemData.status]]
        :
        `￥${StringUtils.isEmpty(itemData.promotionMinPrice) ? (StringUtils.isEmpty(itemData[typeName[itemData.productType]]) ? itemData.originalPrice : itemData[typeName[itemData.productType]]) : itemData.promotionMinPrice }`;
    // '¥' + itemData[typeName[itemData.productType]];
    return showPrice;
}

export { getShowPrice, getTopicJumpPageParam };
