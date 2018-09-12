const isEmpty = (param) => {
    let input = param + '';
    return input === '' || input === 'undefined' || input === 'null' || input === '[]' || input === ' ';
};
 const isNoEmpty=(input)=>{
    return !isEmpty(input);
};
/*
* 12->¥12.00
* 12.000->¥12.00
* */
const formatMoneyString = (num, needSymbol = true) => {
    let temp = (isNoEmpty(num) ? num : 0) + '';
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
const checkPhone = (str) => {
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
};
/*
 * 密码判断：密码6-18位字母加数字，不含特殊符号
 * */
const checkPassword = (password) => {
    let reg = /^[a-zA-Z0-9]{6,18}$/;
    let hasNum = /[0-9]/i;
    let hasLetter = /[a-zA-Z]/i;
    return reg.test(password) && hasNum.test(password) && hasLetter.test(password);
};
//取前面10位，多余补···
const formatString=(text,length=10)=>{
    let str=text+'';
    if (str.length>length){
        return str.substr(0,length)+'···'
    }else{
        return str
    }
}

export default {
    isEmpty,
    isNoEmpty,
    formatMoneyString,
    checkPhone,
    checkPassword,
    formatString
};


