import { observable, action, computed } from 'mobx';
import ShopCartAPI from '../api/ShopCartApi';
import bridge from '../../../utils/bridge';


class ShopCartStore {

    needSelectGoods = []
    @observable
    isRefresh = false;
    @observable
    data = [];
    @observable
    allMoney = 0;
    @observable
    isAllSelected;

    @action
    setRefresh(refresh) {
        this.isRefresh = refresh;
    }

    @action
    clearData() {
        this.data = [];
    }


    @action
    addItemToData(item) {
        if (this.isCanAddItem()) {
            this.data.push(item);
        } else {
            bridge.$toast('购物车数量已达最大数量');
        }
    }

    @computed
    get cartData() {
        return this.data.slice();
    }

    @computed
    get getAllGoodsClassNumber() {
        if (this.data.slice() instanceof Array && this.data.slice().length > 0) {
            return this.data.slice().length;
        } else {
            return 0;
        }

    }

    @computed
    get getTotalSelectGoodsNum() {
        let totalSelectNum = 0;
        this.data.slice().map(item => {
            if (item.isSelected) {
                totalSelectNum += item.amount;
            }
        });
        return totalSelectNum;
    }

    @computed
    get getTotalMoney() {
        let totalMoney = 0.00;
        this.data.slice().map(item => {
            if (item.isSelected) {
                totalMoney = totalMoney + parseFloat(item.amount) * parseFloat(item.price);
            }
        });

        return totalMoney;


    }

    @computed
    get isCanAddItem() {
        if (this.data.slice().length >= 110) {
            return false;
        } else {
            return true;
        }
    }

    @computed
    get computedSelect() {
        if (this.data.length === 0) {
            return false;
        }
        let flag = true;
        this.data.map(item => {
            if (item.status === 1 && !item.isSelected) {
                flag = false;
            }
        });
        return flag;
    }

    /**
     * 组装打包购物车数据
     */
    @action
    packingShopCartGoodsData = (response) => {
        if (response && response instanceof Array && response.length > 0) {
            let tempArr = [];
            response.forEach(item => {
                item.isSelected = false;
                let [...valueArr] = item.specValues || [];
                let tempString = '';
                valueArr.map((string) => {
                    tempString = tempString + `${string} `;
                });
                item.specString = tempString;

                //从订单过来的选中
                this.needSelectGoods.map(selectGood =>{
                    if (selectGood.productId === item.productId && selectGood.priceId === item.priceId){
                        item.isSelected = true
                    }
                })

                tempArr.push(item);
            });
            //将需要选中的数组清空
            this.needSelectGoods = []
            this.data = tempArr;
        } else {
            this.data = [];
            //组装元数据错误
        }
    };

    /**
     * 判断是否可以结算
     */
    judgeIsCanSettlement=(callBack)=>{
        let [...selectArr] = shopCartStore.startSettlement();
        if (selectArr.length <= 0){
            bridge.$toast('请先选择结算商品~');
            callBack(false,[]);
            return;
        }
        let isCanSettlement = true
        selectArr.map(good => {
            if (good.amount > good.stock) {
                isCanSettlement = false
            }
        })
        if (!isCanSettlement) {
            bridge.$toast('商品库存不足请确认~')
        }

        callBack(isCanSettlement,selectArr)
    }
    /**
     * 获取结算选中商品
     * @returns {any[]}
     * @constructor
     */

