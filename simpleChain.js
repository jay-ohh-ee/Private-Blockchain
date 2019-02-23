/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
const levelSB = require('./levelSandbox.js');
const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor(){

    this.getBlockHeight()
      .then((height) => {
        if(height === -1) {
          this.addBlock(new Block("First block in the chain - Genesis block"));
        }
      });    
  }

  // Add new block
  async addBlock(newBlock){
    // Block height
    let height = await this.getBlockHeight();
    console.log("height = " + height);
    newBlock.height = height + 1;
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(height > 0) {
      let prevBlock = await this.getBlock(height);
      console.log(prevBlock.height);
      newBlock.previousBlockHash = prevBlock.hash;
      console.log("previous block hash: " + newBlock.previousBlockHash);
    }
    
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    console.log("block hash = " + newBlock.hash);
    // Adding block object to chain
  	await levelSB.addLevelDBData(newBlock.height, newBlock);
  }

  // Get block height
  async getBlockHeight(){
    console.log("here1");
    return await levelSB.getBlocksCount();
  }

  // get block
  async getBlock(blockHeight){
    let tempBlock = await levelSB.getLevelDBData(blockHeight);
    return tempBlock; 

    // return object as a single string
    //return JSON.parse(JSON.stringify(this.chain[blockHeight]));
  }



    //validate block
    async validateBlock(blockHeight){
      // get block object
      let block = await this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          resolve(true);
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          resolve(false);
        }
    }

   //Validate blockchain
    async validateChain(){
      console.log("validating chain");
      let errorLog = [];
      let chainLength = await this.getBlockHeight();
      let validBlock = false;
      let previousHash = "";
      
      for (var i = 0; i <= chainLength; i++) {
        console.log("at place in chain " + i);
        // get block 'i' and figure out if it is valid
        this.getBlock(i).then((block) => {
          validBlock = this.validBlock(block);

          //validate the block
          if(!validBlock) {
            errorLog.push(i);
          }

          // compare block hash with previous block hash, previousHash begins at ""
          // because first block won't will have "" as the previous block hash.
          if(block.previousBlockHash !== previousHash) {
            errorLog.push(i);
          }
          previousHash = block.hash;

          if (errorLog.length>0) {
            console.log('Block errors = ' + errorLog.length);
            console.log('Blocks: '+errorLog);
          } else {
            console.log('No errors detected');
          }
        
        })


      }

    }
}
let bc = new Blockchain();
async function fill() {
  
let blockTest = new Block("Test Block - 1");
bc.addBlock(blockTest);
let blockTest2 = new Block("Test Block - 2");
bc.addBlock(blockTest2);
let blockTest3 = new Block("Test Block - 3");
bc.addBlock(blockTest3);
}

fill();
//let a = bc.getBlockHeight().th;
//console.log("final count = " + a);

//bc.addBlock(new Block('Test data 1'))
//  .then(console.log("success"));
// (function theLoop (i) {
//     setTimeout(function () {
//         let blockTest = new Block("Test Block - " + (i + 1));
//         bc.addBlock(blockTest).then((result) => {
//             i++;
//             if (i < 10) theLoop(i);
//         });
//     }, 1000);
//   })(0);
// async function val() {
//   await bc.validateChain();
// }
// val();
// console.log("here");
