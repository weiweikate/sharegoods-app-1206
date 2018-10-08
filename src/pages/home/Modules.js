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


class StarShopModule {
    @observable shopList = []
}

const starShopModule = new StarShopModule()
starShopModule.shopList = [{}]


autorun(function() {
    console.log(` ${bannerModule.bannerList}  ${bannerModule.bannerList.length} ${classifyModule.classifyList} ${starShopModule.shopList}`)
})

export default {classifyModule, bannerModule, starShopModule}



