var checkIfEmpty = (item) => {
    if(item === null || item === "" || typeof item === "undefined" || (  typeof item !== "undefined" && item.length == 0)){
        return true;
    } else{
        return false;
    }
}
module.exports = {
    checkIfEmpty
}