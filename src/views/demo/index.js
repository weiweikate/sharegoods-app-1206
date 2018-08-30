import Demo1 from './Demo1';
import Demo2 from './Demo2';
// 访问路径 'demo/Demo1'
export default {
    moduleName: 'demo',    //模块名称
    childRoutes: {          //模块内部子路由
        Demo1,
        Demo2
    }
}
