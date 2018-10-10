import { observable, computed, action, flow } from "mobx"
import HomeApi from './api/HomeAPI'

export const homeType = {
    swiper: 1,           //轮播
    ad: 2,       //推荐
    subject: 7,         //专题
    starShop: 3,       //明星店铺
    today: 4,             //今日榜单
    recommend: 5,     //精品推荐
    goods: 'goods',
    other: 'other',
    classify: 'classify',
    'goodsTitle': 'goodsTitle'
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

export class AdModules {
    @observable ad = []
    loadAdList = flow(function * () {
        try {
            const res = yield HomeApi.getAd({type: homeType.ad})
            console.log('loadAdList', res.data)
            this.ad = res.data
        } catch (error) {
            console.log(error)
        }
    })
}

import zqImg from './res/icons/zq.png'
import sqImg from './res/icons/sq.png'
import cxImg from './res/icons/cx.png'

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
            const res = yield HomeApi.getStarShop({type: homeType.starShop})
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
//专题
class SubjectModule {
    @observable subjectList = []
    //记载专题
    loadSubjectList = flow(function * () {
        try {
            const res = yield HomeApi.getSubject({type: homeType.subject})
            console.log('loadSubjectList', res.data)
            this.subjectList = res.data
        } catch (error) {
            console.log(error)
        }
    })

    //选择专题
    @action
    selectedSubjectAction = (subject) => {
        this.selectedSubject = {
            subjectCode : subject.linkTypeCode,
            createTime: subject.createTime
        }
    }
}

export const subjectModule = new SubjectModule()


const homeLinkType = {
    good: 1,
    subject: 2,
    down: 3,
    spike: 4,
    package: 5
}

const homeRoute = {
    [homeLinkType.good]: 'home/product/ProductDetailPage',
    [homeLinkType.subject]: 'topic/DownPricePage',
    [homeLinkType.down]: 'topic/DownPricePage',
    [homeLinkType.spike]: 'topic/DownPricePage',
    [homeLinkType.package]: 'topic/DownPricePage',
}

//首页modules
class HomeModule {
    @observable homeList = []
    @observable selectedTypeCode = null
    @action loadHomeList = () => {
        this.homeList = [{
            id: 0,
            type: homeType.swiper
        },{
            id: 1,
            type: homeType.classify
        },{
            id: 2,
            type: homeType.ad
        },{
            id: 3,
            type: homeType.today
        },{
            id: 4,
            type: homeType.recommend
        },{
            id: 5,
            type: homeType.subject
        },{
            id: 6,
            type: homeType.goodsTitle
        },{
            id: 7,
            type: homeType.goods
        }]
    }

    @action homeNavigate = (linkType, linkTypeCode) => {
        this.selectedTypeCode = linkTypeCode
        return homeRoute[linkType]
    }
}

export const homeModule = new HomeModule()

export default {
    classifyModule
}



