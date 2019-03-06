const SHA256 = require('crypto-js/sha256');
const Block = require('./Block.js');
const Blockchain = require('./simpleChain.js');
const bc = new Blockchain();
/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        //this.blocks = [];
        //this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
        //this.bc = new Blockchain();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:height", async (req, res) => {
            let height = req.params.height;
            console.log('height = ' + height);
            try {
                let block = await bc.getBlock(height);
                res.status(200).send(block);
            } catch(err) {
                res.status(404).send("Error: Block doesn't exist.");
            }           
        });
    }

    /**                                                                 
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/block", async (req, res) => {
            console.log("here");
            console.log(req.body);
            const data = req.body.data;
            if(data == "" || data == undefined) {
                res.status(400).send("Bad Request: Fill in the body.");
            }
            try {
                let block = new Block(data);
                await bc.addBlock(block);
                let chainHeight = await bc.getBlockHeight();
                let newestBlock = await bc.getBlock(chainHeight);
                res.status(200).send(newestBlock);
            // Most likely not needed if testing has already been done on the BC.  
            // Only here as a precaution but will remove later.
            } catch(err) {
                res.status(500).send("Error: Block couldn't be added.");
            }           
        });
    }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}