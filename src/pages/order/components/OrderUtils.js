import StringUtils from '../../../utils/StringUtils';
import MineApi from '../../mine/api/MineApi';


async function CancelOrder() {
    let arrs=[];
    await  MineApi.queryDictionaryTypeList({ code: 'QXDD' }).then(res => {
        if (res.code == 10000 && StringUtils.isNoEmpty(res.data)) {
           res.data.map((item,i)=>{
               arrs.push(item.value)
            });
         return arrs;
        }
    }).catch(err => {
        return  [];
        console.log(err);
    });
 }

 export default {
    CancelOrder
 }
