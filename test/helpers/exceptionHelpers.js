const PREFIX = "Returned error: VM Exception while processing transaction: ";

async function tryCatch(promise, message) {
    try {        
        await promise;        
    }
    catch (error) {
        if(error.message.indexOf(message) != -1){
            console.log("Test passed: " + message)
            return true;
        }else{
            console.log(error.message)
        }
    }
    console.log("Test fail: " + message)    
    return false;
};

module.exports = {
    onlyOwner              : async function(promise) {return await tryCatch(promise, "caller is not the owner" );},
    checkErrorCode         : async function(promise, error_code) {return await tryCatch(promise, error_code );},
    
    notCurrentOwner        : async function(promise) {return await tryCatch(promise, "#not-current-owner#" );},
    
/*
    catchRevert            : async function(promise) {await tryCatch(promise, "revert"             );},
    catchOutOfGas          : async function(promise) {await tryCatch(promise, "out of gas"         );},
    catchInvalidJump       : async function(promise) {await tryCatch(promise, "invalid JUMP"       );},
    catchInvalidOpcode     : async function(promise) {await tryCatch(promise, "invalid opcode"     );},
    catchStackOverflow     : async function(promise) {await tryCatch(promise, "stack overflow"     );},
    catchStackUnderflow    : async function(promise) {await tryCatch(promise, "stack underflow"    );},
    catchStaticStateChange : async function(promise) {await tryCatch(promise, "static state change");},
    */
};