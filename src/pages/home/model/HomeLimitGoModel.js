import { observable, action, computed, flow } from 'mobx';
import ScreenUtils from '../../../utils/ScreenUtils';
import { homeType } from '../HomeTypes';
import { homeModule } from './Modules';

const { px2dp } = ScreenUtils;
import HomeApi from '../api/HomeAPI';
import { differenceInCalendarDays, format } from 'date-fns';
import bridge from '../../../utils/bridge';

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

    @computed get limitHeight() {
        const len = (this.currentGoodsList && this.currentGoodsList.length) || 0;
        if (len > 0) {
            return px2dp(98) + len * px2dp(140) + (len - 1) * px2dp(10) + 0.8;
        }
        return 0;
    }

    @action loadLimitGo = flow(function* () {
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
                    } else if (lastSeckills !== 0) {
                        if (lastSeckills > diffTime && date >= parseInt(spikeTime, 0)) {
                            lastSeckills = diffTime;
                            _initialPage = index;
                            _currentPage = index;
                        }
                    }

                    let diff = differenceInCalendarDays(date, spikeTime);
                    let title = '即将开抢';

                    if (diff > 0) { //如果是昨天， title就是昨日精选
                        if (diff === 1) {
                            title = '昨日精选';
                        } else {
                            title = format(spikeTime, 'D日') + '精选';
                        }
                    }

                    if (diff === 0 && date >= parseInt(spikeTime, 0)) {  //今天，已经结束
                        title = '抢购中';
                    }

                    console.log('loadLimitGo', diff);

                    let timeFormat = '';
                    if (diff === 0) {
                        timeFormat = format(spikeTime, 'HH:mm');
                    } else if (diff === 1) {
                        timeFormat = '昨日' + format(spikeTime, 'HH:mm');
                    } else if (diff === -1) {
                        timeFormat = '明日' + format(spikeTime, 'HH:mm');
                    } else {
                        timeFormat = format(spikeTime, 'D日HH:mm');
                    }

                    _spikeList.push({
                        title: title,
                        id: index,
                        time: timeFormat,
                        diff: diff,
                        activityCode: (result[index] && result[index].simpleActivity.code) || '',
                        goods: (result[index] && result[index].productDetailList) || []
                    });
                });
                this.initialPage = _initialPage;
                this.currentPage = _currentPage;
                this.spikeList = _spikeList;
                this.currentGoodsList = (_spikeList[_currentPage] && _spikeList[_currentPage].goods) || [];
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
            this.loadLimitGo();
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
