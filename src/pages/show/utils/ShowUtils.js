/**
 * @author xzm
 * @date 2019/5/14
 */


const formatShowNum = (num) => {
    if (num <= 999) {
        return num + '';
    } else if (num < 10000) {
        return parseInt(num / 1000) + 'K+';
    } else if (num < 100000) {
        return parseInt(num / 10000) + 'W+';
    } else {
        return '10W+';
    }
};


function getUrlVars(url) {

    var vars = {};
    if (url) {
        url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
            vars[key] = value;
        });
    }
    return vars;
}

export default {
    formatShowNum,
    getUrlVars
};
