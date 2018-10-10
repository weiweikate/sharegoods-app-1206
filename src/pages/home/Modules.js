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
    goodsTitle: 'goodsTitle',
    user: 'user'
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

import schoolImg from './res/school.png'
import makemoneyImg from './res/makemoney.png'
import shareImg from './res/share.png'
import signinImg from './res/signin.png'
import spikeImg from './res/spike.png'
import computerImg from './res/computer.png'
import iphoneImg from './res/iphone.png'
import allImg from './res/all.png'
import makeupsImg from './res/makeups.png'
import clothImg from './res/cloth.png'

export class ClassifyModules {
    @observable classifyList = []
    @action loadClassifyList = () => {
        this.classifyList = [{
            icon: makemoneyImg,
            name: '赚钱',
            id: 1,
            route: 'home/search/CategorySearchPage'
        },{
            icon: shareImg,
            name: '分享',
            id: 1,
            route: 'home/search/CategorySearchPage'
        },{
            icon: signinImg,
            name: '签到',
            id: 1,
            route: 'home/search/CategorySearchPage'
        },{
            icon: schoolImg,
            name: '学院',
            id: 1,
            route: 'home/search/CategorySearchPage'
        },{
            icon: spikeImg,
            name: '秒杀',
            id: 1,
            route: 'home/search/CategorySearchPage'
        },{
            icon: iphoneImg,
            name: '手机相册',
            id: 1,
            route: 'home/search/CategorySearchPage'
        },{
            icon: computerImg,
            name: '电脑家电',
            id: 1,
            route: 'home/search/CategorySearchPage'
        },{
            icon: clothImg,
            name: '品质男装',
            id: 1,
            route: 'home/search/CategorySearchPage'
        },{
            icon: makeupsImg,
            name: '美妆个护',
            id: 1,
            route: 'home/search/CategorySearchPage'
        },{
            icon: allImg,
            name: '全部分类',
            id: 1,
            route: 'home/search/CategorySearchPage'
        }]
    }
}

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
            type: homeType.user
        },{
            id: 3,
            type: homeType.ad
        },{
            id: 4,
            type: homeType.today
        },{
            id: 5,
            type: homeType.recommend
        },{
            id: 6,
            type: homeType.subject
        },{
            id: 7,
            type: homeType.goodsTitle
        },{
            id: 8,
            type: homeType.goods
        }]
    }

    @action homeNavigate = (linkType, linkTypeCode) => {
        this.selectedTypeCode = linkTypeCode
        return homeRoute[linkType]
    }
}

export const homeModule = new HomeModule()



