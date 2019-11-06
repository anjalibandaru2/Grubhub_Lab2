let checkIfEmpty = (prop)=>{
    if(prop == "" || prop == null || typeof prop === "undefined" || prop === "undefined"){
        return true;
    } else{
        return false;
    }
};
module.exports = {
    checkIfEmpty
}