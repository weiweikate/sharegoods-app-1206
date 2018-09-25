import { computed } from 'mobx';
import ShopCartAPI from '../api/ShopCartApi';
import bridge from '../../../utils/bridge';
import user from '../../../model/user';
import shopCartStore from './ShopCartStore';
import Storage from '../../../utils/storage';


class ShopCartCacheTool {

    static  shopCartLocalStorageKey = 'shopCartLocalStorageKey';


    @computed isSynchronousData() {
        //是否登录
        if (!!(user.id)) {
            //登录同步数据
            this.synchronousData();
        }

        return (!!(user.id));
    }

    /**
     * 删除本地数据
     */
    deleteAllLocalData() {
        Storage.remove(ShopCartCacheTool.shopCartLocalStorageKey).then(() => {

        }).catch(() => {

        });
    }

    /*同步购物车商品*/
    synchronousData() {
        //用户非登入状态
        Storage.get(ShopCartCacheTool.shopCartLocalStorageKey).then(res => {
            let [...localValue] = res;
            if (localValue && (localValue instanceof Array && localValue.length > 0)) {
                bridge.showLoading('正在同步本地购物车数据');
                //存在本地缓存
                ShopCartAPI.loginArrange(
                    {
                        'cacheList': localValue
                    }
                ).then(res => {
                    bridge.hiddenLoading();
                    //同步完数据组装
                    shopCartStore.packingShopCartGoodsData(res.data);
                    //同步成功删除本地数据
                    this.deleteAllLocalData();
                }).catch(error => {
                    bridge.hiddenLoading();
                    // bridge.$toast(error);
                    bridge.$toast(error.msg);
                });
            } else {
                //不存在本地缓存 但他妈的也得拉一下数据老铁
                shopCartStore.getShopCartListData();
            }
        }).catch(error => {
            // console.warn('获取购物车本地缓存异常');本地未获取到购物车信息,也需要从服务器拉取一下
            shopCartStore.getShopCartListData();
        });
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
                Storage.set(ShopCartCacheTool.shopCartLocalStorageKey, localValue).then(() => {
                    //拉取刷新
                    shopCartStore.getShopCartListWithNoLogin(localValue);
                }).catch(error => {

                });
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
                    let isHave = false;
                    localValue.map((localItem, indexPath) => {
                        if (localItem.priceId === goodsItem.priceId && localValue.productId === goodsItem.productId) {
                            localValue[indexPath] = goodsItem;
                            isHave = true;
                        }
                    });
                    if (!isHave) {
                        localValue.push(goodsItem);
                    }
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
                    bridge.$toast('本地加入购物车失败');
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
                shopCartStore.getShopCartListWithNoLogin(localValue);
            }).catch(error => {
                bridge.$toast('读取本地数据异常');
            });
        }
    }

    /*更新购物车数据*/
    updateShopCartDataLocalOrService(itemData, rowId) {
        // if (shopCartStore.data.splice().length > rowId) {
        if (user.isLogin) {
            shopCartStore.updateCartItem(itemData, rowId);
        } else {
            /*未登录状态登录状态更新本地*/
            Storage.get(ShopCartCacheTool.shopCartLocalStorageKey, []).then(res => {
                let [...localValue] = res;
                localValue.map((localItemGood, indexPath) => {

                    if (localItemGood.priceId === itemData.priceId &&
                        localItemGood.productId === itemData.productId
                    ) {
                        localValue[indexPath] = itemData;
                    }
                });
                //重新缓存
                Storage.set(ShopCartCacheTool.shopCartLocalStorageKey, localValue).then(() => {
                    //重新拉去数据
                    let [...tempArr] = shopCartStore.data.slice();
                    tempArr[rowId] = itemData;
                    shopCartStore.data = tempArr;
                }).catch(() => {
                    console.warn('缓存本地购物车数据异常');
                });
            }).catch(() => {
                console.warn('获取本地购物车数据异常');
            });
        }
    }

    // }
}

const shopCartCacheTool = new ShopCartCacheTool();

export default shopCartCacheTool;

