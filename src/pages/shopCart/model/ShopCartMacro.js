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

const getSelectImage =(itemData)=>{
    if (itemData.productStatus === 0 || itemData.productStatus === 2 || itemData.productStatus === 3||itemData.sellStock===0){
        return res.button.unAbleSelected_circle;
    } else if (itemData.productStatus === 1){
        return itemData.isSelected?  res.button.selected_circle_red : res.button.unselected_circle;
    }
}

export {activityCode,activityString,statueImage,getSelectImage}
