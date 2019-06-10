/**
 * @author xzm
 * @date 2018/10/16
 * @providesModule CommonUtils
 */

/**
 * @flow
 */
const CommonUtils = {
    /**
     * 深度复制一个对象
     */
    deepClone: function(obj) {
        // Handle the 3 simple types, and null or undefined
        if (obj == null || typeof obj !== 'object')
            {return obj;}

        // Handle Date
        if (obj instanceof Date) {
            let copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            let copy = [];
            for (let i = 0, len = obj.length; i < len; ++i) {
                copy[i] = CommonUtils.deepClone(obj[i]);
            }
            return copy;
        }
        // Handle Object
        if (obj instanceof Object) {
            let copy = {};
            for (let attr in obj) {
                if (obj.hasOwnProperty(attr))
                    {copy[attr] = CommonUtils.deepClone(obj[attr]);}
            }
            return copy;
        }
        return obj;
    },

}

export default  CommonUtils;

