import HttpUtils from '../network/HttpUtils';


export default function ApiUtils(baseUrl, Urls) {
    let result = {}, list = [];

    Object.keys(Urls).forEach(function (name) {
        let value = Urls[name];
        if (typeof value === 'string') {
            list.push({
                name,
                uri: value
            });
        } else if (value.length) {
            list.push({
                name,
                uri: value[0],
                ...value[1]
            });
        }
    });
    list.forEach(function (item) {
        let name = item.name, url = baseUrl + item.uri, method = item.method || 'post';
        result[name] = async function (params) {
            const response = await HttpUtils[method](url, params);

            return response;
        };
    });

    return result;

}

