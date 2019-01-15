export default function configureResponseError(error) {
    let result = {};
    // 这里是返回状态码不为200时候的错误处理
    if (error && error.response) {
        let status = error.response.status;
        switch (status) {
            case 400:
                result.msg = '请求错误';
                result.status = status;
                result.code = -1;
                break;

            case 401:
                result.msg = '未授权，请登录';
                result.status = status;
                result.code = -1;
                break;

            case 403:
                result.msg = '拒绝访问';
                result.status = status;
                result.code = -1;
                break;

            case 404:
                // result.msg = `method:${error.response.config.method} 请求地址出错: ${error.response.config.url}`;
                result.msg = '请求出错';
                result.status = status;
                result.code = -1;
                break;

            case 408:
                result.msg = '请求超时';
                result.status = status;
                result.code = -1;
                break;

            case 500:
                result.msg = '服务器内部错误';
                result.status = status;
                result.code = -1;
                break;

            case 501:
                result.msg = '服务未实现';
                result.status = status;
                result.code = -1;
                break;

            case 502:
                result.msg = '网关错误';
                result.status = status;
                result.code = -1;
                break;

            case 503:
                result.msg = '服务不可用';
                result.status = status;
                result.code = -1;
                break;

            case 504:
                result.msg = '网关超时';
                result.status = status;
                result.code = -1;
                break;

            case 505:
                result.msg = 'HTTP版本不受支持';
                result.status = status;
                result.code = -1;
                break;

            default:
        }
    } else {
        result = {
            msg: '网络连接异常，请检查您的网络连接',
            status: -1,
            code: -1
        };
    }
    error.data = result;
    return Promise.reject(error);
}
