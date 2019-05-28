import { mediatorAddFunc } from '../../SGMediator';
import homeModalManager from './manager/HomeModalManager'
mediatorAddFunc('RequestNoviceGift',()=>{
    homeModalManager.getGift();
})

