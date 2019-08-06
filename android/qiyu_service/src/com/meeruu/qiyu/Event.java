package com.meeruu.qiyu;

public class Event {

    public static class QiyuUrlEvent {
        private String url;

        public QiyuUrlEvent(String url) {
            this.url = url;
        }

        public String getUrl() {
            return url;
        }
    }

    public static class QiyuShopIdEvent {

        private String shopId;
        private String shopName;

        public QiyuShopIdEvent(String shopId, String shopName) {
            this.shopId = shopId;
            this.shopName = shopName;
        }

        public String getShopId() {
            return this.shopId;
        }

        public String getShopName() {
            return this.shopName;
        }
    }
}
