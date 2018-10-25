import ApiUtils from './api/network/ApiUtils';
import bridge from './utils/bridge';

const signTestApi = {

    signTest : '/demo/signTest',
    signTestGet:['/demo/signTest',{method:'get'}]

}

 let API =  ApiUtils(signTestApi)

const signTestTool = {

    // beginTest:function() {
    //
    //     API.signTest({}).then((result) => {
    //         bridge.$toast(result.msg)
    //     }).catch(reason => {
    //         bridge.$toast(reason.msg)
    //     });
    //
    // },

    testSignGet:function() {
        API.signTestGet({a:'123'}).then((result) => {
            bridge.$toast(result.msg)
        }).catch(reason => {
            bridge.$toast(reason.msg)
        });
    }
}

export default signTestTool
