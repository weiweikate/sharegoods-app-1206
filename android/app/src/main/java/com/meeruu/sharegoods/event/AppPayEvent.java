package com.meeruu.sharegoods.event;

/**
 * Created by zhanglei on 2018/8/13.
 */

public class AppPayEvent {
//{code:12,msg:"123",sdkCode:12,aliPayResult:{ alipay_trade_app_pay_response:{                         code:"10000",                         sg:"Success",                         app_id:"2014072300007148",                         out_trade_no:"081622560194853",                         trade_no:"2016081621001004400236957647",                         total_amount:"0.01",                         seller_id:"2088702849871851",                         charset:"utf-8",                         timestamp:"2016-10-11 17:43:36" }, sign:"NGfStJf3i3ooWBuCDIQSumOpaGBcQz+aoAqyGh3W6EqA/gmyPYwLJ2REFijY9XPTApI9YglZyMw+ZMhd3kb0mh4RAXMrb6mekX4Zu8Nf6geOwIa9kLOnw0IMCjxi4abDIfXhxrXyj********", sign_type:"RSA2" }}
    /**
     * code : 12
     * msg : 123
     * sdkCode : 12
     * aliPayResult : {"alipay_trade_app_pay_response":{"code":"10000","sg":"Success","app_id":"2014072300007148","out_trade_no":"081622560194853","trade_no":"2016081621001004400236957647","total_amount":"0.01","seller_id":"2088702849871851","charset":"utf-8","timestamp":"2016-10-11 17:43:36"},"sign":"NGfStJf3i3ooWBuCDIQSumOpaGBcQz+aoAqyGh3W6EqA/gmyPYwLJ2REFijY9XPTApI9YglZyMw+ZMhd3kb0mh4RAXMrb6mekX4Zu8Nf6geOwIa9kLOnw0IMCjxi4abDIfXhxrXyj********","sign_type":"RSA2"}
     */

    private int code;
    private String msg;
    private int sdkCode;
    private AliPayResultBean aliPayResult;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public int getSdkCode() {
        return sdkCode;
    }

    public void setSdkCode(int sdkCode) {
        this.sdkCode = sdkCode;
    }

    public AliPayResultBean getAliPayResult() {
        return aliPayResult;
    }

    public void setAliPayResult(AliPayResultBean aliPayResult) {
        this.aliPayResult = aliPayResult;
    }

    public static class AliPayResultBean {
        /**
         * alipay_trade_app_pay_response : {"code":"10000","sg":"Success","app_id":"2014072300007148","out_trade_no":"081622560194853","trade_no":"2016081621001004400236957647","total_amount":"0.01","seller_id":"2088702849871851","charset":"utf-8","timestamp":"2016-10-11 17:43:36"}
         * sign : NGfStJf3i3ooWBuCDIQSumOpaGBcQz+aoAqyGh3W6EqA/gmyPYwLJ2REFijY9XPTApI9YglZyMw+ZMhd3kb0mh4RAXMrb6mekX4Zu8Nf6geOwIa9kLOnw0IMCjxi4abDIfXhxrXyj********
         * sign_type : RSA2
         */

        private AlipayTradeAppPayResponseBean alipay_trade_app_pay_response;
        private String sign;
        private String sign_type;

        public AlipayTradeAppPayResponseBean getAlipay_trade_app_pay_response() {
            return alipay_trade_app_pay_response;
        }

        public void setAlipay_trade_app_pay_response(AlipayTradeAppPayResponseBean alipay_trade_app_pay_response) {
            this.alipay_trade_app_pay_response = alipay_trade_app_pay_response;
        }

        public String getSign() {
            return sign;
        }

        public void setSign(String sign) {
            this.sign = sign;
        }

        public String getSign_type() {
            return sign_type;
        }

        public void setSign_type(String sign_type) {
            this.sign_type = sign_type;
        }

        public static class AlipayTradeAppPayResponseBean {
            /**
             * code : 10000
             * sg : Success
             * app_id : 2014072300007148
             * out_trade_no : 081622560194853
             * trade_no : 2016081621001004400236957647
             * total_amount : 0.01
             * seller_id : 2088702849871851
             * charset : utf-8
             * timestamp : 2016-10-11 17:43:36
             */

            private String code;
            private String sg;
            private String app_id;
            private String out_trade_no;
            private String trade_no;
            private String total_amount;
            private String seller_id;
            private String charset;
            private String timestamp;

            public String getCode() {
                return code;
            }

            public void setCode(String code) {
                this.code = code;
            }

            public String getSg() {
                return sg;
            }

            public void setSg(String sg) {
                this.sg = sg;
            }

            public String getApp_id() {
                return app_id;
            }

            public void setApp_id(String app_id) {
                this.app_id = app_id;
            }

            public String getOut_trade_no() {
                return out_trade_no;
            }

            public void setOut_trade_no(String out_trade_no) {
                this.out_trade_no = out_trade_no;
            }

            public String getTrade_no() {
                return trade_no;
            }

            public void setTrade_no(String trade_no) {
                this.trade_no = trade_no;
            }

            public String getTotal_amount() {
                return total_amount;
            }

            public void setTotal_amount(String total_amount) {
                this.total_amount = total_amount;
            }

            public String getSeller_id() {
                return seller_id;
            }

            public void setSeller_id(String seller_id) {
                this.seller_id = seller_id;
            }

            public String getCharset() {
                return charset;
            }

            public void setCharset(String charset) {
                this.charset = charset;
            }

            public String getTimestamp() {
                return timestamp;
            }

            public void setTimestamp(String timestamp) {
                this.timestamp = timestamp;
            }
        }
    }
}