    startSettlement = () => {
        let selectItemSet = new Set();
        let [...allItems] = this.data.slice();
        allItems.map((good) => {
            if (good.isSelected) {
                selectItemSet.add(good);
            }
        });
        return Array.from(selectItemSet);
    };
    /**
     以下为购物车数据操作相关方法
     */
    isSelectAllItem = (isSelectAll) => {
        if (isSelectAll) {
            this.data.slice().map(item => {
                if (item.status === 0) {
                    item.isSelected = false;
                } else {
                    item.isSelected = true;
                }
            });
        } else {
            this.data.slice().map(item => {
                item.isSelected = false;
            });
        }
    };
    /*更新线上购物车商品*/
    updateCartItem = (itemData, rowId) => {
        ShopCartAPI.updateItem(
            itemData
        ).then((res) => {
            this.getShopCartListData()
            // let [...temDataArr] = this.data.slice();
            // if (itemData.amount > 200){
            //     itemData.amount = 200
            //     bridge.$toast('单个商品最多加入200件')
            // }
            // temDataArr.map((itemValue, indexPath) => {
            //     if (itemValue.priceId === itemData.priceId && itemValue.productId === itemData.productId) {
            //         temDataArr[indexPath] = itemData;
            //     }
            // });
            // this.data = temDataArr;
            // this.data.splice()[[rowId]] = itemData
        }).catch(error => {
            //登陆失效
            if (error.code === 10001) {
                //登陆失效置空购物车
                this.data = [];
            } else if (error.code === 34501) {
                //商品不存在,重新拉取购物车列表
                this.getShopCartListData();
            }
            bridge.$toast(error.msg);
        });
    };
    /*非登录状态通过本地缓存请求商品*/
    getShopCartListWithNoLogin = (localValue) => {
        if (localValue && (localValue instanceof Array && localValue.length > 0)) {
            let params =
                {
                    'cacheList': localValue
                };
            //存在本地缓存
            ShopCartAPI.getRichItemList(
                params
            ).then(res => {
                this.packingShopCartGoodsData(res.data);
                this.setRefresh(false);
            }).catch(error => {
                this.setRefresh(false);
                bridge.$toast(error.msg);
                this.data = [];
            });
        } else {
            this.data = [];
            // bridge.$toast('不存在本地缓存')
            //不存在本地缓存
        }
    };
    /*请求购物车商品*/
    getShopCartListData = () => {
        ShopCartAPI.list().then(result => {
            bridge.hiddenLoading();
            //组装购物车数据
            this.packingShopCartGoodsData(result.data);
            this.setRefresh(false);
        }).catch(error => {
            bridge.hiddenLoading();
            bridge.$toast(error.msg);
            this.setRefresh(false);
        });
    };


    /*加入购物车*/
    addItemToShopCart(item) {
        if (item) {
            if (item instanceof Array && item.length > 0) {
                bridge.$toast('批量加入购物车未对接');
            } else {
                //加入单个商品
                bridge.showLoading();
                ShopCartAPI.addItem({
                    'amount': item.amount,
                    'priceId': item.priceId,
                    'productId': item.productId,
                    'timestamp': item.timestamp
                }).then((res) => {
                    bridge.hiddenLoading();
                    bridge.$toast('加入购物车成功');
                    this.getShopCartListData();
                }).catch((error) => {
                    bridge.$toast(error.msg || '加入购物车失败');
                    bridge.hiddenLoading();
                });
            }

        } else {
            bridge.$toast('添加商品不能为空');
        }
    }

    /**
     * 在来一单
     */

    addOneMoreList(oneMoreList) {
        if (oneMoreList instanceof Array && oneMoreList.length > 0) {

            this.needSelectGoods = oneMoreList

         ShopCartAPI.oneMoreOrder({
             cacheList:oneMoreList
         }).then(result => {
            //添加完成再次拉取
             this.getShopCartListData()
         }).catch(reason => {
             bridge.$toast(reason.msg)
         })
        }
    }

    /*删除购物车商品*/
    deleteItemWithIndex(priceId) {
        if (priceId) {
            ShopCartAPI.deleteItem({
                'priceId': priceId
            }).then(res => {
                bridge.$toast('删除成功');
                this.getShopCartListData();
            }).catch(error => {
                bridge.$toast(error.msg);
            });
        }
    }
}

const shopCartStore = new ShopCartStore();

export default shopCartStore;

