package com.meeruu.sharegoods.rn.showground.bean;

import com.chad.library.adapter.base.entity.MultiItemEntity;

import java.util.List;

public class NewestShowGroundBean {


    /**
     * currentPage : 1
     * pageSize : 10
     * totalNum : 1
     * isMore : 0
     * totalPage : 1
     * startIndex : 0
     * data : [{"showNo":"SHOW2019050716562296100003900000","userInfoVO":{"userNo":"111","userImg":"","userName":""},"content":"2121","publishTime":1557228931000,"publishTimeStr":"5.07 19:35","showType":1,"products":[{"promotionResult":null,"prodCode":"SPU00000233","name":"xiaomi小米 MIJIA/米家 米家恒温电热水壶智能家用烧水壶保温","secondName":"【12月12日 0点开抢】到手价179元","originalPrice":"17.9","groupPrice":"9.9","minPrice":"15.9","maxPrice":"15.9","promotionMinPrice":null,"promotionMaxPrice":null,"v0Price":null,"imgUrl":"https://testcdn.sharegoodsmall.com/sharegoods/3fd92ae923374453ad4a767170c0aa54.png"},{"promotionResult":null,"prodCode":"SPU00000233","name":"xiaomi小米 MIJIA/米家 米家恒温电热水壶智能家用烧水壶保温","secondName":"【12月12日 0点开抢】到手价179元","originalPrice":"17.9","groupPrice":"9.9","minPrice":"15.9","maxPrice":"15.9","promotionMinPrice":null,"promotionMaxPrice":null,"v0Price":null,"imgUrl":"https://testcdn.sharegoodsmall.com/sharegoods/3fd92ae923374453ad4a767170c0aa54.png"},{"promotionResult":null,"prodCode":"SPU00000233","name":"xiaomi小米 MIJIA/米家 米家恒温电热水壶智能家用烧水壶保温","secondName":"【12月12日 0点开抢】到手价179元","originalPrice":"17.9","groupPrice":"9.9","minPrice":"15.9","maxPrice":"15.9","promotionMinPrice":null,"promotionMaxPrice":null,"v0Price":null,"imgUrl":"https://testcdn.sharegoodsmall.com/sharegoods/3fd92ae923374453ad4a767170c0aa54.png"}],"resource":[{"type":2,"url":"https://devcdn.sharegoodsmall.com/sharegoods/ff4647ea22dd4d14aad0adecb177b9f6.png"}],"likesCount":1,"shareCount":0,"downloadCount":0,"clickCount":0,"hotCount":0,"nowTime":1557804063514,"like":false}]
     */

    private int currentPage;
    private int pageSize;
    private int totalNum;
    private int isMore;
    private int totalPage;
    private int startIndex;
    private List<DataBean> data;

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getTotalNum() {
        return totalNum;
    }

    public void setTotalNum(int totalNum) {
        this.totalNum = totalNum;
    }

    public int getIsMore() {
        return isMore;
    }

    public void setIsMore(int isMore) {
        this.isMore = isMore;
    }

    public int getTotalPage() {
        return totalPage;
    }

    public void setTotalPage(int totalPage) {
        this.totalPage = totalPage;
    }

    public int getStartIndex() {
        return startIndex;
    }

    public void setStartIndex(int startIndex) {
        this.startIndex = startIndex;
    }

    public List<DataBean> getData() {
        return data;
    }

    public void setData(List<DataBean> data) {
        this.data = data;
    }

