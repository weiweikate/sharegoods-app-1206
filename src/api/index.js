import Urls from './Urls';
import ApiUtils from './network/ApiUtils';
import baseUrl from './BaseUrl';

const API = ApiUtils(baseUrl, Urls);

export default API;
