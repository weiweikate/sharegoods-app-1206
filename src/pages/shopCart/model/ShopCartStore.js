import { observable, action, computed } from 'mobx';
import ShopCartAPI from '../api/ShopCartApi';
import bridge from '../../../utils/bridge';
import MineApi from '../../mine/api/MineApi';
import user from '../../../model/user';
import QYChatUtil from '../../mine/page/helper/QYChatModel';
import shopCartCacheTool from './ShopCartCacheTool';

// import testData from './testData';
class ShopCartStore {
    needSelectGoods = [];
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
    get getTotalGoodsNumber() {
        let goodNumber
        this.data.slice().map(items=>{
            goodNumber+=items.data.length;
        });
        return goodNumber;

    }

    @computed
    get getTotalSelectGoodsNum() {
        let totalSelectNum = 0;
        this.data.slice().map(items => {
            items.data.map(
                (item) => {
                    if (item.isSelected && !isNaN(item.amount) && item.productStatus !== 2) {
                        // totalSelectNum += item.amount;
                        totalSelectNum += 1;
                    }
                }
            );
        });
        return totalSelectNum;
    }

    @computed
    get getTotalMoney() {
        let totalMoney = 0.00;
        this.data.slice().map(items => {
            items.data.map(item => {
                if (item.isSelected && !isNaN(item.amount) && item.productStatus !== 2) {
                    totalMoney = totalMoney + parseFloat(item.amount) * parseFloat(item.price);
                }
            });
        });

        this.calculationAwardRules();

        return Math.round(totalMoney * 100) / 100;
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
        this.data.map(items => {
            items.data.map(item => {
                //看是否存在正常商品
                if (item.productStatus === 1 && item.sellStock > 0) {
                    isHaveNormalGood = true;
                    if (!item.isSelected) {
                        flag = false;
                    }
                }
            });
        });

        if (isHaveNormalGood && flag) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * 组装打包购物车数据
     */
    @action
    packingShopCartGoodsData = (response) => {
        let originArr = this.data.slice();
        let originData = response;
        // let originData = testData;
        let tempAllData = [];
        // this.data = tempAllData;
        //有效商品
        if (response === null){
            this.data = [];
            return;
        }
        let effectiveArr = originData.shoppingCartGoodsVOS;
        if (effectiveArr && effectiveArr instanceof Array && effectiveArr.length > 0) {
            effectiveArr.map((itemObj, index) => {
                //增加两个字段
                itemObj.type = itemObj.activityType;//当前分组类型
                itemObj.middleTitle = '1111';
                itemObj.key = index;
                itemObj.data = itemObj.products;
                itemObj.data.map((goodItem, goodItemIndex) => {
                    goodItem.sectionType = itemObj.activityType;//当前组所属类型 8 经验值 null是其他
                    goodItem.isSelected = false;
                    goodItem.key = ''+index+goodItemIndex;
                    goodItem.nowTime = itemObj.nowTime;//系统当前时间戳

                    let tempSpecContent = '规格:';
                    goodItem.specifies.map((specify,specifyIndex)=>{
                        if (specifyIndex === 0){
                            tempSpecContent  += specify.paramValue;
                        } else {
                            tempSpecContent += '-'+specify.paramValue;
                        }
                    })
                    goodItem.specifyContent = tempSpecContent;
                    // goodItem.activityCode = itemObj.activityCode;
                    //从订单过来的选中
                    this.needSelectGoods.map(selectGood => {
                        if (selectGood.productCode === goodItem.productCode &&
                            selectGood.skuCode === goodItem.skuCode &&
                            goodItem.productStatus !== 0 &&
                            goodItem.sellStock !== 0
                        ) {
                            goodItem.isSelected = true;
                        }
                    });
                    //刷新来的选中
                    originArr.map(items => {
                        items.data.map(itemGood => {
                            if (itemGood.productCode === goodItem.productCode && goodItem.skuCode === itemGood.skuCode) {
                               //判断库存
                                if (goodItem.productStatus === 1 && goodItem.sellStock > 0) {
                                    goodItem.isSelected = itemGood.isSelected;
                                } else {
                                    goodItem.isSelected = false;
                                }

                            }
                        });
                    });
                });
                itemObj.sectionIndex = index;
                tempAllData.push(itemObj);
            });
        }
        //失效商品
        let InvalidArr = originData.shoppingCartFailedGoodsVOS;
        if (InvalidArr && InvalidArr instanceof Array && InvalidArr.length > 0) {
            let invalidObj = {};
            invalidObj.type = -1;            //当前分组为失效商品
            invalidObj.middleTitle = '1111';
            invalidObj.key = tempAllData.length;
            invalidObj.data = InvalidArr[0].products;
            invalidObj.data.map((goodItem, goodItemIndex) => {
                goodItem.isSelected = false;
                goodItem.key = ''+tempAllData.length + goodItemIndex;

                let tempSpecContent = '规格:';
                goodItem.specifies.map((specify,specifyIndex)=>{
                    if (specifyIndex === 0){
                        tempSpecContent  += specify.paramValue;
                    } else {
                        tempSpecContent += '-'+specify.paramValue;
                    }
                })
                goodItem.specifyContent = tempSpecContent;
            });
            invalidObj.sectionIndex = tempAllData.length;
            tempAllData.push(invalidObj);
        }
        this.data = tempAllData;
        //计算规则
        this.calculationAwardRules();
        //清空以往的选择
        this.needSelectGoods = [];
        return;
        // if (response && response instanceof Array && response.length > 0) {
        //     let tempArr = [];
        //     response.forEach(item => {
        //         item.isSelected = false;
        //         let [...valueArr] = item.specValues || [];
        //         let tempString = '';
        //         valueArr.map((string) => {
        //             tempString = tempString + `${string} `;
        //         });
        //         item.specString = tempString;
        //
        //         //从订单过来的选中
        //         this.needSelectGoods.map(selectGood =>{
        //             if (selectGood.productCode === item.productCode &&
        //                 selectGood.skuCode === item.skuCode &&
        //                 item.productStatus !== 0 &&
        //                 item.stock !== 0
        //             ){
        //                 item.isSelected = true
        //             }
        //         })
        //
        //         originArr.map(originGood =>{
        //             if (originGood.productCode === item.productCode && item.skuCode === originGood.skuCode){
        //                 if (item.productStatus === 1) {
        //                     item.isSelected = originGood.isSelected
        //                 }else {
        //                     item.isSelected = false;
        //                 }
        //
        //             }
        //         })
        //         tempArr.push(item);
        //     });
        //     //将需要选中的数组清空
        //     this.needSelectGoods = []
        //     this.data = tempArr;
        // } else {
        //     this.data = [];
        //     //组装元数据错误
        // }
    };
    /**
     * 计算奖励规则
     * @constructor
     */
    calculationAwardRules = () => {
        this.data.slice().map((items, itemsIndex) => {
            //检验专区分组计算
            if (items.type === 8) {
                //所选商品总金额
                let totalSelectMoney = 0;
                let middleTitleTip = '';
                items.data.map((itemGood, itemGoodIndex) => {
                    if (itemGood.isSelected) {
                        totalSelectMoney += itemGood.price * itemGood.amount;
                    }
                });
                if (items.rules instanceof Array && items.rules.length > 0) {
                    if (totalSelectMoney === 0) {
                        middleTitleTip = '购买满' + items.rules[0].startPrice + '元,经验值翻' + items.rules[0].rate + '倍,送' + items.startCount + '张优惠券';
                        items.middleTitle = middleTitleTip;
                    } else {
                        let rulesArr = items.rules;
                        let achieveRuleIndex = 0;
                        // let achievePrice = rulesArr[achieveRuleIndex].startPrice;
                        rulesArr.map((ruleItem, ruleIndex) => {
                            if (totalSelectMoney >= ruleItem.startPrice) {
                                // achievePrice = ruleItem.startPrice;
                                achieveRuleIndex = ruleIndex;
                            }
                        });
                        middleTitleTip = '购买满' + items.rules[achieveRuleIndex].startPrice + '元减,经验值翻' + items.rules[achieveRuleIndex].rate + '倍,';
                        //计算优惠券
                        let totalYouHuiJuan = items.rules[achieveRuleIndex].startPrice / items.startPrice;
                        if (totalYouHuiJuan > items.maxCount) {
                            totalYouHuiJuan = items.maxCount;
                        }
                        middleTitleTip = middleTitleTip + '送' + totalYouHuiJuan + '张优惠券';
                        if (totalSelectMoney - items.rules[achieveRuleIndex].startPrice < 0) {
                            middleTitleTip = middleTitleTip + '还差' + (items.rules[achieveRuleIndex].startPrice - totalSelectMoney).toFixed(1) + '元';
                        }
                        items.middleTitle = middleTitleTip;
                    }
                } else {
                    items.middleTitle = '';
                }
            }
        });
    };

    // hyfSub(arg1,arg2){
    //     let r1,r2,m,n;
    //     try {
    //         r1 = arg1.toString().split(".")[1].length;
    //     }catch (e) {
    //         r1 = 0;
    //     }
    //     try {
    //         r2 = arg2.toString().split(".")[1].length;
    //     }catch (e) {
    //         r2 = 0;
    //     }
    //     m = Math.pow(10,Math.max(r1,r2));
    //     n=(r1>=r2)?r1:r2;
    //     return Number(((arg1 * m - arg2 * m)/m).toFixed(n));
    // }
    /**
     * 判断是否可以结算
     */
    judgeIsCanSettlement = (callBack) => {
        let [...selectArr] = shopCartStore.startSettlement();
        if (selectArr.length <= 0) {
            bridge.$toast('请先选择结算商品~');
            callBack(false, []);
            return;
        }
        let isCanSettlement = true;
        let haveNaNGood = false;
        let tempArr = [];
        selectArr.map(good => {
            if (good.amount > good.stock) {
                isCanSettlement = false;
            }
            if (good.amount > 0 && !isNaN(good.amount)) {
                tempArr.push(good);
            }
            if (isNaN(good.amount)) {
                haveNaNGood = true;
                isCanSettlement = false;
            }
        });

        if (haveNaNGood) {
            bridge.$toast('存在选中商品数量为空,或存在正在编辑的商品,请确认~');
            return;
        }
        if (!isCanSettlement) {
            bridge.$toast('商品库存不足请确认~');
            return;
        }
        if (isCanSettlement && !haveNaNGood) {
            callBack(isCanSettlement, tempArr);
        }
    };
    /**
     * 获取结算选中商品
     * @returns {any[]}
     * @constructor
     */

    startSettlement = () => {
        let selectItemSet = new Set();
        let [...allItems] = this.data.slice();
        allItems.map((items) => {
            items.data.map(itemGood => {
                if (itemGood.isSelected) {
                    selectItemSet.add(itemGood);
                }
            });
        });
        return Array.from(selectItemSet);
    };
    /**
     以下为购物车数据操作相关方法
     */
    isSelectAllItem = (isSelectAll) => {
        let [...tempArr] = this.data.slice();
        if (isSelectAll) {
            tempArr.map(items => {
                items.data.map(item => {
                    if (item.productStatus === 0 || item.productStatus === 2 || item.productStatus === 3 || item.sellStock <= 0) {
                        item.isSelected = false;
                    } else {
                        item.isSelected = true;
                    }
                });
            });
        } else {
            tempArr.map(items => {
                items.data.map(item => {
                    item.isSelected = false;
                });
            });
        }
        this.data = tempArr;
    };
    /*更新线上购物车商品*/
    updateCartItem = (itemData, rowId) => {
        ShopCartAPI.updateItem(
            { ...itemData }
        ).then((res) => {
            this.needSelectGoods.push(itemData);
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
                    shoppingCartParamList: localValue
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
                //同步成功删除本地数据
                shopCartCacheTool.deleteAllLocalData();
                this.data = [];
            });
        } else {
            this.data = [];
        }
    };

