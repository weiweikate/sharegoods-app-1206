const isEmpty = (param) => {
    let input = param + '';
    return input == '' || input == 'undefined' || input == 'null' || input == '[]' || input == ' ';
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

export default {
    isEmpty,
    checkPhone,
    checkPassword
};


