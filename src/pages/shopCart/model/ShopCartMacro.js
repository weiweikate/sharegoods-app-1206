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

const getTipString = (itemData)=>{
    let tipString = '';
   if (itemData.amount > itemData.sellStock) {
       tipString = tipString + '库存不足\n';
   }

   if(itemData.shoppingCartActivity &&itemData.shoppingCartActivity.length>0 && itemData.shoppingCartActivity[0].activityType === 1){
           if (itemData.nowTime < itemData.shoppingCartActivity[0].seckill.beginTime) {
               tipString += '秒杀活动未开始,暂不可购买~';
           }else if (
               itemData.shoppingCartActivity[0].seckill.beginTime < itemData.nowTime &&
               itemData.shoppingCartActivity[0].seckill.endTime > itemData.nowTime
           ) {
               tipString += '该商品正在进行秒杀活动,快去看看~';
           }else {

           }
       // }
   }
   if (itemData.shoppingCartActivity &&itemData.shoppingCartActivity.length>0 && itemData.shoppingCartActivity[0].activityType === 2){
       tipString += '该商品正在进行降价拍活动,快去看看~';
   }

   return tipString;
}

export {activityCode,activityString,statueImage,getSelectImage,getTipString}
