const isEmpty = (param) => {
    let input = param + '';
    return input === '' || input === 'undefined' || input === 'null' || input === '[]' || input === ' ';
};
const isNoEmpty = (input) => {
    return !isEmpty(input);
};
/*
* 12->¥12.00
* 12.000->¥12.00
* */
const formatMoneyString = (num, needSymbol = true) => {
    let temp = (this.isNoEmpty(num) ? num : 0) + '';
    if (temp.indexOf('.') === -1) {
        temp += '.00';
    }
    if ((temp.indexOf('.') + 3) < temp.length) {
        temp = temp.substr(0, temp.indexOf('.') + 3);
    }
    if (needSymbol && temp.indexOf('¥') === -1) {
        temp = '¥' + temp;
    }
    return temp;
};
export default {
    isEmpty,
    isNoEmpty,
    formatMoneyString
};