    /*请求购物车商品*/
    getShopCartListData = () => {
        // this.packingShopCartGoodsData([]);
        // return;
        ShopCartAPI.list().then(result => {
            this.setRefresh(false);
            bridge.hiddenLoading();
            //组装购物车数据
            this.packingShopCartGoodsData(result.data);
        }).catch(error => {
            bridge.hiddenLoading();
            bridge.$toast(error.msg);
            this.setRefresh(false);
            this.data = [];
        });
    };

    /*加入购物车*/
    //     {
    //     'amount': item.amount,
    //     'productCode': item.productCode,
    //     'skuCode': item.skuCode,
    //     'timestamp': item.timestamp
    // }
    addItemToShopCart(item) {
        if (item) {
            //加入单个商品
            item.spuCode = item.productCode;
            bridge.showLoading();
            ShopCartAPI.addItem(
                {
                    shoppingCartParamList: [
                        { ...item }
                    ]
                }
            ).then((res) => {
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
                    shopCartCacheTool.addGoodItem(item);
                } else {
                    bridge.$toast(error.msg);
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
            this.needSelectGoods = oneMoreList;
            ShopCartAPI.addItem(
                {
                    shoppingCartParamList: oneMoreList
                }
            ).then((res) => {
                bridge.hiddenLoading();
                // bridge.$toast('加入购物车成功');
                this.getShopCartListData();
            }).catch((error) => {
                bridge.$toast(error.msg || '加入购物车失败');
                if (error.code === 10009) {
                    // user.clearUserInfo();
                    // user.clearToken();
                    // //清空购物车
                    // this.data = [];
                    // MineApi.signOut();
                    // QYChatUtil.qiYULogout();
                } else {
                    bridge.$toast(error.msg);
                }
                bridge.hiddenLoading();
            });

            // ShopCartAPI.oneMoreOrder({
            //     cacheList: oneMoreList
            // }).then(result => {
            //     //添加完成再次拉取
            //     //  this.getShopCartListData()
            //     this.packingShopCartGoodsData(result.data);
            // }).catch(reason => {
            //     bridge.$toast(reason.msg);
            // });
        }
    }

    /*删除购物车商品*/
    deleteItemWithIndex(skuCodes) {
        if (skuCodes) {
            ShopCartAPI.deleteItem({
                'skuCodes': skuCodes
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

