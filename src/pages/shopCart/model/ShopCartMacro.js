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


function add0(m){return m<10?'0'+m:m }
const formatTime =(updateTime)=>
{
//shijianchuo是整数，否则要parseInt转换
    let time = new Date(updateTime);
    // let y = time.getFullYear();
    let m = time.getMonth()+1;
    let d = time.getDate();
    // let h = time.getHours();
    // let mm = time.getMinutes();
    // let s = time.getSeconds();
    return add0(m)+'月-'+add0(d)+'日 开售';
}
/**
 * 获取购物车列表商品状态提示语
 * @param itemData
 * @return {string}
 */
const getTipString = (itemData) => {
    let tipString = '';
    //是否需要右上角的小标识
    let needIconText = false;
    let iconText = null;
    let returnObj = {
        tipString: tipString,
        needIconText: needIconText,
        iconText: iconText
    };
    if (itemData.amount > itemData.sellStock) {
        // tipString = tipString + '库存不足\n';
        returnObj.tipString = tipString + '库存不足\n';
    }
    //暂未开售
    if (itemData.productStatus === 3){
        returnObj.tipString += tipString + formatTime(itemData.updateTime);
        return  returnObj;
    }


    if (itemData.shoppingCartActivity === null) {
        return returnObj;
        // return tipString;
    }
    if (itemData.shoppingCartActivity.length > 0) {
        itemData.shoppingCartActivity.map((activityItem, activityIndex) => {

            //秒杀活动
            if (activityItem.activityType === 1 && activityItem.seckill) {
                if (itemData.nowTime < activityItem.seckill.beginTime) {
                    tipString += '秒杀活动未开始,暂不可购买~';
                    //是否存在字符标识
                    if (activityString[activityItem.activityType]) {
                         returnObj.tipString = tipString;
                         returnObj.needIconText = true;
                         returnObj.iconText = activityString[activityItem.activityType];
                    }
                } else if (
                    activityItem.seckill.beginTime < itemData.nowTime &&
                    activityItem.seckill.endTime > itemData.nowTime
                ) {
                    tipString += '该商品正在进行秒杀活动,快去看看~';
                    //是否存在字符标识
                    if (activityString[activityItem.activityType]) {
                        returnObj.tipString = tipString;
                        returnObj.needIconText = true;
                        returnObj.iconText = activityString[activityItem.activityType];
                    }
                }
            }
            //降价拍
            if (activityItem.activityType === 2) {
                tipString += '该商品正在进行降价拍活动,快去看看~';

                returnObj.tipString = tipString;
                returnObj.needIconText = true;
                returnObj.iconText = activityString[activityItem.activityType];
            }
        });
        return returnObj;
    } else {
        return returnObj;
    }
};

export { activityCode, activityString, statueImage, getSelectImage, getTipString };
