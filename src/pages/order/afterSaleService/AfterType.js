export const PageType = {
    PAGE_AREFUND:      0, //退款
    PAGE_SALES_RETURN: 1, //退货
    PAGE_EXCHANGE:     2, //换货
}

export const AfterStatus = {
    STATUS_IN_REVIEW:           1, //待审核
    STATUS_SEND_BACK:           2, //待寄回
    STATUS_WAREHOUSE_CONFIRMED: 3, //待仓库确认
    STATUS_PLATFORM_PROCESSING: 4, //待平台处理
    STATUS_SUCCESS:             5, //售后完成
    STATUS_FAIL:                6,
}

export const SubStatus = {
    REFUSE_REVOKED:   1, //用户自己关闭
    REFUSE_OVERTIME:  2, //超时
    REFUSE_APPLY:     3, //拒绝售后申请
    REFUSE_AFTER:     4, //拒绝售后
}

export const RefundStatus = {
    REFUND_AWAIT:         1, //待退款
    REFUND_SUCCESS:       2, //退款成功
    REFUND_FAIL_THIRD:    3, //三方退款失败
    REFUND_FAIL_PLATFORM: 4, //平台退款失败
    REFUND_CANCEL:        5, //取消退款
};

export function isRefundFail(refundStatus) {
    //三方退款失败 平台退款失败 为退款失败
    if (refundStatus && (refundStatus === RefundStatus.REFUND_FAIL_THIRD || refundStatus === RefundStatus.REFUND_FAIL_PLATFORM)) {
        return true;
    }

    return false;
}



// 1.待审核 2.待寄回 3.待仓库确认 4.待平台处理 5.售后完成 6.售后关闭
//subStatus,  // REVOKED(1, "手动撤销"),OVERTIME(2, "超时关闭"),(3, "拒绝关闭");
