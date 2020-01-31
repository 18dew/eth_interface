'use strict'
const bn = require('BN.js');
const ethU = require('ethereumjs-util');

function isBool ( value ){
    if( typeof(value) === "boolean"){
        return true;
    }else{
        return false;
    }
}

function isBytes8 ( value ){
    let v1 = new bn(value);
    let ll = new bn(0x0);
    let ul = new bn(0xffffffffffffffff)
    if( ( v1.gt(ll) && v1.lt(ul) ) && ( value.substr(0,2) ==='0x' ) ){
        return true;
    }else{
        return false;
    }
}

function isBytes32 ( value ){
    let v1 = new bn(value);
    let ll = new bn(0x0);
    let ul = new bn(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff)
    if( ( v1.gt(ll) && v1.lt(ul) ) && ( value.substr(0,2) ==='0x' ) ){
        return true;
    }else{
        return false;
    }
}

function isUint256 ( value ){
    let ll = new bn(0x0);
    let ul = new bn(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff)
    if( bn.isBN(value) && ( value.gt(ll) && value.lt(ul) )){
        return true;
    }else{
        return false;
    }
}

function isUint8 ( value ){
    let ll = new bn(0);
    let ul = new bn(0xffffffff)
    if( bn.isBN(value) && ( value.gt(ll) && value.lt(ul) )){
        return true;
    }else{
        return false;
    }
}

function isString ( value ){
    if( typeof(value) === "string"){
        return true;
    }else{
        return false;
    }
}

function isAddress ( value ){
    if( ethU.isValidAddress(value) ){
        return true;
    }else{
        return false;
    }
}


module.exports = {
    bool : isBool,
    bytes8 : isBytes8,
    bytes32 : isBytes32,
    uint256 : isUint256,
    uint8 : isUint8,
    string : isString,
    address : isAddress
};
