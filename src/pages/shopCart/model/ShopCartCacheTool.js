import { observable, computed } from "mobx";
import ShopCartAPI from "../api/ShopCartApi";
import bridge from "../../../utils/bridge";
import user from "../../../model/user";
import shopCartStore from "./ShopCartStore";
import Storage from "../../../utils/storage";


class ShopCartCacheTool {

    static  shopCartLocalStorageKey = "shopCartLocalStorageKey";


    @computed isSynchronousData() {
        //是否登录
        if (!!(user.id)) {
            //登录同步数据
            this.synchronousData();
        }

        return (!!(user.id))
    }

    /**
     * 删除本地数据
     */
    deleteAllLocalData(){
        Storage.remove(ShopCartCacheTool.shopCartLocalStorageKey).then(()=>{

        }).catch(()=>{

        })
    }

    /*同步购物车商品*/
    synchronousData() {
        if (user.isLogin) {
            //用户登录状态
            shopCartStore.getShopCartListData();
        } else {
            //用户非登入状态
            let [...localValue] = Storage.get(ShopCartCacheTool.shopCartLocalStorageKey);
            if (localValue && (localValue instanceof Array)) {
                //存在本地缓存
                ShopCartAPI.loginArrange(
                    {
                        "cacheList": localValue
                    }
                ).then(res => {
                    //同步完数据组装
                    shopCartStore.packingShopCartGoodsData(res.data)
                    //同步成功删除本地数据
                    this.deleteAllLocalData();
                }).catch(error => {
                    bridge.$toast(error);
                });
            } else {
                //不存在本地缓存

            }
        }
    }

    /**
     * 删除购物车数据
     */

    deleteShopCartGoods(priceId) {
        if (user.isLogin) {
            //登陆状态 直接后台删除
            shopCartStore.deleteItemWithIndex(priceId);
        } else {
            //从本地拿出数据删除掉
            Storage.get(ShopCartCacheTool.shopCartLocalStorageKey, []).then(res => {
                let [...localValue] = res;
                if (localValue && (localValue instanceof Array)) {
                    localValue.map((itemData) => {
                        if (itemData.priceId === priceId) {
                            localValue.splice(localValue.indexOf(itemData), 1);
                        }
                    });
                }
                //再存入本地
                Storage.set(ShopCartCacheTool.shopCartLocalStorageKey,localValue).then(()=>{
                    //拉取刷新
                    shopCartStore.getShopCartListWithNoLogin(localValue);
                }).catch(error=>{

                })
            }).catch(error => {
            });
        }
    }

    /*
    * 参数对象必须包括参数
    * "amount": 10, 商品数量
    * "priceId": 10, 商品规格id
    * "productId": 10, 商品id
    *  "timestamp": 1536633469102 时间戳(非必须)
    * */
    addGoodItem(goodsItem) {
        if (user.isLogin) {
            //将数据添加到后台服务器
            shopCartStore.addItemToShopCart(goodsItem);
        } else {
            //缓存本地
            Storage.get(ShopCartCacheTool.shopCartLocalStorageKey, []).then(res => {
                let [...localValue] = res;
                if (localValue && (localValue instanceof Array)) {
                    localValue.push(goodsItem);
                } else {
                    localValue = [];
                    localValue.push(goodsItem);
                }
                Storage.set(ShopCartCacheTool.shopCartLocalStorageKey, localValue).then(() => {
                    //存入成功后,从后台拉取详细信息
                    shopCartStore.getShopCartListWithNoLogin(localValue);
                    // Storage.get(ShopCartCacheTool.shopCartLocalStorageKey, []).then(res => {
                    //
                    // }).catch(error => {
                    //
                    // });
                }).catch(() => {
                    bridge.$toast("本地加入购物车失败");
                });
            }).catch(error => {

            });
        }
    }

    /*获取购物车数据 总入口*/
    getShopCartGoodsListData() {
        if (user.isLogin) {
            //用户登录状态
            shopCartStore.getShopCartListData();
        } else {
            //用户非登入状态
            Storage.get(ShopCartCacheTool.shopCartLocalStorageKey, []).then(res => {
                //拿到数据后拉去详情
                let [...localValue] = res;
                shopCartStore.getShopCartListWithNoLogin(localValue)
            }).catch(error => {
                bridge.$toast("读取本地数据异常");
            });
        }
    }
}

const shopCartCacheTool = new ShopCartCacheTool();

export default shopCartCacheTool;

