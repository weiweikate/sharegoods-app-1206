import { observable, action, computed } from 'mobx';
import ShopCartAPI from '../api/ShopCartApi';
import bridge from '../../../utils/bridge';
import MineApi from '../../mine/api/MineApi';
import user from '../../../model/user';
import QYChatUtil from '../../mine/page/helper/QYChatModel';
import shopCartCacheTool from './ShopCartCacheTool';


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
    get getTotalGoodsNumber(){
        return this.data.slice().length;
    }

    @computed
    get getTotalSelectGoodsNum() {
        let totalSelectNum = 0;
        this.data.slice().map(item => {
            if (item.isSelected && !isNaN(item.amount) && item.status !== 2 ) {
                // totalSelectNum += item.amount;
                totalSelectNum += 1;
            }
        });
        return totalSelectNum;
    }

    @computed
    get getTotalMoney() {
        let totalMoney = 0.00;
        this.data.slice().map(item => {
            if (item.isSelected && !isNaN(item.amount) && item.status !== 2 ) {
                totalMoney = totalMoney + parseFloat(item.amount) * parseFloat(item.price);
            }
        });
        return   Math.round(totalMoney * 100)/100;
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
        //是否存在正常商品
        let isHaveNormalGood = false;
        let flag = true;
        this.data.map(item => {
            if (item.status === 1){
                isHaveNormalGood = true;
                if (!item.isSelected) {
                    flag = false;
                }
            }
            // if (item.status === 1 && !item.isSelected) {
            //     flag = false;
            // }
        });

        if (isHaveNormalGood && flag){
            return true;
        } else {
            return false;
        }
        // return flag;
    }

    /**
     * 组装打包购物车数据
     */
    @action
    packingShopCartGoodsData = (response) => {
        let originArr = this.data.slice();

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
                    if (selectGood.productCode === item.productCode &&
                        selectGood.skuCode === item.skuCode &&
                        item.status !== 0 &&
                        item.stock !== 0
                    ){
                        item.isSelected = true
                    }
                })

                originArr.map(originGood =>{
                    if (originGood.productCode === item.productCode && item.skuCode === originGood.skuCode){
                        if (item.status === 1) {
                            item.isSelected = originGood.isSelected
                        }else {
                            item.isSelected = false;
                        }

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
        let haveNaNGood = false
        let  tempArr = [];
        selectArr.map(good => {
            if (good.amount > good.stock) {
                isCanSettlement = false
            }
            if (good.amount > 0 && !isNaN(good.amount)){
                tempArr.push(good);
            }
            if (isNaN(good.amount)){
                haveNaNGood = true
                isCanSettlement = false
            }
        })

        if (haveNaNGood){
            bridge.$toast('存在选中商品数量为空,或存在正在编辑的商品,请确认~')
            return;
        }
        if (!isCanSettlement) {
            bridge.$toast('商品库存不足请确认~')
            return;
        }
        if (isCanSettlement && !haveNaNGood){
            callBack(isCanSettlement,tempArr)
        }
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
                if (item.status === 0 || item.status === 2  || item.status === 3) {
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
            this.needSelectGoods.push(itemData)
            // this.getShopCartListData()
            this.packingShopCartGoodsData(res.data);
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
            // this.setRefresh(true);
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
        }
    };

    /*请求购物车商品*/
    getShopCartListData = () => {
        ShopCartAPI.list().then(result => {
            this.setRefresh(false);
            bridge.hiddenLoading();
            //组装购物车数据
            this.packingShopCartGoodsData(result.data);
        }).catch(error => {
            bridge.hiddenLoading();
            bridge.$toast(error.msg);
            this.setRefresh(false);
        });
    };
    /*加入购物车*/
    addItemToShopCart(item) {
        if (item) {
                //加入单个商品
                bridge.showLoading();
                ShopCartAPI.addItem({
                    'amount': item.amount,
                    'productCode': item.productCode,
                    'skuCode': item.skuCode,
                    'timestamp': item.timestamp
                }).then((res) => {
                    bridge.hiddenLoading();
                    bridge.$toast('加入购物车成功');
                    this.getShopCartListData();
                }).catch((error) => {
                    bridge.$toast(error.msg || '加入购物车失败');
                    if (error.code === 10009) {
                        user.clearUserInfo();
                        user.clearToken();
                        //清空购物车
                        this.data = [];
                        MineApi.signOut();
                        QYChatUtil.qiYULogout();
                        shopCartCacheTool.addGoodItem(item)
                    }else {
                        bridge.$toast(error.msg)
                    }
                    bridge.hiddenLoading();
                });
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
            //  this.getShopCartListData()
             this.packingShopCartGoodsData(result.data);
         }).catch(reason => {
             bridge.$toast(reason.msg)
         })
        }
    }

    /*删除购物车商品*/
    deleteItemWithIndex(skuCode) {
        if (skuCode) {
            ShopCartAPI.deleteItem({
                'skuCode': skuCode
            }).then(res => {
                bridge.$toast('删除成功');
                this.packingShopCartGoodsData(res.data);
            }).catch(error => {
                bridge.$toast(error.msg);
            });
        }
    }
}

const shopCartStore = new ShopCartStore();

export default shopCartStore;

