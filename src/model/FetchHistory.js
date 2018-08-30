/**
 * HTTP请求的历史记录，用于在开发测试阶段记录每一个HTTP请求。便于进行测试
 * @providesModule FetchHistory
 */

import { action, observable } from 'mobx';
import config from '../../config';

class FetchHistory {

    //是否显示调试面板
    @observable
    showDebugPanel = config.showDebugPanel;

    @observable
    history = [];

    // 插入一条记录
    @action
    insertData(fetchProgress){
        if(!this.showDebugPanel || !fetchProgress){return;}
        this.history.unshift(fetchProgress);
    }

    // 移除一条记录
    @action
    removeData(fetchProgress){
        if(!this.showDebugPanel || !fetchProgress){return;}
        const index = this.history.indexOf(fetchProgress);
        if (index > -1) {
            this.history.splice(index, 1);
        }
    }

}

const fetchHistory = new FetchHistory();

export default fetchHistory;
