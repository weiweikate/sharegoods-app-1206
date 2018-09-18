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
const formatString = (text, length = 10) => {
    let str = text + '';
    if (str.length > length) {
        return str.substr(0, length) + '···';
    } else {
        return str;
    }
};
/*
 * 名字判断：2-16位字母或者汉字
 * */
const isChineseName = (name) => {
    let reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s|A-Za-z]{2,16}$/;
    return reg.test(name);
};
/**
 * 身份证验证
 */

const isCardNo = (id) => {
    // 1 "验证通过!", 0 //校验不通过
    var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    //号码规则校验
    if (!format.test(id)) {
        return false;
    }
    //区位码校验
    //出生年月日校验   前正则限制起始年份为1900;
    var year = id.substr(6, 4),//身份证年
        month = id.substr(10, 2),//身份证月
        date = id.substr(12, 2),//身份证日
        time = Date.parse(month + '-' + date + '-' + year),//身份证日期时间戳date
        now_time = Date.parse(new Date()),//当前时间戳
        dates = (new Date(year, month, 0)).getDate();//身份证当月天数
    if (time > now_time || date > dates) {
        return false;
    }
    //校验码判断
    var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);   //系数
    var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');  //校验码对照表
    var id_array = id.split('');
    var sum = 0;
    for (var k = 0; k < 17; k++) {
        sum += parseInt(id_array[k]) * parseInt(c[k]);
    }
    if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
        return false;
    }
    return true;
};

export default {
    isEmpty,
    isNoEmpty,
    formatMoneyString,
    checkPhone,
    checkPassword,
    formatString,
    isChineseName,
    isCardNo
};


