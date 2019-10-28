/**
 * @author 陈阳君
 * @date on 2019/09/05
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */
import ProductApi from '../../api/ProductApi';
import { observable, computed } from 'mobx';
import StringUtils from '../../../../utils/StringUtils';

export const navCode = [
    {
        index: 0,
        text: '开新团',
        code: [220210, 220214, 220216, 220221]

    },

    {
        index: 1,
        text: '去参团',
        code: [220212, 220218, 220222, 220225]
    },
    {
        index: 2,
        text: '看看其它团',
        code: [220211, 220213, 220215, 220217, 220219, 220220, 220223, 220224, 220226]
    },
    {
        index: 3,
        text: '去首页',
        code: [220207, 220208]
    }
];

export default class ProductGroupModel {

    @observable hasOpenGroup = false;
    @observable groupId = '';
    @observable groupList = [];
    @observable groupProducts = [];
    @observable groupDesc = '';

    @observable tagName;
    @observable ruleValue;
    @observable sendAmount;

    @observable showAlert = true;

    @computed get showRule() {
        return StringUtils.isNoEmpty(this.ruleValue) && this.ruleValue === '1111';
    }

    @computed get showRuleText() {
        let midText = '', lastText = '';
        if (this.ruleValue === '1110') {
            midText = '只有新用户才能参团。';
        } else if (this.ruleValue === '1100') {
            midText = '只有新用户才能开团、参团。';
        } else if (this.ruleValue === '1101') {
            midText = '只有新用户才能开团。';
        }
        if (this.sendAmount > 0) {
            lastText = `团长可额外获得${this.sendAmount}元返现哦〜`;
        }
        return midText + lastText;
    }

    activityCode;
    prodCode;

    requestCheckStartJoinUser = ({ prodCode, activityCode, activityTag }) => {
        ProductApi.promotion_group_checkStartJoinUser({ prodCode, activityCode, activityTag }).then((data) => {
            const { startGroupLeader, groupId } = data.data;
            this.hasOpenGroup = startGroupLeader;
            this.groupId = groupId;
        }).catch(e => {
        });
    };

    requestGroupList = ({ prodCode, activityCode } = {}) => {
        if (activityCode && prodCode) {
            this.activityCode = activityCode;//调用后赋值   以便后续不传参数刷新用
            this.prodCode = prodCode;
        }
        ProductApi.promotion_group_togetherJoin({
            prodCode: this.prodCode,
            activityCode: this.activityCode
        }).then((data) => {
            this.groupList = data.data;
        }).catch(e => {
        });
    };

    requestGroupProduct = ({ activityCode, prodCode }) => {
        ProductApi.promotion_group_itemJoinList({ activityCode, prodCode }).then((data) => {
            this.groupProducts = data.data;
        }).catch(e => {
        });
    };

    request_rule_info = ({ activityCode }) => {
        ProductApi.product_rule_info({ code: activityCode }).then((data) => {
            const { tagName, ruleValue, sendAmount } = data.data;
            this.tagName = tagName;
            this.ruleValue = ruleValue;
            this.sendAmount = sendAmount;
        }).catch(e => {
        });
    };

    requestGroupDesc = () => {
        ProductApi.promotion_group_activityDesc().then((data) => {
            this.groupDesc = data.data;
        }).catch(e => {
        });
    };
}
