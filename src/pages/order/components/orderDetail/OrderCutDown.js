const getDateData = (closeTime) => {
    const timeLeft = {
        years: 0,
        days: 0,
        hours: 0,
        min: 0,
        sec: 0
    };

    let diff = closeTime - Date.parse(new Date()) / 1000;
    if (diff <= 0) {
        // this.sec = 0
        // this.stop(); // 倒计时为0的时候, 将计时器清除
        return { sec: -1 };
    }

    if (diff >= (365.25 * 86400)) {
        timeLeft.years = Math.floor(diff / (365.25 * 86400));
        diff -= timeLeft.years * 365.25 * 86400;
    }
    if (diff >= 86400) {
        timeLeft.days = Math.floor(diff / 86400);
        diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) {
        timeLeft.hours = Math.floor(diff / 3600);
        diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
        timeLeft.min = Math.floor(diff / 60);
        diff -= timeLeft.min * 60;
    }
    this.sec = diff;
    timeLeft.sec = diff;
    return timeLeft;
};

/***格式化***/
const leadingZeros = (num, length = null) => {
    let length_ = length;
    let num_ = num;
    if (length_ === null) {
        length_ = 2;
    }
    num_ = String(num_);
    while (num_.length < length_) {
        num_ = '0' + num_;
    }
    return num_;
};

export  {
    getDateData,
    leadingZeros
}
