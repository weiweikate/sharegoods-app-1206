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