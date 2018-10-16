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
            }
        ]
    }
}