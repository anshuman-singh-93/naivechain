const fs=require('fs');

function saveBlockchain(blockchain,cb) {
    let json=JSON.stringify(blockchain);

    console.log(json)
    fs.writeFile('blockchain.json',json,'utf-8',(err)=>{
        if(err){
            setImmediate(cb,new Error(err),null);

        }else{
            setImmediate(cb,null,null);

        }
    })
}

function loadBlockchainFromFile(cb) {
    fs.readFile('blockchain.json','utf-8',(err,data)=>{
        console.log(data);
        if(err){
            return cb(err,null)
        }
        else{
            let json;
            try {
                json=JSON.parse(data);

            }
            catch (e){
                return cb(e,null)

            }
            return cb(null,json);

        }
    })
}
function isBlockchainFilePresent(cb) {
    fs.access('blockchain.json', fs.F_OK, function(err) {
        if (!err) {
            // Do something
            cb(null,null)
        } else {
            // It isn't accessible
            cb(err,null)

        }
    });
}
module.exports={saveBlockchain:saveBlockchain,
    loadBlockchainFromFile:loadBlockchainFromFile,
    isBlockchainFilePresent:isBlockchainFilePresent
}