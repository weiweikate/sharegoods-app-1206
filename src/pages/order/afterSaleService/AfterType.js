export const AfterStatus = {
    IN_REVIEW: 1, //待审核
    SEND_BACK: 2, //待寄回
    WAREHOUSE_CONFIRMED: 3, //待仓库确认
    PLATFORM_PROCESSING: 4, //待平台处理
    FINISH: 5,//售后完成
    FAIL: 6,
}

export const SubStatus = {
    REVOKED: 1,
    OVERTIME: 2,
    REFUSE_APPLY: 3,//拒绝售后申请
    REFUSE_AFTER: 4,//拒绝售后
}


export const PageType = {
    AREFUND: 0,
    SALES_RETURN:1,
    EXCHANGE: 2,
}

// 1.待审核 2.待寄回 3.待仓库确认 4.待平台处理 5.售后完成 6.售后关闭
//subStatus,  // REVOKED(1, "手动撤销"),OVERTIME(2, "超时关闭"),(3, "拒绝关闭");
