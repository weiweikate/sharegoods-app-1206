import { observable, computed, autorun, action } from "mobx"

class BannerModules {
    @observable bannerList = []
    @computed get bannerCount() { return this.bannerList.length }

    @action loadbBnnerList = () => {
        this.bannerList = [
            'https://yanxuan.nosdn.127.net/2ac89fb96fe24a2b69cae74a571244cb.jpg?imageView&quality=75&thumbnail=750x0',
            'https://yanxuan.nosdn.127.net/8f283dd0ad76bb48ef9c29a04690816a.jpg?imageView&quality=75&thumbnail=750x0',
            'https://yanxuan.nosdn.127.net/a9e80a3516c99ce550c7b5574973c22f.jpg?imageView&quality=75&thumbnail=750x0',
            'https://yanxuan.nosdn.127.net/11b673687ae33f87168cc7b93250c331.jpg?imageView&quality=75&thumbnail=750x0'
        ]
    }

}

import zqImg from './res/icons/zq.png'
import sqImg from './res/icons/sq.png'
import cxImg from './res/icons/cx.png'

const bannerModule = new BannerModules()

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


import banner1Img from './res/banner1.png'
import avatar1Img from './res/avatar1.png'
import banner2Img from './res/banner2.png'
import avatar2Img from './res/avatar2.png'

class StarShopModule {
    @observable shopList = []

    @action loadShopList = () => {
        this.shopList =  [{
            banner1Img: banner1Img,
            title: '动人的美丽时尚你的生活',
            avatar: avatar1Img,
            name: '赵丽颖',
            level: 'V5',
            member: '32万+',
            income: '200082.98',
            allIncome: '300万元'
        },{
            banner1Img: banner2Img,
            title: '动人的美丽s时尚你的生活',
            avatar: avatar2Img,
            name: '吴磊',
            level: 'V5',
            member: '32万+',
            income: '200082.98',
            allIncome: '300万元'
        }]
    }
}

const starShopModule = new StarShopModule()


import today1Img from './res/today1.png'
import today2Img from './res/today2.png'
import today3Img from './res/today3.png'

//今日榜单
class TodayModule {
    @observable todayList = []

    @action loadTodayList = () => {
        this.todayList = [{
            img: today1Img
        },{
            img: today2Img
        },{
            img: today3Img
        }]
    }
}

const todayModule = new TodayModule()

import recommend1Img from './res/recommend1.png'
import recommend2Img from './res/recommend2.png'
import recommend3Img from './res/recommend3.png'

//精品推荐
class RecommendModule {
    @observable recommendList = []
    @action loadRecommendList = () => {
        this.recommendList = [{
            img: recommend1Img,
            text: 'dkf都说了看风景饿哭了人类客人鄂温克人接'
        },{
            img: recommend2Img,
            text: 'dkf都说了看风景饿哭了人类客人sdafkj 收到了看风景瑟夫鄂温克人接'
        },{
            img: recommend3Img,
            text: 'dkf都说了看风景饿哭了人类客人sdafkj 收到了看风景瑟夫鄂温克人接'
        }]
    }
}

const recommendModule = new RecommendModule()

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

autorun(function() {
    console.log(` ${bannerModule.bannerList}  ${bannerModule.bannerList.length} ${classifyModule.classifyList} ${starShopModule.shopList}`)
})

export default {
    classifyModule,
    bannerModule,
    starShopModule,
    todayModule,
    recommendModule,
    activityModule
}



