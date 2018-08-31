import constants from "../constants/constants";
import {NativeModules,Clipboard} from "react-native";
import RouterPaths from '../constants/RouterPaths'
isEmpty = (param) => {
    let input=param+''
    return input == '' || input == 'undefined'|| input == 'null'|| input == '[]'|| input == ' '
}

isNoEmpty = (input) => {
    return !isEmpty(input)
}

trim = (input) => {
    input.replace(/^\s+|\s+$/, '')
}

startsWith = (input, prefix) => {
    return input.indexOf(prefix) === 0;
}

endsWith = (input, suffix) => {
    return input.lastIndexOf(suffix) === 0;
}

equals = (input1, input2) => {
    return input1 == input2
}

contains = (input, searchSeq) => {
    return input.indexOf(searchSeq) >= 0
}

containsWhitespace = (input) => {
    return this.contains(input, ' ')
}

deleteWhitespace = (input) => {
    return input.replace(/\s+/g, '')
}

//只包含字母
isAlpha = (input) => {
    return /^[a-z]+$/i.test(input)
}

//只包含字母、空格
isAlphaSpace = (input) => {
    return /^[a-z\s]*$/i.test(input)
}

//只包含字母、数字
isAlphanumeric = (input) => {
    return /^[a-z0-9]+$/i.test(input)
}

//只包含字母、数字和空格
isAlphanumericSpace = (input) => {
    return /^[a-z0-9\s]*$/i.test(input)
}

//数字
isNumeric = (input) => {
    return /^(?:[1-9]\d*|0)(?:\.\d+)?$/.test(input)
}

//小数
isDecimal = (input) => {
    return /^[-+]?(?:0|[1-9]\d*)\.\d+$/.test(input)
}

isContainChildrenStr = (str, childrenStr) => {
    return str.indexOf(childrenStr) >= 0;
};

getMoneyCount = (money) => {
    if (money === null || money === "" || money == undefined) {
        return
    }
    let numArray = money.toString().split("");//获取整数部分
    if (numArray.length > 3) {
        let result = [];
        let count = 0;
        for (let i = numArray.length - 1; i >= 0; i--) {
            count++;//表示从左到右的数字序号
            result.unshift(numArray[i]);
            if (!(count % 3) && i !== 0) {
                result.unshift(".")
            }
        }
        return result.join("");
    } else {
        return money.toString();
    }
};

formatPhone=(phone)=>{
    if (this.isEmpty(phone)){
        return phone
    }
    phone+=''
    switch (parseInt(phone.length)){
        case 11:
            //13588462013   ->  +86 135 **** 2013
            return '+86 '+phone.substring(0,3)+' **** '+phone.substring(7,11)
            break
        default:
            return phone
            break
    }
}
checkPhone=(str)=>{
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}
checkIdCard=()=>{
    var multiplier = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var idDatas = idCard.split("");
    var len = 17;
    var sum = 0;
    for(var i = 0; i < len; i++) {
        sum += idDatas[i] * multiplier[i];
    }
    var remainder = sum % 11;
    var checkCodeArr = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    var checkCode = checkCodeArr[remainder];
    return checkCode === idCard[17];
}
/*
* 12->¥12.00
* 12.000->¥12.00
* */
formatMoneyString=(num,needSymbol=true)=>{
    let temp=(this.isNoEmpty(num)?num:0)+''
    if (temp.indexOf('.')==-1){
        temp+='.00'
    }
    if ((temp.indexOf('.')+3)<temp.length){
        temp=temp.substr(0,temp.indexOf('.')+3)
    }
    if (needSymbol&&temp.indexOf('¥')==-1){
        temp='¥'+temp
    }
    return temp
}
//111122223333889=>'* * * *   * * * *   * * * *   8 8 9'
formatBankCardNum=(num)=>{
    let str=num+''
    let headStr='* * * *   * * * *   * * * *   '
    return headStr+str.charAt(str.length-3)+' '+str.charAt(str.length-2)+' '+str.charAt(str.length-1)
}
existInRouterPaths=(str)=>{
    if (this.isEmpty(str)||!RouterPaths.hasOwnProperty(str)){
        return false
    }else {
        return true
    }

}
//获取一个字符串中指定字符串第n次出现的位置
find=(str,cha,num)=>{
    var x=str.indexOf(cha);
    for(var i=0;i<num;i++){
        x=str.indexOf(cha,x+1);
    }
    return x;
}
convertToArry=(content2)=>{
    let content=content2+''
    let arr=[]
    let textStartTag='<p>'
    let textEndTag='</p>'
    let imgStartTag='src="'
    let imgEndTag='">'
    let textIndex=0
    let imgIndex=0
    if (content.startsWith('<p>')){
        content=content.substring(3,content.length-3)
    }
    for(i=0;i<content.length-5;i++){
        //判断text
        if (content.charAt(i)+content.charAt(i+1)+content.charAt(i+2)==textStartTag){
            let findTextEndPosition=find(content,textEndTag,textIndex)
            let temp=content.substr((i+textStartTag.length),(findTextEndPosition-i-textStartTag.length))
            arr.push({text:temp})
            i=findTextEndPosition
            textIndex+=1
        }
        //判断img
        if (content.charAt(i)+content.charAt(i+1)+content.charAt(i+2)+content.charAt(i+3)+content.charAt(i+4)==imgStartTag){
            let findImgEndPosition=find(content,imgEndTag,imgIndex)
            let temp= content.substr((i+imgStartTag.length),(findImgEndPosition-i-imgStartTag.length))
            arr.push({img:temp})
            i=findImgEndPosition
            imgIndex+=1
        }
    }
    return arr
}
formatPhoneNum=(phoneNum)=>{
    if (this.isEmpty(phoneNum)){
        return phoneNum
    }
    let phone=phoneNum+''
    return phone.substr(0,3)+'***'+phone.substr(phone.length-4,phone.length-1)
}
checkIdentityCode=(num)=> {
    num = num.toUpperCase();
//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
// alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
        return false
    }
