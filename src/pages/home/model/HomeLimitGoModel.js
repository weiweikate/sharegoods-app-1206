import { action, computed, flow, observable } from 'mobx';
import ScreenUtils from '../../../utils/ScreenUtils';
import { homeType } from '../HomeTypes';
import { homeModule } from './Modules';
import HomeApi from '../api/HomeAPI';
import { differenceInCalendarDays, format } from 'date-fns';
import bridge from '../../../utils/bridge';

const { px2dp } = ScreenUtils;

export const limitStatus = {
    del: 0, //删除
    noBegin: 1, //未开始
    doing: 2, //进行中
    end: 3, //已售完
    endTime: 4, //时间结束
    endDone: 5 //手动结束
};

export class LimitGoModules {
    @observable spikeList = [];
    @observable currentGoodsList = [];
    @observable initialPage = 0;
    @observable currentPage = -1;
    @observable isShowFreeOrder = false;

    @computed get limitHeight() {
        const len = (this.currentGoodsList && this.currentGoodsList.length) || 0;
        let height = 0;
        if (len > 0) {
            height = px2dp(93) + len * px2dp(140) + (len - 1) * px2dp(10) + 0.8;
        } else {
            height = px2dp(93) + 0.8;
        }

        if (this.isShowFreeOrder) {
            height += px2dp(50);
        }
        return height;
    }

    @action loadLimitGo = flow(function* (change) {
        HomeApi.freeOrderSwitch().then((data) => {
            this.isShowFreeOrder = data.data || false;
        });
        try {
            const isShowResult = yield HomeApi.isShowLimitGo();
            if (!isShowResult.data) {
                this.spikeList = [];
                this.currentGoodsList = [];
                this.initialPage = 0;
                this.currentPage = -1;
                throw new Error('不显示秒杀');
            } else {
                const res = yield HomeApi.getLimitGo({
                    type: 0
                });
                const result = res.data || [];
                let _spikeList = [];
                let timeFormats = [];

                let spikeTime = 0;     // 秒杀开始时间
                let lastSeckills = 0;  // 最近的秒杀
                let _initialPage = 0;  // 初始page
                let _currentPage = -1; // 当前page
                result.map((data, index) => {
                    spikeTime = (result[index] && result[index].simpleActivity.startTime) || 0;
                    const date = (result[index] && result[index].simpleActivity.currentTime) || 0;

                    let diffTime = Math.abs(date - parseInt(spikeTime, 0));

                    if (lastSeckills === 0) {
                        lastSeckills = diffTime;
                        _initialPage = index;
                        _currentPage = index;
                    } else if (lastSeckills !== 0) {
                        if (lastSeckills > diffTime && date >= parseInt(spikeTime, 0)) {
                            lastSeckills = diffTime;
                            _initialPage = index;
                            _currentPage = index;
                        }
                    }

                    let diff = differenceInCalendarDays(date, spikeTime);
                    let title = '即将开抢';

                    //如果是昨天， title就是昨日精选
                    if (diff === 1) {
                        title = '昨日精选';
                    } else if (diff === -1) {
                        title = '明日秒杀';
                    } else if (diff !== 0) {
                        title = format(spikeTime, 'M月D日');
                    }

                    if (diff === 0 && date >= parseInt(spikeTime, 0)) {  //今天，已经结束
                        title = '抢购中';
                    }

                    console.log('loadLimitGo', diff);

                    let timeFormat = format(spikeTime, 'HH:mm');

                    _spikeList.push({
                        title: title,
                        id: index,
                        time: timeFormat,
                        diff: diff,
                        activityCode: (result[index] && result[index].simpleActivity.code) || '',
                        goods: (result[index] && result[index].productDetailList) || []
                    });
                    timeFormats.push(timeFormat);
                });
                this.initialPage = _initialPage;

                let currentTimeFormat = null;
                //获取当前选中限时购的名称
                if (this.currentPage > -1 && this.spikeList.length > this.currentPage) {
                    currentTimeFormat = this.spikeList[this.currentPage].time;
                }
                // 选中限时购还在请求下来的数组中
                if (currentTimeFormat && timeFormats.indexOf(currentTimeFormat) !== -1 && !change) {
                    // 数组越界才进行变动，否则当前页面不必变动
                    if (this.currentPage > _spikeList.length - 1) {
                        this.currentPage = timeFormats.indexOf(currentTimeFormat);
                    }
                } else {
                    //不然显示离当前时间最近的限时购
                    this.currentPage = _currentPage;
                }
                this.spikeList = _spikeList;
                this.currentGoodsList = (_spikeList[this.currentPage] && _spikeList[this.currentPage].goods) || [];
                homeModule.changeHomeList(homeType.limitGo);
            }
        } catch (error) {
            console.log(error);
        }
    });

    @action followSpike(spu, code) {
        HomeApi.followLimit({
            spu,
            activityCode: code
        }).then(res => {
            this.loadLimitGo(false);
        }).catch(err => {
            bridge.$toast(err.msg);
        });
    }

    @action cancleFollow(spu, code) {
        HomeApi.cancleFollow({
            spu,
            activityCode: code
        }).then(res => {
            this.loadLimitGo(false);
        }).catch(err => {
            bridge.$toast(err.msg);
        });
    }

    @action changeLimitGo(index) {
        this.currentGoodsList = (this.spikeList[index] && this.spikeList[index].goods) || [];
        this.currentPage = index;
        homeModule.changeHomeList(homeType.limitGo);
    }
}

export const limitGoModule = new LimitGoModules();
