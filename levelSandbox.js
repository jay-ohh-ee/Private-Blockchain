/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
  return new Promise((resolve, reject) => {
    db.put(key, value, (err) => {
      if (err) { 
        console.log('Block ' + key + ' submission failed', err);
        reject(err);
      }
      console.log("Successfully added block number " + key);
      console.log("Block Data: " + value);
      resolve("Successfully added block number " + key);
    })
  })
}

// Get data from levelDB with key
function getLevelDBData(key){
  console.log(`key = ${key}`)
  return new Promise((resolve, reject) => {
      db.get(key, function(err, value) {
        if (err) {
          console.log("Block not found");
          reject(err)
        }      
      resolve(value)
    })
  })
}

function getBlocksCount() {
  return new Promise((resolve, reject) => {
      let height = -1;

      db.createReadStream()
      .on('data', function(data) {
        height++;})
      .on('error', (error) => {
        reject(error)})
      .on('close', () => {
        resolve(height)
      })
  })
}

function printChain() {
  return new Promise((resolve, reject) => {
      db.createReadStream()
      .on('data', function(block) {
        console.log(JSON.parse(block))})
      .on('error', (error) => {
        console.log("Error there was a problem with a block.");
    })
  })
}

// Add data to levelDB with value
function addDataToLevelDB(value) {
  return new Promise(function(resolve, reject) {
    let i = 0;
    db.createReadStream().on('data', function(data) {
          i++;
        }).on('error', function(err) {
            reject('Unable to read data stream!');
            console.log('Unable to read data stream!');
        }).on('close', function() {
          console.log('Block #' + i);
          addLevelDBData(i, value);
        });
  })

}


/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

module.exports.addDataToLevelDB = addDataToLevelDB;
module.exports.getBlocksCount = getBlocksCount;
module.exports.getLevelDBData = getLevelDBData;
module.exports.addLevelDBData = addLevelDBData;
module.exports.printChain = printChain;


