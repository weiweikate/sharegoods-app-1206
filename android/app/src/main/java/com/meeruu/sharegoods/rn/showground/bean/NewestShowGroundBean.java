package com.meeruu.sharegoods.rn.showground.bean;

import java.util.List;

public class NewestShowGroundBean {

    /**
     * currentPage : 1
     * pageSize : 10
     * totalNum : 1
     * isMore : 0
     * totalPage : 1
     * startIndex : 0
     * data : [{"showNo":"SHOW2019051311331980800003300000","userInfoVO":{"userNo":"1000004","userImg":"https://testcdn.sharegoodsmall.com/sharegoods/da3a1f00cbc64733a0a8522ad7e3dbfe.png","userName":"15755373887"},"content":"","publishTime":1557718399000,"publishTimeStr":"20分钟前","showType":1,"products":null,"resource":[{"type":2,"url":"https://devcdn.sharegoodsmall.com/sharegoods/ff4647ea22dd4d14aad0adecb177b9f6.png"}],"likesCount":0,"shareCount":0,"downloadCount":0,"clickCount":0,"hotCount":8,"nowTime":1557719616374,"like":false}]
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

    public static class DataBean {
        /**
         * showNo : SHOW2019051311331980800003300000
         * userInfoVO : {"userNo":"1000004","userImg":"https://testcdn.sharegoodsmall.com/sharegoods/da3a1f00cbc64733a0a8522ad7e3dbfe.png","userName":"15755373887"}
         * content :
         * publishTime : 1557718399000
         * publishTimeStr : 20分钟前
         * showType : 1
         * products : null
         * resource : [{"type":2,"url":"https://devcdn.sharegoodsmall.com/sharegoods/ff4647ea22dd4d14aad0adecb177b9f6.png"}]
         * likesCount : 0
         * shareCount : 0
         * downloadCount : 0
         * clickCount : 0
         * hotCount : 8
         * nowTime : 1557719616374
         * like : false
         */

        private String showNo;
        private UserInfoVOBean userInfoVO;
        private String content;
        private long publishTime;
        private String publishTimeStr;
        private int showType;
        private Object products;
        private int likesCount;
        private int shareCount;
        private int downloadCount;
        private int clickCount;
        private int hotCount;
        private long nowTime;
        private boolean like;
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

        public Object getProducts() {
            return products;
        }

        public void setProducts(Object products) {
            this.products = products;
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

        public List<ResourceBean> getResource() {
            return resource;
        }

        public void setResource(List<ResourceBean> resource) {
            this.resource = resource;
        }

        public static class UserInfoVOBean {
            /**
             * userNo : 1000004
             * userImg : https://testcdn.sharegoodsmall.com/sharegoods/da3a1f00cbc64733a0a8522ad7e3dbfe.png
             * userName : 15755373887
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
    }
}
