const taskApi = {
    taskList: '/order/queryAftermarketOrderList',
}

import ApiUtils from '../../../api/network/ApiUtils';

const TaskApi = ApiUtils(taskApi);

export default TaskApi;
