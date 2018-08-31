package com.mingrong.bean;

import java.util.List;

/**
 * Created by zhanglei on 2018/6/19.
 */

public class AreaListResponse {

    /**
     * name : 北京市
     * value : [{"name":"市辖区","code":110100,"value":[{"name":"东城区","code":110101},{"name":"西城区","code":110102},{"name":"崇文区","code":110103},{"name":"宣武区","code":110104},{"name":"朝阳区","code":110105},{"name":"丰台区","code":110106},{"name":"石景山区","code":110107},{"name":"海淀区","code":110108},{"name":"门头沟区","code":110109},{"name":"房山区","code":110111},{"name":"通州区","code":110112},{"name":"顺义区","code":110113},{"name":"昌平区","code":110114},{"name":"大兴区","code":110115},{"name":"怀柔区","code":110116},{"name":"平谷区","code":110117}]},{"name":"县","code":110200,"value":[{"name":"密云县","code":110228},{"name":"延庆县","code":110229}]}]
     * code : 110000
     */

    private String name;
    private int code;
    private List<ValueBeanX> value;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public List<ValueBeanX> getValue() {
        return value;
    }

    public void setValue(List<ValueBeanX> value) {
        this.value = value;
    }

    public static class ValueBeanX {
        /**
         * name : 市辖区
         * code : 110100
         * value : [{"name":"东城区","code":110101},{"name":"西城区","code":110102},{"name":"崇文区","code":110103},{"name":"宣武区","code":110104},{"name":"朝阳区","code":110105},{"name":"丰台区","code":110106},{"name":"石景山区","code":110107},{"name":"海淀区","code":110108},{"name":"门头沟区","code":110109},{"name":"房山区","code":110111},{"name":"通州区","code":110112},{"name":"顺义区","code":110113},{"name":"昌平区","code":110114},{"name":"大兴区","code":110115},{"name":"怀柔区","code":110116},{"name":"平谷区","code":110117}]
         */

        private String name;
        private int code;
        private List<ValueBean> value;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getCode() {
            return code;
        }

        public void setCode(int code) {
            this.code = code;
        }

        public List<ValueBean> getValue() {
            return value;
        }

        public void setValue(List<ValueBean> value) {
            this.value = value;
        }

        public static class ValueBean {
            /**
             * name : 东城区
             * code : 110101
             */

            private String name;
            private int code;

            public String getName() {
                return name;
            }

            public void setName(String name) {
                this.name = name;
            }

            public int getCode() {
                return code;
            }

            public void setCode(int code) {
                this.code = code;
            }
        }
    }
}
