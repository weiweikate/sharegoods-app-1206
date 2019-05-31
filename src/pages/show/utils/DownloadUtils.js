import user from '../../../model/user';
import apiEnvironment from '../../../api/ApiEnvironment';
import bridge from '../../../utils/bridge';
import EmptyUtils from '../../../utils/EmptyUtils';

/**
 * @author xzm
 * @date 2019/5/31
 */

const downloadProduct=(nativeEvent)=>{
    let { detail } = nativeEvent;

    let promises = [];
    if (!EmptyUtils.isEmptyArr(detail.products)) {
        detail.products.map((value) => {
            let showPrice = 0;
            const { singleActivity = {}, groupActivity = {} } = value.promotionResult || {};
            const { endTime: endTimeT, startTime: startTimeT, currentTime = Date.parse(new Date()) } = groupActivity && groupActivity.type ? groupActivity : singleActivity;
            if (currentTime > startTimeT && currentTime < endTimeT + 500) {
                showPrice = value.promotionMinPrice;
            } else {
                showPrice = value.minPrice;
            }
            let data = {
                imageUrlStr: value.imgUrl,
                titleStr: value.name,
                QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/product/99/${value.prodCode}?upuserid=${user.code || ''}`,
                originalPrice: `￥${value.originalPrice}`,
                currentPrice: `￥${showPrice}`
            };
            let promise = bridge.createShowProductImage(JSON.stringify(data));

            promises.push(promise);
        });
    }
    if (!EmptyUtils.isEmptyArr(promises)) {
        Promise.all(promises);
    }
}

export default {
    downloadProduct
};
