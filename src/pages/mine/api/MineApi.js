const api = {
    // 删除地址
    delAddress: ["/user/userAddress/delete", { method: "post" }],
    // 查询地址
    queryAddrList: ["/user/userAddress/query", { method: "get" }],
    // 新增/修改地址
    addOrEditAddr: "/user/userAddress/save",
    // 设置默认地址
    setDefaultAddr: "/user/userAddress/setDefault",
    // 获取省市区列表
    getAreaList: "/config/sysArea/queryAreaList"

};
import ApiUtils from "../../../api/network/ApiUtils";

const MineAPI = ApiUtils(api);

export default MineAPI;
