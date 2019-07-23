package com.meeruu.commonlib.event;

public class Event {

    public static class MRHomeRefreshEvent {
        private int homeType;

        public MRHomeRefreshEvent(int homeType) {
            this.homeType = homeType;
        }

        public int getHomeType() {
            return homeType;
        }
    }

    public static class MRNativeTagEvent {
        private String data;

        public MRNativeTagEvent(String data) {
            this.data = data;
        }

        public String getData() {
            return data;
        }
    }

    public static class MR2HTMLEvent {
        private String url;

        public MR2HTMLEvent(String url) {
            this.url = url;
        }

        public String getUrl() {
            return url;
        }
    }

    public static class MRMineMsgEvent {
        private String data;

        public MRMineMsgEvent(String data) {
            this.data = data;
        }

        public String getData() {
            return data;
        }
    }

    public static class MRBaseUrlEvent {
        private String url;

        public MRBaseUrlEvent(String url) {
            this.url = url;
        }

        public String getUrl() {
            return url;
        }
    }

}
