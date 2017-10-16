const Block=require('./blocks').Block;
const calculateHash=require('./calculateHash');
const getGenesisBlock = () => {
    let index=0;
    let timestamp= Date.now();
    let previousHash=null;
    let data='my genesis block';
    return new Block(index, previousHash, timestamp,data,calculateHash(index,previousHash,timestamp,data));
};

module.exports=getGenesisBlock;
