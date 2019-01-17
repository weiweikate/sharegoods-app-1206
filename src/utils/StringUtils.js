import { Clipboard } from 'react-native';
import EmptyUtils from './EmptyUtils';

const isEmpty = (param) => {
    let input = param + '';
    return input.trim() === '' || input === 'undefined' || input === 'null' || input === '[]' || input === ' ';
};
export const isNoEmpty = (input) => {
    return !isEmpty(input);
};
/*
* 12->¥12.00
* 12.000->¥12.00
* */
const formatMoneyString = (num, needSymbol = true) => {
    let temp = (isNoEmpty(num) ? num : 0) + '';
    // if (temp.indexOf('.') === -1) {
    //     temp += '.00';
    // }
    //截取
    // if ((temp.indexOf('.') + 3) < temp.length) {
    //     temp = temp.substr(0, temp.indexOf('.') + 3);
    // }
    //添加
    // if ((temp.indexOf('.') + 2 === temp.length)) {
    //     temp += '0';
    // }

    if (needSymbol && temp.indexOf('¥') === -1) {
        temp = '¥' + temp;
    }
    return temp;
};
const formatDecimal = (num, needSymbol = true) => {
    let temp = (isNoEmpty(num) ? num : 0) + '';
    if (temp.indexOf('.') === -1) {
        temp += '.00';
    } else{
        temp=num.toFixed(2);
    }
    //截取
    // if ((temp.indexOf('.') + 3) < temp.length) {
    //     temp = temp.substr(0, temp.indexOf('.') + 3);
    // }
    //添加
    // if ((temp.indexOf('.') + 2 === temp.length)) {
    //     temp += '0';
    // }

    return temp;
};
const checkPhone = (str) => {
    let myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
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
/**
 * phone 手机号
 * 如15577773333 => 155****3333
 */
const formatPhoneNumber = (phone) => {
    if (checkPhone(phone)) {
        return '' + phone.replace(phone.substr(3, 4), '****');
    } else {
        return '***********';
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
    let format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    //号码规则校验
    if (!format.test(id)) {
        return false;
    }
    //区位码校验
    //出生年月日校验   前正则限制起始年份为1900;
    let year = id.substr(6, 4),//身份证年
        month = id.substr(10, 2),//身份证月
        date = id.substr(12, 2),//身份证日
        time = Date.parse(month + '-' + date + '-' + year),//身份证日期时间戳date
        now_time = Date.parse(new Date()),//当前时间戳
        dates = (new Date(year, month, 0)).getDate();//身份证当月天数
    if (time > now_time || date > dates) {
        return false;
    }
    //校验码判断
    let c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];   //系数
    let b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];  //校验码对照表
    let id_array = id.split('');
    let sum = 0;
    for (let k = 0; k < 17; k++) {
        sum += parseInt(id_array[k]) * parseInt(c[k]);
    }
    if (id_array[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
        return false;
    }
    return true;
};
//111122223333889=>'* * * *   * * * *   * * * *   8 8 9'
const formatBankCardNum = (num) => {
    let str = num + '';
    let headStr = '* * * *   * * * *   * * * *   ';
    return headStr + str.charAt(str.length - 3) + ' ' + str.charAt(str.length - 2) + ' ' + str.charAt(str.length - 1);
};
//银行卡号判断
const checkBankCard = (bankCard) => {
    let bankno = bankCard;
    let lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
    let first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
    let newArr = [];
    for (let i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1));
    }
    let arrJiShu = []; //奇数位*2的积 <9
    let arrJiShu2 = []; //奇数位*2的积 >9
    let arrOuShu = []; //偶数位数组
    for (let j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 === 1) { //奇数位
            if (parseInt(newArr[j]) * 2 < 9) {
                arrJiShu.push(parseInt(newArr[j]) * 2);
            } else {
                arrJiShu2.push(parseInt(newArr[j]) * 2);
            }
        } else //偶数位
        {
            arrOuShu.push(newArr[j]);
        }
    }

    let jishu_child1 = []; //奇数位*2 >9 的分割之后的数组个位数
    let jishu_child2 = []; //奇数位*2 >9 的分割之后的数组十位数
    for (let h = 0; h < arrJiShu2.length; h++) {
        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }

    let sumJiShu = 0; //奇数位*2 < 9 的数组之和
    let sumOuShu = 0; //偶数位数组之和
    let sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    let sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    let sumTotal = 0;
    for (let m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }

    for (let n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }

    for (let p = 0; p < jishu_child1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

    //计算luhn值
    let k = parseInt(sumTotal) % 10 === 0 ? 10 : parseInt(sumTotal) % 10;
    let luhn = 10 - k;

    if (lastNum === luhn) {
        return true;
    } else {
        return false;
    }
};
//判断正整数
const checkIsPositionNumber = (num) => {
    let reg = /^[1-9]+[0-9]*]*$/;
    return reg.test(num);
};

//剪切板
const clipboardSetString = (content) => {
    Clipboard.setString(content);
};
const clipboardGetString = () => {
    return Clipboard.getString();
};

//去左空格
function ltrim(s) {
    return s.replace(/(^\s*)/g, '');
}

//去右空格
function rtrim(s) {
    return s.replace(/(\s*$)/g, '');
}

//去左右空格
function trim(s) {
    return rtrim(ltrim(s));
}

//去左右空格
function checkEmoji(s) {
    let reg = /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g;
    return reg.test(s);
}

//手机号中间4位用*代替
function encryptPhone(s) {
    if (EmptyUtils.isEmpty(s)) {
        return s;
    }
    if (!checkPhone(s)) {
        return s;
    }

    return s.substr(0, 3) + '****' + s.substr(7);
}

function parsingRoute(s) {
    let index1 = s.indexOf('?');
    let result = {};
    if (index1 === -1) {
        result = { routeName: s };
    } else {
        let routeName = s.slice(0, index1);
        let subStr = s.slice(index1 + 1, s.length);
        let keyVlaues = subStr.split('&');
        keyVlaues = keyVlaues.filter((item) => {
            if (item.indexOf('=') !== -1 && item.indexOf('=') !== item.length - 1 && item.indexOf('=') !== 0) {
                // '='存在且不是最后一个位
                return true;
            } else {
                return false;
            }
        });
        let params = null;
        keyVlaues.forEach((item) => {
            let index = item.indexOf('=');
            let key = item.slice(0, index);
            let value = item.slice(index + 1, item.length);
            if (params) {

            } else {
                params = {};
            }
            params[key] = value;

        });
        result = { routeName, params };
    }

    return result;
}


export default {
    isEmpty,
    isNoEmpty,
    formatMoneyString,
    checkPhone,
    checkPassword,
    formatString,
    isChineseName,
    isCardNo,
    formatBankCardNum,
    checkBankCard,
    checkIsPositionNumber,
    clipboardSetString,
    clipboardGetString,
    trim,
    checkEmoji,
    encryptPhone,
    formatPhoneNumber,
    parsingRoute,
    formatDecimal
};



