'use strict'

class event{
    constructor( web3 , key ,type ){
        this.web3 = web3;
        this.type = type;
        this.key = key;
        this.name = key.name;
    }
}

module.exports = event;
