/**
 * @flow
 * @type {{isEmpty: EmptyUtils.isEmpty, isEmptyArr: EmptyUtils.isEmptyArr, isEmptyObject: EmptyUtils.isEmptyObject}}
 */
const EmptyUtils = {
    isEmpty: (params: any) => {
        if (
            params === undefined ||
            params === null ||
            params === '' ||
            params === 'null'
        ) {
            return true;
        }

        if (Array.isArray(params)) {
            return EmptyUtils.isEmptyArr(params);
        }  else if (typeof params === 'object') {
            return EmptyUtils.isEmptyObject(params);
        }

        return false;
    },

    isEmptyArr: (arr: Array<any>) => {
        if (arr && arr.length > 0) {
            return false;
        }
        return true;
    },

    isEmptyObject: (obj: Object) => {
        for (let name in obj) {
            return false;
        }
        return true;
    }
}

export default  EmptyUtils;
