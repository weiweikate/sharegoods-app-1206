import { observable, computed, action } from "mobx"

export class HomeShowModules {
    @observable showList = []
    @computed get showImage() {
        if (this.showList.length > 0) {
            return this.showList[0].imgUrl
        } else {
            return ''
        }
     }
    @action loadShowList = () => {
        this.showList = [
            {
                name: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://is2.mzstatic.com/image/thumb/Purple128/v4/21/a5/41/21a541ae-b7d1-0bba-22b3-0e6a343f2f37/source/512x512bb.jpg'
            },
            {
                name: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://is2.mzstatic.com/image/thumb/Purple128/v4/21/a5/41/21a541ae-b7d1-0bba-22b3-0e6a343f2f37/source/512x512bb.jpg'
            },
            {
                name: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://is2.mzstatic.com/image/thumb/Purple128/v4/21/a5/41/21a541ae-b7d1-0bba-22b3-0e6a343f2f37/source/512x512bb.jpg'
            },
            {
                name: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://is2.mzstatic.com/image/thumb/Purple128/v4/21/a5/41/21a541ae-b7d1-0bba-22b3-0e6a343f2f37/source/512x512bb.jpg'
            }
        ]
    }
}

export class ShowBannerModules {
    @observable bannerList = []
    @computed get bannerCount() {
        return this.bannerList.length
    }
    @action loadBannerList = () => {
        this.bannerList = [
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://imgsrc.baidu.com/imgad/pic/item/34fae6cd7b899e51ec89f83949a7d933c8950d9c.jpg'
            },
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg'
            },
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg'
            }
        ]
    }
}

export class ShowChoiceModules {
    @observable choiceList = []
    @computed get choiceCount() {
        return this.choiceList.length
    }
    @action loadChoiceList = () => {
        this.choiceList = [
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://imgsrc.baidu.com/imgad/pic/item/34fae6cd7b899e51ec89f83949a7d933c8950d9c.jpg',
                number: 1234,
                portrait: 'http://a.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=0179844a868ba61edfbbc02b7404bb3c/64380cd7912397dd11081a845d82b2b7d0a28739.jpg',
                name: '上课了',
                time: '1分钟'
            },
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟'
            },
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟'
            }
        ]
    }
}

export class ShowFindModules {
    @observable findList = []
    @computed get findCount() {
        return this.choiceList.length
    }
    @action loadFindList = () => {
        this.findList = [
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://imgsrc.baidu.com/imgad/pic/item/34fae6cd7b899e51ec89f83949a7d933c8950d9c.jpg',
                number: 1234,
                portrait: 'http://a.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=0179844a868ba61edfbbc02b7404bb3c/64380cd7912397dd11081a845d82b2b7d0a28739.jpg',
                name: '上课了',
                time: '1分钟'
            },
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟'
            },
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟'
            }
        ]
    }
}

export class ShowHotModules {
    @observable hotList = []
    @computed get hotCount() {
        return this.hotList.length
    }
    @action loadHotList = () => {
        this.hotList = [
            {
                id: 1,
                remark: 'IPhone X 9月...',
                imgUrl: 'http://imgsrc.baidu.com/imgad/pic/item/34fae6cd7b899e51ec89f83949a7d933c8950d9c.jpg',
                number: 1234,
                portrait: 'http://a.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=0179844a868ba61edfbbc02b7404bb3c/64380cd7912397dd11081a845d82b2b7d0a28739.jpg',
                name: '上课了',
                time: '1分钟'
            },
            {
                id: 2,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟'
            },
            {
                id: 3,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟'
            }
        ]
    }
}


export class ShowRecommendModules {
    @observable recommendList = []
    @computed get recommendCount() {
        return this.recommendList.length
    }
    @action loadRecommendList = () => {
        return [
            {
                id: 1,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://imgsrc.baidu.com/imgad/pic/item/34fae6cd7b899e51ec89f83949a7d933c8950d9c.jpg',
                number: 1234,
                portrait: 'http://a.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=0179844a868ba61edfbbc02b7404bb3c/64380cd7912397dd11081a845d82b2b7d0a28739.jpg',
                name: '上课了',
                time: '1分钟',
                width: 300,
                height: 300
            },
            {
                id: 2,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟',
                width: 300,
                height: 400
            },
            {
                id: 3,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟',
                width: 400,
                height: 500
            },
            {
                id: 4,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟',
                width: 300,
                height: 400
            }
        ]
    }

    @action getMoreRecommendList = () => {
        let time = new Date().getTime()
        return [
            {
                id: time + 1,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://imgsrc.baidu.com/imgad/pic/item/34fae6cd7b899e51ec89f83949a7d933c8950d9c.jpg',
                number: 1234,
                portrait: 'http://a.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=0179844a868ba61edfbbc02b7404bb3c/64380cd7912397dd11081a845d82b2b7d0a28739.jpg',
                name: '上课了',
                time: '1分钟',
                width: 300,
                height: 300
            },
            {
                id: time + 2,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟',
                width: 300,
                height: 400
            },
            {
                id: time + 3,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟',
                width: 400,
                height: 500
            },
            {
                id: time + 4,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟',
                width: 300,
                height: 400
            }
        ]
    }
}
