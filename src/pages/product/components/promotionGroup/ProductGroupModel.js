/**
 * @author 陈阳君
 * @date on 2019/09/05
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */
import ProductApi from '../../api/ProductApi';
import { observable } from 'mobx';

export default class ProductGroupModel {

    @observable hasOpenGroup = false;
    @observable groupId = '';
    @observable groupList = [];
    @observable groupProducts = [];
    @observable groupDesc = '';

    @observable showAlert = true;

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

    requestGroupList = ({ prodCode, activityCode }) => {
        if (!activityCode && !prodCode) {
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

    requestGroupDesc = () => {
        ProductApi.promotion_group_activityDesc().then((data) => {
            this.groupDesc = data.data;
        }).catch(e => {
        });
    };
}
