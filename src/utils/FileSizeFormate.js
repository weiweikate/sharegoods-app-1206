const getSizeFromat = function(size) {


    let kiloByte = size / 1024;
    if (kiloByte === 0) {
        return '0KB';
    }

    let megaByte = kiloByte / 1024;

    if (megaByte < 1) {
        return megaByte.toFixed(2) + 'KB';
    }

    let gigaByte = megaByte / 1024;
    if (gigaByte < 1) {
        return gigaByte.toFixed(2) + 'MB';
    }

    let teraBytes = gigaByte / 1024;

    if (teraBytes < 1) {
        return teraBytes.toFixed(2) + 'GB';
    }

    let bigDecimal = teraBytes / 1024;

    if (bigDecimal < 1) {
        return bigDecimal.toFixed(2) + 'TB';
    }
};


export { getSizeFromat };
