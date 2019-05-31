import { mediatorAddFunc } from '../../SGMediator';
import homeApi from './api/HomeAPI'
import homeModalManager from './manager/HomeModalManager'
//请求新手福利接口
mediatorAddFunc('Home_RequestNoviceGift',()=>{
    homeModalManager.getGift();
})
//分享完成，调用接口告诉后台分享完成
mediatorAddFunc('Home_ShareNotify', (p) => {
    homeApi.shareNotify({from: 1, ...p});
})

//用户登记改变调用，
mediatorAddFunc('Home_UserLeverUpdate', (p) => {
    homeModalManager.userLevelUpdate(p);
})

