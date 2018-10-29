package com.meeruu.commonlib.okhttpcache.interceptor;

import com.meeruu.commonlib.okhttpcache.strategy.CacheNetworkStrategy;
import com.meeruu.commonlib.okhttpcache.strategy.CacheStrategy;
import com.meeruu.commonlib.okhttpcache.strategy.NetworkCacheStrategy;
import com.meeruu.commonlib.okhttpcache.strategy.NetworkStrategy;
import com.meeruu.commonlib.okhttpcache.strategy.RequestStrategy;
import com.meeruu.commonlib.server.RequestManager;
import com.meeruu.commonlib.utils.ParameterUtils;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Response;


/**
 * 缓存数据拦截器
 * Created by louis on 17/3/22.
 */
public class CacheAndCookieInterceptor implements Interceptor {

    @Override
    public Response intercept(Chain chain) throws IOException {
        RequestStrategy requestStrategy = new RequestStrategy();
        String cacheTypeHeader = chain.request().headers().get(RequestManager.REQUEST_CACHE_TYPE_HEAD);
        if (cacheTypeHeader != null) {
            int cacheType = Integer.parseInt(cacheTypeHeader);
            switch (cacheType) {
                case ParameterUtils.ONLY_CACHED:
                    requestStrategy.setBaseRequestStrategy(new CacheStrategy());
                    break;
                case ParameterUtils.ONLY_NETWORK:
                    requestStrategy.setBaseRequestStrategy(new NetworkStrategy());
                    break;
                case ParameterUtils.CACHED_ELSE_NETWORK:
                    requestStrategy.setBaseRequestStrategy(new CacheNetworkStrategy());
                    break;
                case ParameterUtils.NETWORK_ELSE_CACHED:
                    requestStrategy.setBaseRequestStrategy(new NetworkCacheStrategy());
                    break;
                default:
                    break;
            }
        }
        return requestStrategy.request(chain);
    }
}
