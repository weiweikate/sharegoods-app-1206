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

autorun(function() {
    console.log(` ${bannerModule.bannerList}  ${bannerModule.bannerList.length} ${classifyModule.classifyList} ${starShopModule.shopList}`)
})

export default {classifyModule, bannerModule, starShopModule}



