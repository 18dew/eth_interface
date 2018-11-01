'use strict'

const web3                = require('web3');
const keyEth              = require('keythereum');
const ethTx               = require('ethereumjs-tx')
const assert              = require('assert');
const fs                  = require('fs');

const wallet = process.env.wallet
const password = process.env.password

/**
 * A Web3 Interface Class.
 * @class WEb3interface
 */
class web3Interface{
  constructor(opts){
    this.provider = process.env.provider || opts.provider ||'https://localhost:8545';
    this.networkID = process.env.networkID || opts.networkID || 4 ;
    this.Web3 = new web3(new web3.providers.HttpProvider(this.provider));
    this.ContractPath = "./build/contracts/" || opts.contractPath || process.env.contractPath;
    this.contract = {};
    this.w3Contract = {};
    this.contractName = fs.readdirSync(this.ContractPath);
    var self = this;
    self.contractName.map(function(cN) {
      self.contract[cN.split('.')[0]] = require(self.ContractPath + cN);
      delete self.contract[cN.split(".")[0]].source;
      delete self.contract[cN.split(".")[0]].sourcePath;
      self.w3Contract[cN.split(".")[0]] = new self.Web3.eth.Contract(self.contract[cN.split(".")[0]].abi,self.contract[cN.split(".")[0]].networks[self.networkID].address);
    });
  }

  /**
   * Generates a raw Data required for interfacing with any contracts
   * @param {string} Contract              - Contract where method is to be called
   * @param {string} Method                - Method called for the specific contract
   * @param {array} Arguments              - Array of arguments required by the address
   * @returns {string} getDataString       - RLP formated and string for getData
   */
  getData(contract,method,args){
    var self = this;
    return new Promise(async function(resolve, reject) {
      try{
        assert.equal(typeof(self.w3Contract[contract]),'object',"Invalid Contract name")
        assert.equal(typeof(self.w3Contract[contract].methods[method]),'function',"Invalid Contract Method")
        assert.equal(Array.isArray(args),true,"Invalid argument type")
        self.contract[contract].abi.map(function(abiObj) {
          if(abiObj.name == method){
            if(abiObj.inputs.length == 0){
              resolve(self.w3Contract[contract].methods[method]().encodeABI())
            }else{
              resolve(self.w3Contract[contract].methods[method].apply(null,args).encodeABI())
            }
          }
        })
      }catch (err){
        reject(err)
      }
    });
  }

  /**
   * Generates a call request to the ethNetwork and returns the state value from the network
   * @param {string} Contract              - Contract where method is to be called
   * @param {string} Method                - Method called for the specific contract
   * @param {array} Arguments              - Array of arguments required by the address
   * @returns {Object} state               - State from the network of the request
   */
  callData(contract,method,args){
    var self = this;
    return new Promise(async function(resolve, reject) {
      try{
        assert.equal(typeof(self.w3Contract[contract]),'object',"Invalid Contract name")
        assert.equal(typeof(self.w3Contract[contract].methods[method]),'function',"Invalid Contract Method")
        assert.equal(Array.isArray(args),true,"Invalid argument type")
        self.contract[contract].abi.map(function(abiObj) {
          if(abiObj.name == method){
            if(abiObj.inputs.length == 0){
              resolve(self.w3Contract[contract].methods[method]().call())
            }else{
              resolve(self.w3Contract[contract].methods[method].apply(null,args).call())
            }
          }
        })
      }catch(err){
        reject(err);
      }
    });
  }

  /**
   * Estimategas for the request.
   * @param {string} Contract              - Contract where method is to be called
   * @param {string} Method                - Method called for the specific contract
   * @param {array} Arguments              - Array of arguments required by the address
   * @returns {Number} gas                 - Gas Value for executing the transaction on the network
   */
  estimateGas(contract,method,args){
    var self = this;
    return new Promise(async function(resolve, reject) {
      try{
        assert.equal(typeof(self.w3Contract[contract]),'object',"Invalid Contract name")
        assert.equal(typeof(self.w3Contract[contract].methods[method]),'function',"Invalid Contract Method")
        assert.equal(Array.isArray(args),true,"Invalid argument type")
        self.contract[contract].abi.map(function(abiObj) {
          if(abiObj.name == method){
            if(abiObj.inputs.length == 0){
              resolve(self.w3Contract[contract].methods[method]().estimateGas())
            }else{
              resolve(self.w3Contract[contract].methods[method].apply(null,args).estimateGas())
            }
          }
        })
      }catch(err){
        reject(err);
      }
    });
  }

  /**
   * Fetches the nonce of the address.
   * @param {String} Address               - Address of the wallet
   * @returns {Number} nonce               - Nonce for the address
   */
  fetchNonce( address ){
    return this.Web3.eth.getTransactionCount(address);
  }

  /**
   * Generates an unsigned tx from the required address
   * @param {string} Contract              - Contract where method is to be called
   * @param {string} Method                - Method called for the specific contract
   * @param {array} Arguments              - Array of arguments required by the address
   * @returns {String} RawTx               - Raw unsigned Tx
   */
  genTx(contract,method,args){
    var self = this;
    return new Promise(async function(resolve, reject) {
      try{
        assert.equal(typeof(self.w3Contract[contract]),'object',"Invalid Contract name")
        assert.equal(typeof(self.w3Contract[contract].methods[method]),'function',"Invalid Contract Method")
        assert.equal(Array.isArray(args),true,"Invalid argument type")
        let sender = JSON.parse(wallet).address;
        let estimateGas = await self.estimateGas(contract,method,args);
        let nonce = await self.fetchNonce(sender);
        let callData = await self.getData(contract,method,args);
        let txParams = {
          nonce: self.Web3.utils.toHex(nonce),
          gasPrice: self.Web3.utils.toHex(0),
          gasLimit: self.Web3.utils.toHex(80424755200),
          gas: self.Web3.utils.toHex(estimateGas),
          to: self.contract[contract].networks[self.networkID].address,
          value: self.Web3.utils.toHex(0),
          data: callData,
          chainId: self.Web3.utils.toHex(self.networkID)
        }
        resolve(new ethTx(txParams));

      }catch(err){
        reject(err);
      }
    });
  }

  /**
   * Signes and Send the request on to the network
   * @param {string} Contract              - Contract where method is to be called
   * @param {string} Method                - Method called for the specific contract
   * @param {array} Arguments              - Array of arguments required by the address
   * @returns {String} Tx-Receipt          - Tx Receipt.
   */
  signTx(contract,method,args){
    var self = this;
    return new Promise(async function(resolve, reject) {
      try{
        let txBase = await self.genTx(contract,method,args);
        let acnt = self.Web3.eth.accounts.decrypt(wallet,password);
        txBase.sign(new Buffer(acnt.privateKey.substr(2,acnt.privateKey.length),"hex"));
        let sTx = txBase.serialize();
        let res = await self.Web3.eth.sendSignedTransaction('0x' + sTx.toString('hex') );
        resolve(res);
      }catch(err){
        reject(err);
      }
    });
  }

}

module.exports = web3Interface;
