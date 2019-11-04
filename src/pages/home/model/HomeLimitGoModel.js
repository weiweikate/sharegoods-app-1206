import { action, computed, flow, observable } from 'mobx';
import ScreenUtils from '../../../utils/ScreenUtils';
import { asyncHandleTopicData, homeType } from '../HomeTypes';
import { homeModule } from './Modules';
import HomeApi from '../api/HomeAPI';
import { differenceInCalendarDays, format } from 'date-fns';
import bridge from '../../../utils/bridge';
import StringUtils from '../../../utils/StringUtils';
import { getSize } from '../../../utils/OssHelper';
import { HomeSource } from '../../../utils/OrderTrackUtil';
import { track, trackEvent } from '../../../utils/SensorsTrack';

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
    //所有限时购的数据
    @observable spikeList = [];
    //当前也数据
    currentGoodsList = [];
    //当前在哪一页
    @observable currentPage = -1;
    //是否显示免单
    @observable isShowFreeOrder = false;
    @observable tabWidth = 0;

    /**
     * 返回限时购顶部高度
     * @returns {Number}
     */
    @computed get limitTopHeight() {
        let height = px2dp(42);
        if (this.isShowFreeOrder) {
            height += px2dp(50);
        }
        return height;
    }

    /**
     * 返回限时购时间组件的高度
     * @returns {Number}
     */
    @computed get limitTimeHeight() {
        return px2dp(55);
    }

    /**
     * 选中限时购
     * @param index 选中限时购的下巴
     */
    @action changeLimitGo(index) {
        this.currentGoodsList = (this.spikeList[index] && this.spikeList[index].goods) || [];
        this.currentPage = index;
        homeModule.changelimitGoods(this.currentGoodsList);
    }

    /**
     * 请求限时购数据
     * @type {(...args: any[][]) => CancellablePromise<FlowReturnType<any>>}
     */
    @action loadLimitGo = flow(function* (change) {
        //是否显示免单
        HomeApi.freeOrderSwitch().then((data) => {
            this.isShowFreeOrder = data.data || false;
        });
        try {
            //是否显示限时购
            const isShowResult = yield HomeApi.isShowLimitGo();
            if (!isShowResult.data) {
                this.spikeList = [];
                this.currentGoodsList = [];
                this.currentPage = -1;
                throw new Error('不显示秒杀');
            } else {
                const res = yield HomeApi.getLimitGo({
                    type: 0
                });
                let result = res.data || [];
                result = yield this._handleData(result);

                let _spikeList = [];
                let timeFormats = [];

                let spikeTime = 0;     // 秒杀开始时间
                let lastSeckills = 0;  // 最近的秒杀
                let _currentPage = -1; // 当前page
                let labelUrl = (result[0] && result[0].labelUrl);
                if (StringUtils.isNoEmpty(labelUrl)) {
                    getSize(labelUrl, (width, height) => {
                        this.tabWidth = width * px2dp(18) / height;
                    });
                }
                result.map((data, index) => {
                    spikeTime = (result[index] && result[index].simpleActivity.startTime) || 0;
                    const date = (result[index] && result[index].simpleActivity.currentTime) || 0;

                    let diffTime = Math.abs(date - parseInt(spikeTime, 0));

                    if (lastSeckills === 0) {
                        lastSeckills = diffTime;
                        _currentPage = index;
                    } else if (lastSeckills !== 0) {
                        if (lastSeckills > diffTime && date >= parseInt(spikeTime, 0)) {
                            lastSeckills = diffTime;
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
                        diff,
                        labelUrl,
                        activityCode: (result[index] && result[index].simpleActivity.code) || '',
                        goods: (result[index] && result[index].productDetailList) || []
                    });
                    timeFormats.push(timeFormat);
                });

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
                homeModule.changelimitGoods(this.currentGoodsList);
            }
        } catch (error) {
            console.log(error);
        }
    });
    /**
     * 提前关注
     * @param spu
     * @param code
     */
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

    /**
     * 取消关注
     * @param spu
     * @param code
     */
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

    /**
     * 处理限时自定义专题数据       [good1,[topicData1,topicData2,topicData3],good2] => [good1,topicData1,topicData2,topicData3,good2]
     * @param data
     * @returns {Promise<any[]>}
     * @private
     */
    _handleData(data) {
        let promises = [];
        data.forEach((sbuData, i) => {
            (sbuData.productDetailList || []).forEach((item, index) => {
                //处理自定义专题
                if (item.specialSubject) {
                    promises.push(asyncHandleTopicData({ data: item.specialSubject},HomeSource.limitGo,i, index, this.topicTrack(i,index)).then((data) => {
                        //将处理完的数组插回原来的数组，替代原来老自定义专题数据
                        sbuData.productDetailList.splice(sbuData.productDetailList.indexOf(item), 1, ...data);
                    }));
                    //处理限时购商品数据
                } else if (!item.type) {
                    item.type = homeType.limitGoGoods;
                    item.index = index;
                    //第一个marginTop为0,其余都为10
                    item.itemHeight = (index === 0 ? px2dp(130) : px2dp(140));
                    item.marginTop = (index === 0 ? px2dp(0) : px2dp(10));
                }
            });
        });

        return Promise.all(promises).then(() => {
            return data;
        });
    }

    /**
     * 限时购点击埋点
     * @param i  第几列
     * @param index 第几个
     * @returns {function(*): Function}
     */
    topicTrack=(i, index)=>(specialTopicId)=>()=>{
        // 限时购商品点击埋点
        let activityData = this.spikeList[i];
        track(trackEvent.SpikeProdClick,
            {
                'timeRangeId': activityData.activityCode,
                'timeRange': activityData.time,
                'timeRangeStatus': activityData.title,
                'productIndex': index,
                specialTopicId
            });
    }

}

export const limitGoModule = new LimitGoModules();
