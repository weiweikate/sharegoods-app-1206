import { observable, computed, action, flow } from "mobx"
import HomeApi from './api/HomeAPI'

export const homeType = {
    swiper: 1,           //轮播
    classify: 'classify',       //分类
    subject: 'subject',         //专题
    starShop: 3,       //明星店铺
    today: 4,             //今日榜单
    recommend: 5,     //精品推荐
    activity: 'activity',       //活动
    other: 'other'
}

export class BannerModules {
    @observable bannerList = []
    @computed get bannerCount() { return this.bannerList.length }
    loadBannerList = flow(function * () {
        try {
            const res = yield HomeApi.getSwipers({type: homeType.swiper})
            this.bannerList = res.data
        } catch (error) {
            console.log(error)
        }
    })
}

import zqImg from './res/icons/zq.png'
import sqImg from './res/icons/sq.png'
import cxImg from './res/icons/cx.png'

// const bannerModule = new BannerModules()

class ClassifyModules {
    @observable classifyList = []
    @action loadClassifyList = () => {
        this.classifyList = [{
            icon: cxImg,
            name: '赚钱',
            id: 1
        },{
            icon: sqImg,
            name: '省钱',
            id: 1
        },{
            icon: zqImg,
            name: '分享',
            id: 1
        },{
            icon: zqImg,
            name: '学院',
            id: 1
        },{
            icon: cxImg,
            name: '促销',
            id: 1
        },{
            icon: sqImg,
            name: '赚钱',
            id: 1
        },{
            icon: zqImg,
            name: '学院',
            id: 1
        },{
            icon: sqImg,
            name: '学院',
            id: 1
        },{
            icon: cxImg,
            name: '学院',
            id: 1
        },{
            icon: sqImg,
            name: '学院',
            id: 1
        }]
    }
}

const classifyModule = new ClassifyModules()


export class StarShopModule {
    @observable shopList = []

    loadShopList = flow(function * () {
        try {
            const res = yield HomeApi.getSwipers({type: homeType.starShop})
            this.shopList = res.data
        } catch (error) {
            console.log(error)
        }
    })
}
//今日榜单
export class TodayModule {
    @observable todayList = []
    loadTodayList = flow(function * () {
        try {
            const res = yield HomeApi.getTodays({type: homeType.today})
            this.todayList = res.data
            console.log('loadTodayList', res.data)
        } catch (error) {
            console.log(error)
        }
    })
}

//精品推荐
export class RecommendModule {
    @observable recommendList = []
    loadRecommendList = flow(function * () {
        try {
            const res = yield HomeApi.getRecommends({type: homeType.recommend})
            this.recommendList = res.data
        } catch (error) {
            console.log(error)
        }
    })
}

import activity1Img from './res/activity1.png'
import activity2Img from './res/activity2.png'
import activity3Img from './res/activity3.png'
import activity4Img from './res/activity4.png'
import goodsImg from './res/goods.png'

//超值热卖
class ActivityModule {
    @observable activityList = []
    @action loadActivityList = () => {
        this.activityList = [
            {
                banner: activity1Img,
                goods: [
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' }
                ]
            },
            {
                banner: activity2Img,
                goods: [
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' }
                ]
            },
            {
                banner: activity3Img,
                goods: [
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' }
                ]
            },
            {
                banner: activity4Img,
                goods: [
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' },
                    {title: '是离开的肌肤收到了空间飞来峰', img: goodsImg,  money: '232.00' }
                ]
            }
        ]
    }
}

const activityModule = new ActivityModule()

// autorun(function() {
//     console.log(` ${bannerModule.bannerList}  ${bannerModule.bannerList.length} ${classifyModule.classifyList} ${starShopModule.shopList}`)
// })

//首页modules
export class HomeModule {
    @observable homeList = []
    @action loadHomeList = () => {
        this.homeList = [{
            id: 0,
            type: homeType.swiper
        },{
            id: 1,
            type: homeType.classify
        },{
            id: 2,
            type: homeType.subject
        },{
            id: 3,
            type: homeType.today
        },{
            id: 4,
            type: homeType.recommend
        },{
            id: 5,
            type: homeType.activity
        }]
    }
}

export default {
    classifyModule,
    activityModule
}



