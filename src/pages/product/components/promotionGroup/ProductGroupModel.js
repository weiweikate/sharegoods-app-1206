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

    @observable hasJoinGroup = false;
    @observable groupList = [];
    @observable groupProducts = [];
    @observable groupDesc = '';

    requestCheckJoinUser = ({ prodCode, activityCode, activityTag }) => {
        ProductApi.promotion_group_checkJoinUser({ prodCode, activityCode, activityTag }).then((data) => {
            this.hasJoinGroup = data.data;
        }).catch(e => {
        });
    };

    requestGroupList = ({ prodCode, activityCode }) => {
        ProductApi.promotion_group_togetherJoin({ prodCode, activityCode }).then((data) => {
            this.groupList = data.data;
        }).catch(e => {
        });
    };

    requestGroupProduct = ({ activityCode }) => {
        ProductApi.promotion_group_itemJoinList({ activityCode }).then((data) => {
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
