const fs=require('fs');
const addBlock=require('./addBlock');
const database=require('./database');
let peers=require('./p2p').peers;

function initRoutes(app) {
    app.get('/getBlocks',(req,res)=>{
        return res.send({bc:database.getBlockchain()});

    });


    app.post('/newBlock',(req,res)=>{
        addBlock(req,(err,newBlock)=>{
            if(err){
                return res.status(400).send(err.toString());
            }
            else{
              database.addBlock(newBlock,(err)=>{
                  "use strict";
                  if(err)
                      res.status(400).send(err);
                  else
                      return res.send({bc:database.getBlockchain()});


              });
            }

        });




    });

    app.get('/getPeers',(req,res)=>{
        res.send(peers);
    });


}

function addPeers(app) {
    let hostname=req.hostname;
    let index=req.headers.host.indexOf(':');
    try{
        index=parseInt(index);
    }
    catch (e){
        setImmediate(cb,'hostname is invalid',null);

    }
    let host=req.headers.host.substring(0,index);
    let port=req.headers.host.substring(index+1,req.headers.host.length)
    console.log(host,port);
    peers.push({host:host,port:port})
    setImmediate(cb,null,peers);

}



module.exports={initRoutes:initRoutes};