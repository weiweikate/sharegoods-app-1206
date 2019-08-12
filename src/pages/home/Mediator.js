import { mediatorAddFunc } from '../../SGMediator';
import homeApi from './api/HomeAPI'
import homeModalManager from './manager/HomeModalManager'
import { homeModule } from './model/Modules';
import { routePush } from '../../navigation/RouterMap';
//请求新手福利接口
mediatorAddFunc('Home_RequestNoviceGift',()=>{
    homeModalManager.getGift();
})
//分享完成，调用接口告诉后台分享完成
mediatorAddFunc('Home_ShareNotify', (p) => {
    homeApi.shareNotify({from: 1, ...p});
})
//用户登记改变调用，
mediatorAddFunc('Home_UserLevelUpdate', (p) => {
    homeModalManager.userLevelUpdate(p);
})

mediatorAddFunc('Home_AdNavigate', (p) => {
    if (p) {
        const router = homeModule.homeNavigate(p.linkType, p.linkTypeCode || p.linkCode);
        alert(router)
        let params = homeModule.paramsNavigate(p);
        routePush(router, { ...params });
    }
});

