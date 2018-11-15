const getSizeFromat = function(size) {


    let kiloByte = size / 1024;
    if (kiloByte < 1) {
        return size + 'Byte';
    }

    let megaByte = kiloByte / 1024;

    if (megaByte < 1) {
        return megaByte + 'KB';
    }

    let gigaByte = megaByte / 1024;
    if (gigaByte < 1) {
        return gigaByte + 'MB';
    }

    let teraBytes = gigaByte / 1024;

    if (teraBytes < 1) {
        return teraBytes + 'GB';
    }

    let bigDecimal = teraBytes / 1024;

    if (bigDecimal < 1) {
        return bigDecimal + 'TB';
    }

};


export { getSizeFromat };
