'use strict'

class sendTx{
    constructor( web3 , abi , address , networkID , key , type ){
        this.name = key.name;
        this.web3 = web3;
        this.type = type;
        this.abi = abi;
        this.address = address;
        this.networkID = networkID;
        this.key = key;
    }
    validate( args ){
        return new Promise(async function( resolve, reject ){
            try{
                if( typeof(args) !== 'object') throw "Not an Object";
                if( args.length !== this.key.inputs.length ) throw "Incorrect Input";
                Object.keys(this.key.inputs).map(async function (iObj, index) {
                    if( !validation[iObj.type](args[index]) ) throw "Validation Failure";
                }.bind(this));
                resolve(true)
            }catch (e) {
                reject(e);
            }
        }.bind(this));
    }

    execute( args  ){
        return new Promise(async function( resolve, reject ){
            try{
                let validation = await this.validate( args );
                if (validation !== true ) throw validation;
                let result;
                if( this.type === 'metamask'){

                }else if( this.type === 'web3BrowserPassword'){

                }else if( this.type === 'web3BrowserRaw'){

                }else if( this.type === 'nodejs' ){

                }
                resolve(result);
            }catch (e) {
                reject(e);
            }
        }.bind(this));
    }
}

module.exports = sendTx;

