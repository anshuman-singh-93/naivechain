const fileOperations=require('./fileOperations');
const fs=require('fs');
const genesisBlock=require('./gensisblock')();


let blockchain=[];
let peers=[];

function getBlockchain(){
    return blockchain;
}

function getPeers(){
    return peers;
}

function loadGenesisBlock() {
    blockchain.push(genesisBlock);
    console.log('genesis block loaded');
}

function addBlock(newBlock,cb) {
    blockchain.push(newBlock);
    saveBlockchainToFile((err)=>{
        if(err){
            cb(err,null);
        }
        else
            cb(null,null);
    })
    
}

function isBlockchainFilePresent(cb) {
   
    fileOperations.isBlockchainFilePresent((err)=>{
        if(err){
            cb(err,null)
        }
        else 
            cb(null,null)
    })
}

function loadBlockchainFromFile(cb) {
    fileOperations.loadBlockchainFromFile((err,data)=>{
        if(err){
            cb(err,null)
            console.log(err)
        }
        else
        {
            blockchain=data;
            cb(null,blockchain)
        }

    });
}

function saveBlockchainToFile(cb) {
    fileOperations.saveBlockchain(blockchain,(err)=>{
        if(err){
            return cb(err,null)
        }
        else
            return cb(null,null)

    })
}
module.exports={
    loadGenesisBlock:loadGenesisBlock,
    getBlockchain:getBlockchain,
    addBlock:addBlock,
    loadBlockchainFromFile:loadBlockchainFromFile,
    isBlockchainFilePresent:isBlockchainFilePresent,
    saveBlockchainToFile:saveBlockchainToFile
}