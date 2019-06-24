/**
 * 将日期格式化成指定格式的字符串
 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 */
export function formatDate(date, fmt) {
    date = parseInt(date.toString(), 0);
    fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
    date = date || new Date();
    date = typeof date === 'number' ? new Date(date) : date;
    date = typeof date === 'string' ? new Date(date) : date;
    const obj =
        {
            y: date.getFullYear(), // 年份，注意必须用getFullYear
            M: date.getMonth() + 1, // 月份，注意是从0-11
            d: date.getDate(), // 日期
            q: Math.floor((date.getMonth() + 3) / 3), // 季度
            w: date.getDay(), // 星期，注意是0-6
            H: date.getHours(), // 24小时制
            h: date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
            m: date.getMinutes(), // 分钟
            s: date.getSeconds(), // 秒
            S: date.getMilliseconds() // 毫秒
        };
    const week = ['天', '一', '二', '三', '四', '五', '六'];
    for (const i in obj) {
        fmt = fmt.replace(new RegExp(`${i}+`, 'g'), (m) => {
            let val = `${obj[i]}`;
            if (i === 'w') {
                return (m.length > 2 ? '星期' : '周') + week[val];
            }
            for (let j = 0, len = val.length; j < m.length - len; j++) {
                val = `0${val}`;
            }
            return m.length === 1 ? val : val.substring(val.length - m.length);
        });
    }
    return fmt;
}

/**
 * @param date Date()
 * @returns  true/false 是否是今天
 */
export const isToday = (date) => {
    if (!date) {
        return false;
    }
    date = new Date(date);
    return (new Date().toDateString() === date.toDateString());
};


export const isTomorrow = (date) => {
    if (!date) {
        return false;
    }
    date = new Date(date);
    let currentDate = new Date();
    let today1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime();//'今天凌晨'
    let today = new Date(today1 + 24 * 3600 * 1000).getTime();
    let tomorrow = new Date(today + 24 * 3600 * 1000 - 1).getTime();
    return (date.getTime() >= today && tomorrow >= date.getTime());
};
export const getFormatDate = (timestamp, fmt = 'yyyy-MM-dd hh:mm:ss') => {
    timestamp = parseInt(timestamp.toString(), 0);
    timestamp = parseInt(timestamp + '000', 0);
    let newDate = new Date(timestamp);
    const dateFormat = function(format) {
        let date = {
            'M+': newDate.getMonth() + 1,
            'd+': newDate.getDate(),
            'h+': newDate.getHours(),
            'm+': newDate.getMinutes(),
            's+': newDate.getSeconds(),
            'q+': Math.floor((newDate.getMonth() + 3) / 3),
            'S+': newDate.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (newDate.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (let k in date) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1
                    ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
            }
        }
        return format;
    };
    return dateFormat(fmt);
};

//JS日期系列：根据日期 得到年龄
//参数sDate1，sDate2：参数sDate1：创建时间， 参数sDate2：当前时间 格式：2018-6-24

export  const jsGetAge = (sDate1,sDate2)=>{
    let fixDate = function(sDate){
        let aD = sDate.split('-');
        for(let i = 0; i < aD.length; i++){
            aD[i] = fixZero(parseInt(aD[i]));
        }
        return aD.join('-');
    };

    let fixZero = function(n){
        return n < 10 ? '0' + n : n;
    };
    let fixInt = function(a){
        for(let i = 0; i < a.length; i++){
            a[i] = parseInt(a[i]);
        }
        return a;
    };

    let getMonthDays = function(y,m){
        let aMonthDays = [0,31,28,31,30,31,30,31,31,30,31,30,31];
        if((y % 400 == 0) || (y % 4 == 0 && y % 100 != 0)){
            aMonthDays[2] = 29;
        }
        return aMonthDays[m];
    };

    let y = 0;
    let m = 0;
    let d = 0;
    let sTmp;
    let aTmp;
        sDate1 = fixDate(sDate1);
        sDate2 = fixDate(sDate2);
        if(sDate1 > sDate2){
            sTmp = sDate2;
            sDate2 = sDate1;
            sDate1 = sTmp;
        }
        let aDate1 = sDate1.split('-');
        aDate1 = fixInt(aDate1);
        let aDate2 = sDate2.split('-');
        aDate2 = fixInt(aDate2);
        //年份
        y = aDate2[0] - aDate1[0];
        if( sDate2.replace(aDate2[0],'') < sDate1.replace(aDate1[0],'')){
            y = y - 1;
        }
        //月份
        aTmp = [aDate1[0] + y,aDate1[1],fixZero(aDate1[2])];
        while(true){
            if(aTmp[1] == 12){
                aTmp[0]++;
                aTmp[1] = 1;
            }else{
                aTmp[1]++;
            }
            if(([aTmp[0],fixZero(aTmp[1]),aTmp[2]]).join('-') <= sDate2){
                m++;
            } else {
                break;
            }
        }
        //天数
        aTmp = [aDate1[0] + y,aDate1[1] + m,aDate1[2]];
        if(aTmp[1] > 12){
            aTmp[0]++;
            aTmp[1] -= 12;
        }
        while(true){
            if(aTmp[2] == getMonthDays(aTmp[0],aTmp[1])){
                aTmp[1]++;
                aTmp[2] = 1;
            } else {
                aTmp[2]++;
            }
            sTmp = ([aTmp[0],fixZero(aTmp[1]),fixZero(aTmp[2])]).join('-');
            if(sTmp <= sDate2){
                d++;
            } else {
                break;
            }
        }

        if(y > 0){
            return y + '年';
        }
        if(m > 0){
            return m + '月';
        }
        return d + '天';
}

export default {
    formatDate,
    isToday,
    isTomorrow,
    getFormatDate,
    jsGetAge
};

