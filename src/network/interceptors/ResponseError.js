export default function configureResponseError(error) {
    let result = {};

    // 这里是返回状态码不为200时候的错误处理
    if (error && error.response) {
        let status = error.response.status;
        switch (status) {
            case 400:
                result.message = '请求错误';
                result.status = status;
                break;

            case 401:
                result.message = '未授权，请登录';
                result.status = status;
                break;

            case 403:
                result.message = '拒绝访问';
                result.status = status;
                break;

            case 404:
                result.message = `method:${error.response.config.method} 请求地址出错: ${error.response.config.url}`;
                result.status = status;
                break;

            case 408:
                result.message = '请求超时';
                result.status = status;
                break;

            case 500:
                result.message = '服务器内部错误';
                result.status = status;
                break;

            case 501:
                result.message = '服务未实现';
                result.status = status;
                break;

            case 502:
                result.message = '网关错误';
                result.status = status;
                break;

            case 503:
                result.message = '服务不可用';
                result.status = status;
                break;

            case 504:
                result.message = '网关超时';
                result.status = status;
                break;

            case 505:
                result.message = 'HTTP版本不受支持';
                result.status = status;
                break;

            default:
        }
    }

    return Promise.reject(result);
}
