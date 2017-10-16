const Block=require('./blocks').Block;
const calculateHash=require('./calculateHash');
let addBlock=(req,cb)=>{
    "use strict";

    console.log(typeof cb);
    let index=req.body.index;
    let timestamp= Date.now();
    let previousHash=req.body.previousHash;
    let data=req.body.data||'';
    if(!index  || !previousHash){
        setImmediate(cb,new Error('parameter missing',null))
    }
    else{
        setImmediate(cb,null, new Block(index, previousHash, timestamp,data,calculateHash(index,previousHash,timestamp,data)))

    }

};

module.exports=addBlock;