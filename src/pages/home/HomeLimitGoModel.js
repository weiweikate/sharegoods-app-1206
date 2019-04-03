import { observable, action, computed, flow } from 'mobx';
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtils
import HomeApi from './api/HomeAPI'
import { differenceInCalendarDays , format} from 'date-fns'

export const limitStatus = {
  del: 0, //删除
  noBegin: 1, //未开始
  doing: 2, //进行中
  end: 3, //已售完
  endTime: 4, //时间结束
  endDone: 5, //手动结束
}

export class LimitGoModules {
    @observable goodsList = {};
    @observable timeList = [];
    @observable currentGoodsList = [];
    @observable initialPage = 0;
    @observable currentPage = -1;
    @computed get limitHeight() {
      if (this.currentGoodsList.length > 0) {
        return px2dp(92) + this.currentGoodsList.length * px2dp(140) + (this.currentGoodsList.length - 1) * px2dp(10)
      }
      return 0
    }

    @action loadLimitGo = flow(function* (isCache) {
      try {
        const isShowResult = yield HomeApi.isShowLimitGo()
        if (!isShowResult.data) {
          throw new Error('不显示秒杀')
        }

        const res = yield HomeApi.getLimitGo()
        const result = res.data
        const keys = Object.keys(result)
        const sortKeys = keys.sort((val1, val2) =>  parseInt(val1, 0) - parseInt(val2, 0))
        
        let _timeList = []
        let _goodsList = {}
        let _currentDate = 0
        
        let currentId = 0
        let lastSeckills = 0 //最近的秒杀
        sortKeys.map((value, index) => {
          let goods = result[value]
          let seckills = goods.seckills
          if (!_currentDate) {
            _currentDate = goods.date
          }

          let nowTime = new Date(_currentDate)
          let secTime = new Date(parseInt(value, 0))
          let diffTime = Math.abs(_currentDate - parseInt(value, 0))


          if (lastSeckills === 0) {
            lastSeckills = diffTime
            currentId = value
            this.initialPage = index
          } else if (lastSeckills !== 0) {
            if (lastSeckills > diffTime) {
              lastSeckills = diffTime
              currentId = value
              this.initialPage = index
            }
          }

          let diff = differenceInCalendarDays( nowTime, secTime)
          let title = '即将开始'

          if (diff > 0) { //如果是昨天， title就是昨日精选
            title = '昨日精选'
            for (const goodsValue of seckills) {
              if (goodsValue.status === limitStatus.doing) {
                title = '抢购中'
                break
              }
            }
          }

          if (diff === 0 && _currentDate >= parseInt(value, 0)) {  //今天，已经结束
            title = '已结束'
            for (const goodsValue of seckills) {
              if (goodsValue.status === limitStatus.doing) {
                title = '抢购中'
                break
              }
            }
          }

          _timeList.push({
            title: title,
            id: value,
            time: format(secTime, 'HH:mm')
          })

          _goodsList[value] = seckills
        })

        console.log('loadLimitGo', _goodsList, _timeList)

        this.timeList = _timeList
        this.goodsList = _goodsList
        this.currentGoodsList = this.goodsList[currentId]
      } catch (error) {
        console.log(error);
      }
    })

    @action changeLimitGo(id, index) {
      this.currentGoodsList = this.goodsList[id]
      this.currentPage = index
    }

   
}

export const limitGoModule = new LimitGoModules();
