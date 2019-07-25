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

function getCover(detail) {
    if(detail){
        if(detail.showType === 3){
            let resource = detail.resource;
            for(let i = 0;i<resource.length;i++){
                if(resource[i].type === 5){
                    return resource[i].baseUrl;
                }
            }
        }else {
            return detail.resource[0].baseUrl;
        }
    }
    return '';
}

export default {
    formatShowNum,
    getUrlVars,
    getCover
};
