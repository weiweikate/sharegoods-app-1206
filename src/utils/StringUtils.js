const isEmpty = (param) => {
    let input = param + "";
    return input === "" || input === "undefined" || input === "null" || input === "[]" || input === " ";
};
export default {
    isEmpty
};
