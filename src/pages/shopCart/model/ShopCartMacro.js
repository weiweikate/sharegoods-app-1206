/**
 SECKILL(1, "秒杀"),
 DEPRECIATE(2, "降价拍"),
 PACKAGE(3, "优惠套餐"),
 FREELEAD(4, "助力免费领"),
 PAYCOURTESY(5, "支付有礼"),
 FULLSUBTRACTION(6, "满减送"),
 SCRAPING(7, "刮刮乐"),
 EXPERIENCE(8,"经验值专区"),
 */

import res from '../res';

const activityCode = {
    skill: 1,//秒杀
    makeDown: 2,//降价拍
    discount: 3,//优惠套餐
    helpFree: 4,//助力免费领
    payGift: 5,//支付有礼
    fullReduce: 6,//满减
    guaguaLe: 7//呱呱乐
};

const activityString = {
    [activityCode.skill]: '秒',
    [activityCode.makeDown]: '降',
    [activityCode.discount]: '优',
    [activityCode.helpFree]: '助',
    [activityCode.payGift]: '支',
    [activityCode.fullReduce]: '满',
    [activityCode.guaguaLe]: '刮'
};

/**
 * 0 删除 1 正常商品 2 下架 无效 3 暂未开售
 */
const statueImage = {
    0: res.other.invalidGoodImg,
    1: null,
    2: res.other.invalidGoodImg,
    3: res.ZanWeiKaiShou
};
/**
 * 0 删除 1 正常商品 2 下架 无效 3 暂未开售
 * 不可选中的状态值
 */
const unAbleSelectStatus = [
    0,
    2,
    3
];

/**
 * 获取秒杀是否开始或者结束
 * @param itemData
 * @private
 * return 0 未开始 1进行中 2已结束
 */
const getSkillIsBegin = (itemData) => {
    if (itemData.nowTime < itemData.activityBeginTime) {
        return 0;
    } else if (
        (new Date().getTime()) > itemData.activityBeginTime &&
        (new Date().getTime()) < itemData.activityEndTime
    ) {
        return 1;
    } else {
        return 2;
    }
};
/**
 * 获取购物车列表选中图片方法
 * @param itemData
 * @return {*}
 */
const getSelectImage = (itemData) => {
    if (unAbleSelectStatus.includes(itemData.productStatus) || itemData.sellStock === 0) {
        return res.button.unAbleSelected_circle;
    } else if (itemData.productStatus === 1) {
        return itemData.isSelected ? res.button.selected_circle_red : res.button.unselected_circle;
    }
};


function add0(m){return m < 10 ? '0' + m : m }
const formatTime = (updateTime)=>
{
    let time = new Date(updateTime);
    let m = time.getMonth() + 1;
    let d = time.getDate();
    return add0(m) + '月-' + add0(d) + '日 开售';
}
/**
 * 获取购物车列表商品状态提示语
 * @param itemData
 * @return {string}
 */
const getTipString = (itemData) => {
    let tipString = '';
    //是否需要左上角的小标识
    let returnObj = {
        tipString: tipString,
    };
    if (itemData.amount > itemData.sellStock) {
        returnObj.tipString = tipString + '库存不足\n';
    }
    //暂未开售
    if (itemData.productStatus === 3){
        returnObj.tipString += tipString + formatTime(itemData.upTime);
        return  returnObj;
    }
    if (itemData.displayItem && !isNaN(parseInt(itemData.displayItem.limitNum ))) {
        returnObj.tipString = `${tipString}限购${itemData.displayItem.limitNum}件`
    }
    return returnObj;
};

export { activityCode, activityString, statueImage, getSelectImage, getTipString ,getSkillIsBegin};
