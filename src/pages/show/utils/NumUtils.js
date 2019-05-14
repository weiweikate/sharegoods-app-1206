/**
 * @author xzm
 * @date 2019/5/14
 */

const formatShowNum = (num) => {
    if (num <= 999) {
        return num + "";
    }

    if (num > 999 && num <= 100000) {
        return "999+";
    }

    return "10w+";
};

export default {
    formatShowNum
}
