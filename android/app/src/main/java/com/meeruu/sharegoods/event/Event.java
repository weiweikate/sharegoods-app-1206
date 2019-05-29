package com.meeruu.sharegoods.event;

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

}