    public static class DataBean implements MultiItemEntity {
        /**
         * showNo : SHOW2019050716562296100003900000
         * userInfoVO : {"userNo":"111","userImg":"","userName":""}
         * content : 2121
         * publishTime : 1557228931000
         * publishTimeStr : 5.07 19:35
         * showType : 1
         * products : [{"promotionResult":null,"prodCode":"SPU00000233","name":"xiaomi小米 MIJIA/米家 米家恒温电热水壶智能家用烧水壶保温","secondName":"【12月12日 0点开抢】到手价179元","originalPrice":"17.9","groupPrice":"9.9","minPrice":"15.9","maxPrice":"15.9","promotionMinPrice":null,"promotionMaxPrice":null,"v0Price":null,"imgUrl":"https://testcdn.sharegoodsmall.com/sharegoods/3fd92ae923374453ad4a767170c0aa54.png"},{"promotionResult":null,"prodCode":"SPU00000233","name":"xiaomi小米 MIJIA/米家 米家恒温电热水壶智能家用烧水壶保温","secondName":"【12月12日 0点开抢】到手价179元","originalPrice":"17.9","groupPrice":"9.9","minPrice":"15.9","maxPrice":"15.9","promotionMinPrice":null,"promotionMaxPrice":null,"v0Price":null,"imgUrl":"https://testcdn.sharegoodsmall.com/sharegoods/3fd92ae923374453ad4a767170c0aa54.png"},{"promotionResult":null,"prodCode":"SPU00000233","name":"xiaomi小米 MIJIA/米家 米家恒温电热水壶智能家用烧水壶保温","secondName":"【12月12日 0点开抢】到手价179元","originalPrice":"17.9","groupPrice":"9.9","minPrice":"15.9","maxPrice":"15.9","promotionMinPrice":null,"promotionMaxPrice":null,"v0Price":null,"imgUrl":"https://testcdn.sharegoodsmall.com/sharegoods/3fd92ae923374453ad4a767170c0aa54.png"}]
         * resource : [{"type":2,"url":"https://devcdn.sharegoodsmall.com/sharegoods/ff4647ea22dd4d14aad0adecb177b9f6.png"}]
         * likesCount : 1
         * shareCount : 0
         * downloadCount : 0
         * clickCount : 0
         * hotCount : 0
         * nowTime : 1557804063514
         * like : false
         */

        private String showNo;
        private UserInfoVOBean userInfoVO;
        private String content;
        private long publishTime;
        private String publishTimeStr;
        private int showType;
        private int likesCount;
        private int shareCount;
        private int downloadCount;
        private int clickCount;
        private int hotCount;
        private long nowTime;
        private boolean like;
        private List<ProductsBean> products;
        private List<ResourceBean> resource;

        public String getShowNo() {
            return showNo;
        }

        public void setShowNo(String showNo) {
            this.showNo = showNo;
        }

        public UserInfoVOBean getUserInfoVO() {
            return userInfoVO;
        }

