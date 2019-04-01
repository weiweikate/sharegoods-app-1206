import { observable, action, computed } from 'mobx';
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtils

const mockData = [
  {
    id: 1,
    time: '14: 00',
    current: true,
    title: '昨日精选'
  },
  {
    id: 2,
    time: '15: 00',
    current: true,
    title: '昨日精选'
  },
  {
    id: 3,
    time: '20: 00',
    current: true,
    title: '昨日精选'
  },
  {
    id: 4,
    time: '24: 00',
    current: true,
    title: '昨日精选'
  },
  {
    id: 5,
    time: '08: 00',
    current: true,
    title: '抢购中'
  },
  {
    id: 6,
    time: '10: 00',
    current: true,
    title: '抢购中'
  },
  {
    id: 7,
    time: '24: 00',
    current: true,
    title: '即将开抢'
  },
  {
    id: 8,
    time: '02: 00',
    current: true,
    title: '即将开抢'
  }
]

const GoodsList = {
  1: [
    {
      title: "BLOOM FOREVER净肤滋养护手霜套装30g*2",
      imgUrl: "https://cdn.sharegoodsmall.com/sharegoods/ec16d70ad2604d90b6cab8afb8a19ef6.jpg",
      price: '56.8'
    },
    {
      title: "BLOOM FOREVER净肤滋养护手霜套装30g*2",
      imgUrl: "https://cdn.sharegoodsmall.com/sharegoods/ec16d70ad2604d90b6cab8afb8a19ef6.jpg",
      price: '56.8'
    },
    {
      title: "BLOOM FOREVER净肤滋养护手霜套装30g*2",
      imgUrl: "https://cdn.sharegoodsmall.com/sharegoods/ec16d70ad2604d90b6cab8afb8a19ef6.jpg",
      price: '56.8'
    },
    {
      title: "BLOOM FOREVER净肤滋养护手霜套装30g*2",
      imgUrl: "https://cdn.sharegoodsmall.com/sharegoods/ec16d70ad2604d90b6cab8afb8a19ef6.jpg",
      price: '56.8'
    },
    {
      title: "BLOOM FOREVER净肤滋养护手霜套装30g*2",
      imgUrl: "https://cdn.sharegoodsmall.com/sharegoods/ec16d70ad2604d90b6cab8afb8a19ef6.jpg",
      price: '56.8'
    }
  ],
  2: [
    {
      title: "BLOOM FOREVER净肤滋养护手霜套装30g*2",
      imgUrl: "https://cdn.sharegoodsmall.com/sharegoods/ec16d70ad2604d90b6cab8afb8a19ef6.jpg",
      price: '56.8'
    }
  ],
  3: [
    {
      title: "BLOOM FOREVER净肤滋养护手霜套装30g*2",
      imgUrl: "https://cdn.sharegoodsmall.com/sharegoods/ec16d70ad2604d90b6cab8afb8a19ef6.jpg",
      price: '56.8'
    }
  ],
  4: [
    {
      title: "BLOOM FOREVER净肤滋养护手霜套装30g*2",
      imgUrl: "https://cdn.sharegoodsmall.com/sharegoods/ec16d70ad2604d90b6cab8afb8a19ef6.jpg",
      price: '56.8'
    },
    {
      title: "BLOOM FOREVER净肤滋养护手霜套装30g*2",
      imgUrl: "https://cdn.sharegoodsmall.com/sharegoods/ec16d70ad2604d90b6cab8afb8a19ef6.jpg",
      price: '56.8'
    }
  ],
  5: [
    {
      title: "BLOOM FOREVER净肤滋养护手霜套装30g*2",
      imgUrl: "https://cdn.sharegoodsmall.com/sharegoods/ec16d70ad2604d90b6cab8afb8a19ef6.jpg",
      price: '56.8'
    }
  ],
  6: [
    {
      title: "BLOOM FOREVER净肤滋养护手霜套装30g*2",
      imgUrl: "https://cdn.sharegoodsmall.com/sharegoods/ec16d70ad2604d90b6cab8afb8a19ef6.jpg",
      price: '56.8'
    }
  ],
  7: [
    {
      title: "BLOOM FOREVER净肤滋养护手霜套装30g*2",
      imgUrl: "https://cdn.sharegoodsmall.com/sharegoods/ec16d70ad2604d90b6cab8afb8a19ef6.jpg",
      price: '56.8'
    }
  ],
  8: [
    {
      title: "BLOOM FOREVER净肤滋养护手霜套装30g*2",
      imgUrl: "https://cdn.sharegoodsmall.com/sharegoods/ec16d70ad2604d90b6cab8afb8a19ef6.jpg",
      price: '56.8'
    }
  ]
}

export class LimitGoModules {
    @observable goodsList = {};
    @observable timeList = [];
    @observable currentGoodsList = [];
    @computed get limitHeight() {
      return px2dp(92) + this.currentGoodsList.length * px2dp(140) + (this.currentGoodsList.length - 1) * px2dp(10)
    }

    @action loadLimitGo() {
      this.timeList = mockData
      this.goodsList = GoodsList
    }

    @action changeLimitGo(id) {
      this.currentGoodsList = this.goodsList[id]
    }
}

export const limitGoModule = new LimitGoModules();
