const getSizeFromat = function(size) {

    let megaByte = size / 1024;
    if (megaByte === 0) {
        return '0KB';
    }

    if (megaByte < 1 && megaByte > 0) {
        return megaByte.toFixed(2) + 'KB';
    } else if (megaByte < 1000) {
        return megaByte.toFixed(2) + 'KB';
    } else {
        let gigaByte = megaByte / 1024;
        if (gigaByte < 1) {
            return gigaByte.toFixed(2) + 'MB';
        } else if (gigaByte < 1000) {
            return gigaByte.toFixed(2) + 'MB';
        } else {
            let teraBytes = gigaByte / 1024;
            if (teraBytes < 1) {
                return teraBytes.toFixed(2) + 'GB';
            } else if (teraBytes < 1000) {
                return teraBytes.toFixed(2) + 'GB';
            } else {
                let bigDecimal = teraBytes / 1024;
                if (bigDecimal < 1) {
                    return bigDecimal.toFixed(2) + 'TB';
                }
            }
        }
    }
};


export { getSizeFromat };
