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
        return StringUtils.isNoEmpty(this.ruleValue);
    }

    @computed get showRuleText() {
        const rule = {
            '1111': `团长可额外获得${this.sendAmount}元返现哦〜`,
            '1110': `只有新用户可参团。团长可额外获得${this.sendAmount}元返现哦〜`,
            '1100': `只有新用户可参加。团长可额外获得${this.sendAmount}元返现哦〜`,
            '1101': `只有新用户可开团。团长可额外获得${this.sendAmount}元返现哦〜`,
            '0000': `新/老用户均不可参加此团〜`,
            '0001': `只有老用户才可参团参加哦〜`,
            '0010': `只有老用户可开团参加。团长可额外获得${this.sendAmount}元返现哦〜`,
            '0011': `只有老用户可参加。团长可额外获得${this.sendAmount}元返现哦〜`,
            '0110': `只有新用户可参团、老用户可开团。团长可额外获得${this.sendAmount}元返现哦〜`,
            '0100': `只有新用户可参团参加哦〜`,
            '0101': `此团只能参团哦〜`,
            '0111': `只有老用户可开团。团长可额外获得${this.sendAmount}元返现哦〜`,
            '1000': `只有新用户可开团参加。团长可额外获得${this.sendAmount}元返现哦〜`,
            '1001': `只有新用户可开团、老用户可参团。团长可额外获得${this.sendAmount}元返现哦〜`,
            '1011': `只有老用户才可参团。团长可额外获得${this.sendAmount}元返现哦〜`,
            '1010': `此团只能开团哟。团长可额外获得${this.sendAmount}元返现哦〜`
        };
        return rule[this.ruleValue];
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
