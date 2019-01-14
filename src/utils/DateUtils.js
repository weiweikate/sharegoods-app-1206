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

export default {
    formatDate,
    isToday,
    isTomorrow,
    getFormatDate
};

