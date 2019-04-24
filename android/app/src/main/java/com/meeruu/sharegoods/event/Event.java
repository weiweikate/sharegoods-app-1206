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
}
