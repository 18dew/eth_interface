'use strict'

const calltx = require('./call');
const sendTx = require('./send');

class contract{
    constructor( web3 , json , address  , networkID , w3Type ){
        this.name = json.contractName;
        this.address = address;
        this.networkID = networkID;
        this.json = json;
        this.web3 = web3;
        this.type = w3Type;
        this.callTx = {};
        this.sendTx = {};
        Object.keys(this.json.abi).map(function (i) {
            let fkey = this.json.abi[i];
            console.log(fkey)
            if ( fkey.type === 'function'){
                if ( fkey.stateMutability === 'view' || fkey.stateMutability === 'pure' ){
                    this.callTx[fkey.name] = new calltx( this.web3 , this.json.abi , this.address , this.networkID , fkey , this.type );
                }else if ( fkey.stateMutability === 'nonpayable' || fkey.stateMutability === 'payable' ){
                    this.sendTx[fkey.name] = new sendTx( this.web3 , this.json.abi , this.address , this.networkID , fkey , this.type );
                }
            }else if ( fkey.type === 'event'){

             }
        }.bind(this))
    }
}

module.exports = contract;


/*
var json = require('./test/Governance.json')
var contract = require('./');
var web3 = require('web3');
var address = "0x92fAD20b28379a02CeC2b138Ac0bbFafe02a6689"
var nid = 4;
var c1 = new contract( web3 , json , address , nid ,"metamask")
 */