        public void setUserInfoVO(UserInfoVOBean userInfoVO) {
            this.userInfoVO = userInfoVO;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public long getPublishTime() {
            return publishTime;
        }

        public void setPublishTime(long publishTime) {
            this.publishTime = publishTime;
        }

        public String getPublishTimeStr() {
            return publishTimeStr;
        }

        public void setPublishTimeStr(String publishTimeStr) {
            this.publishTimeStr = publishTimeStr;
        }

        public int getShowType() {
            return showType;
        }

        public void setShowType(int showType) {
            this.showType = showType;
        }

        public int getLikesCount() {
            return likesCount;
        }

        public void setLikesCount(int likesCount) {
            this.likesCount = likesCount;
        }

        public int getShareCount() {
            return shareCount;
        }

        public void setShareCount(int shareCount) {
            this.shareCount = shareCount;
        }

        public int getDownloadCount() {
            return downloadCount;
        }

        public void setDownloadCount(int downloadCount) {
            this.downloadCount = downloadCount;
        }

        public int getClickCount() {
            return clickCount;
        }

        public void setClickCount(int clickCount) {
            this.clickCount = clickCount;
        }

        public int getHotCount() {
            return hotCount;
        }

        public void setHotCount(int hotCount) {
            this.hotCount = hotCount;
        }

        public long getNowTime() {
            return nowTime;
        }

        public void setNowTime(long nowTime) {
            this.nowTime = nowTime;
        }

        public boolean isLike() {
            return like;
        }

        public void setLike(boolean like) {
            this.like = like;
        }

        public List<ProductsBean> getProducts() {
            return products;
        }

        public void setProducts(List<ProductsBean> products) {
            this.products = products;
        }

        public List<ResourceBean> getResource() {
            return resource;
        }

        public void setResource(List<ResourceBean> resource) {
            this.resource = resource;
        }

        public static class UserInfoVOBean {
            /**
             * userNo : 111
             * userImg :
             * userName :
             */

            private String userNo;
            private String userImg;
            private String userName;

            public String getUserNo() {
                return userNo;
            }

            public void setUserNo(String userNo) {
                this.userNo = userNo;
            }

            public String getUserImg() {
                return userImg;
            }

            public void setUserImg(String userImg) {
                this.userImg = userImg;
            }

            public String getUserName() {
                return userName;
            }

            public void setUserName(String userName) {
                this.userName = userName;
            }
        }

        public static class ProductsBean {
            /**
             * promotionResult : null
             * prodCode : SPU00000233
             * name : xiaomi小米 MIJIA/米家 米家恒温电热水壶智能家用烧水壶保温
             * secondName : 【12月12日 0点开抢】到手价179元
             * originalPrice : 17.9
             * groupPrice : 9.9
             * minPrice : 15.9
             * maxPrice : 15.9
             * promotionMinPrice : null
             * promotionMaxPrice : null
             * v0Price : null
             * imgUrl : https://testcdn.sharegoodsmall.com/sharegoods/3fd92ae923374453ad4a767170c0aa54.png
             */

            private PromotionResultBean promotionResult;
            private String prodCode;
            private String name;
            private String secondName;
            private String originalPrice;
            private String groupPrice;
            private String minPrice;
            private String maxPrice;
            private String promotionMinPrice;
            private String promotionMaxPrice;
            private String v0Price;
            private String imgUrl;

            public PromotionResultBean getPromotionResult() {
                return promotionResult;
            }

            public void setPromotionResult(PromotionResultBean promotionResult) {
                this.promotionResult = promotionResult;
            }

            public String getProdCode() {
                return prodCode;
            }

            public void setProdCode(String prodCode) {
                this.prodCode = prodCode;
            }

            public String getName() {
                return name;
            }

            public void setName(String name) {
                this.name = name;
            }

            public String getSecondName() {
                return secondName;
            }

            public void setSecondName(String secondName) {
                this.secondName = secondName;
            }

            public String getOriginalPrice() {
                return originalPrice;
            }

            public void setOriginalPrice(String originalPrice) {
                this.originalPrice = originalPrice;
            }

            public String getGroupPrice() {
                return groupPrice;
            }

            public void setGroupPrice(String groupPrice) {
                this.groupPrice = groupPrice;
            }

            public String getMinPrice() {
                return minPrice;
            }

            public void setMinPrice(String minPrice) {
                this.minPrice = minPrice;
            }

            public String getMaxPrice() {
                return maxPrice;
            }

            public void setMaxPrice(String maxPrice) {
                this.maxPrice = maxPrice;
            }

            public String getPromotionMinPrice() {
                return promotionMinPrice;
            }

            public void setPromotionMinPrice(String promotionMinPrice) {
                this.promotionMinPrice = promotionMinPrice;
            }

            public Object getPromotionMaxPrice() {
                return promotionMaxPrice;
            }

            public void setPromotionMaxPrice(String promotionMaxPrice) {
                this.promotionMaxPrice = promotionMaxPrice;
            }

            public String getV0Price() {
                return v0Price;
            }

            public void setV0Price(String v0Price) {
                this.v0Price = v0Price;
            }

            public String getImgUrl() {
                return imgUrl;
            }

            public void setImgUrl(String imgUrl) {
                this.imgUrl = imgUrl;
            }

            public static class PromotionResultBean{
                private GroupActivityBean groupActivity;
                private int limitNum;
                private SingleActivityBean singleActivity;
                private List<String> tags;

                public GroupActivityBean getGroupActivity() {
                    return groupActivity;
                }

                public void setGroupActivity(GroupActivityBean groupActivity) {
                    this.groupActivity = groupActivity;
                }

                public int getLimitNum() {
                    return limitNum;
                }

                public void setLimitNum(int limitNum) {
                    this.limitNum = limitNum;
                }

                public SingleActivityBean getSingleActivity() {
                    return singleActivity;
                }

                public void setSingleActivity(SingleActivityBean singleActivity) {
                    this.singleActivity = singleActivity;
                }

                public List<String> getTags() {
                    return tags;
                }

                public void setTags(List<String> tags) {
                    this.tags = tags;
                }

                public static class SingleActivityBean{
                    private String code;
                    private boolean couponLimit;
                    private long startTime;
                    private long endTime;
                    private String extraProperty;
                    private String memo;
                    private String name;
                    private int status;
                    private String tag;
                    private String type;

                    public String getCode() {
                        return code;
                    }

                    public void setCode(String code) {
                        this.code = code;
                    }

                    public boolean isCouponLimit() {
                        return couponLimit;
                    }

                    public void setCouponLimit(boolean couponLimit) {
                        this.couponLimit = couponLimit;
                    }

                    public long getStartTime() {
                        return startTime;
                    }

                    public void setStartTime(long currentTime) {
                        this.startTime = currentTime;
                    }

                    public long getEndTime() {
                        return endTime;
                    }

                    public void setEndTime(long endTime) {
                        this.endTime = endTime;
                    }

                    public String getExtraProperty() {
                        return extraProperty;
                    }

                    public void setExtraProperty(String extraProperty) {
                        this.extraProperty = extraProperty;
                    }

                    public String getMemo() {
                        return memo;
                    }

                    public void setMemo(String memo) {
                        this.memo = memo;
                    }

                    public String getName() {
                        return name;
                    }

                    public void setName(String name) {
                        this.name = name;
                    }

                    public int getStatus() {
                        return status;
                    }

                    public void setStatus(int status) {
                        this.status = status;
                    }

                    public String getTag() {
                        return tag;
                    }

                    public void setTag(String tag) {
                        this.tag = tag;
                    }

                    public String getType() {
                        return type;
                    }

                    public void setType(String type) {
                        this.type = type;
                    }
                }


                public static class GroupActivityBean{
                    private String code;
                    private boolean couponLimit;
                    private long startTime;
                    private long endTime;
                    private String extraProperty;
                    private String memo;
                    private String name;
                    private int status;
                    private String tag;
                    private String type;

                    public String getCode() {
                        return code;
                    }

                    public void setCode(String code) {
                        this.code = code;
                    }

                    public boolean isCouponLimit() {
                        return couponLimit;
                    }

                    public void setCouponLimit(boolean couponLimit) {
                        this.couponLimit = couponLimit;
                    }

                    public long getStartTime() {
                        return startTime;
                    }

                    public void setStartTime(long currentTime) {
                        this.startTime = currentTime;
                    }

                    public long getEndTime() {
                        return endTime;
                    }

                    public void setEndTime(long endTime) {
                        this.endTime = endTime;
                    }

                    public String getExtraProperty() {
                        return extraProperty;
                    }

                    public void setExtraProperty(String extraProperty) {
                        this.extraProperty = extraProperty;
                    }

                    public String getMemo() {
                        return memo;
                    }

                    public void setMemo(String memo) {
                        this.memo = memo;
                    }

                    public String getName() {
                        return name;
                    }

                    public void setName(String name) {
                        this.name = name;
                    }

                    public int getStatus() {
                        return status;
                    }

                    public void setStatus(int status) {
                        this.status = status;
                    }

                    public String getTag() {
                        return tag;
                    }

                    public void setTag(String tag) {
                        this.tag = tag;
                    }

                    public String getType() {
                        return type;
                    }

                    public void setType(String type) {
                        this.type = type;
                    }
                }
            }
        }

        public static class ResourceBean {
            /**
             * type : 2
             * url : https://devcdn.sharegoodsmall.com/sharegoods/ff4647ea22dd4d14aad0adecb177b9f6.png
             */

            private int type;
            private String url;

            public int getType() {
                return type;
            }

            public void setType(int type) {
                this.type = type;
            }

            public String getUrl() {
                return url;
            }

            public void setUrl(String url) {
                this.url = url;
            }
        }

        @Override
        public int getItemType() {
            return this.showType;
        }
    }
}