//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
//下面分别分析出生日期和校验位
    var len, re;
    len = num.length;
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);
//检查生日日期是否正确
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2]))
            && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
            && (dtmBirth.getDate() == Number(arrSplit[4]))
        if (!bGoodDay) {
// alert('输入的身份证号里出生日期不对！')
            return false
        } else {
//将15位身份证转成18位
//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            return num
        }
    }
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re)
//检查生日日期是否正确
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2]))
            && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
            && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
// alert(dtmBirth.getYear());
//alert(arrSplit[2]);
//alert('输入的身份证号里出生日期不对！');
            return false
        } else {
//检验18位身份证的校验码是否正确。
//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i]
            }
            valnum = arrCh[nTemp % 11];
        }
    }
}
isCardNo=(id)=> {
    // 1 "验证通过!", 0 //校验不通过
    var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    //号码规则校验
    if(!format.test(id)){
        return false;
    }
    //区位码校验
    //出生年月日校验   前正则限制起始年份为1900;
    var year = id.substr(6,4),//身份证年
        month = id.substr(10,2),//身份证月
        date = id.substr(12,2),//身份证日
        time = Date.parse(month+'-'+date+'-'+year),//身份证日期时间戳date
        now_time = Date.parse(new Date()),//当前时间戳
        dates = (new Date(year,month,0)).getDate();//身份证当月天数
    if(time>now_time||date>dates){
        return false
    }
    //校验码判断
    var c = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);   //系数
    var b = new Array('1','0','X','9','8','7','6','5','4','3','2');  //校验码对照表
    var id_array = id.split("");
    var sum = 0;
    for(var k=0;k<17;k++){
        sum+=parseInt(id_array[k])*parseInt(c[k]);
    }
    if(id_array[17].toUpperCase() != b[sum%11].toUpperCase()){
        return false
    }
    return true
}
/*
 * 名字判断：2-16位字母或者汉字
 * */
isName=(name)=>{
    let reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s|A-Za-z]{2,16}$/;
    if(reg.test(name) === false) {
        return  false;
    }else {
        return true
    }
}
/*
 * 名字判断：2-16位字母或者汉字
 * */
isChineseName=(name)=>{
    let reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s|A-Za-z]{2,16}$/;
    return reg.test(name)
}
formatTime=(time)=>{
    let num=parseInt(time)
    let hour=parseInt(num/60/60)!=0?parseInt(num/60/60):'00'
    let minute=parseInt(num/60)!=0?parseInt(num/60):'00'
    let second=parseInt(num%60)!=0?parseInt(num%60):'00'
    return hour+':'+minute+':'+second
}
clipboardSetString=(content)=>{
    Clipboard.setString(content)
}
clipboardGetString=()=>{
    return Clipboard.getString()
}
checkBankCard=(bankCard)=> {
    bankno=bankCard
    var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
    var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
    var newArr = new Array();
    for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1));
    }
    var arrJiShu = new Array(); //奇数位*2的积 <9
    var arrJiShu2 = new Array(); //奇数位*2的积 >9
    var arrOuShu = new Array(); //偶数位数组
    for (var j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 == 1) { //奇数位
            if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
            else arrJiShu2.push(parseInt(newArr[j]) * 2);
        } else //偶数位
            arrOuShu.push(newArr[j]);
    }

    var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }

    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
    var sumOuShu = 0; //偶数位数组之和
    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }

    for (var n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }

    for (var p = 0; p < jishu_child1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

    //计算luhn值
    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
    var luhn = 10 - k;

    if (lastNum == luhn) {
        return true;
    } else {
        return false;
    }
}
/*
 * 密码判断：密码6-18位字母加数字，不含特殊符号
 * */
checkPassword=(password)=>{
    let reg = /^[a-zA-Z0-9]{6,18}$/;
    let hasNum = /[0-9]/i;
    let hasLetter = /[a-zA-Z]/i;
    return reg.test(password)&&hasNum.test(password)&&hasLetter.test(password)
}
//判断正整数
checkIsPositionNumber=(num)=>{
    let reg =/^[1-9]+[0-9]*]*$/ ;
    return reg.test(num)
}
//取前面10位，多余补···
formatString=(text,length=10)=>{
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
    trim,
    startsWith,
    endsWith,
    equals,
    contains,
    containsWhitespace,
    deleteWhitespace,
    isAlpha,
    isAlphaSpace,
    isAlphanumeric,
    isAlphanumericSpace,
    isNumeric,
    isDecimal,
    isContainChildrenStr,
    getMoneyCount,
    formatPhone,
    checkPhone,
    checkIdCard,
    formatMoneyString,
    formatBankCardNum,
    existInRouterPaths,
    convertToArry,
    formatPhoneNum,
    checkIdentityCode,
    isCardNo,
    isChineseName,
    formatTime,
    clipboardSetString,
    clipboardGetString,
    checkBankCard,
    checkPassword,
    checkIsPositionNumber,
    formatString,
}