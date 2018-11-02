const taskApi = {
    reciveTask: '/user/userJobs/add', //领取任务
    taskList: ['/user/userJobs/queryJobsByUserId',{method:'get'}],//任务列表
    queryTask: ['/user/userJobs/findUserJobsByUserId',{method:'get'}],//查询用户是否有任务
    taskDetail: ['/user/userJobs/findByJobId',{method:'get'}] //查询任务说明
};

import ApiUtils from '../../../api/network/ApiUtils';

const TaskApi = ApiUtils(taskApi);

export default TaskApi;
