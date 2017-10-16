const express=require('express');
const bodyParser = require('body-parser');
const http=require('http');
const p2p=require('./p2p');
const database=require('./database');
const Port=process.env.PORT||3001;
const websocketPort=6001;

let peersList=[];

const app=express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const server=http.createServer(app);




function initRoutes() {
    require('./routes').initRoutes(app);

}
function initP2PServer(cb) {
    p2p.initP2PServer(server,websocketPort,(err)=>{
        if(err){
            return cb(new Error(err),null);
        }
        else
            return cb(null,null)
    });
}
function connectToPeers() {
    p2p.connectToPeers(peersList);
}

function initHttpServer() {

    server.listen(Port,()=>{
        console.log(`http server started ,listenning on ${Port}`);

        initP2PServer((err)=>{
            if(err)
                throw err;
            else
            {
                database.isBlockchainFilePresent((err)=>{
                    if(err){
                        database.loadGenesisBlock();
                    }
                    else{
                        database.loadBlockchainFromFile((err)=>{
                           
                        })
                    }

                    connectToPeers();

                })

            }
        });
    })
}


initRoutes();
initHttpServer();


/*
process.on('exit',()=>{
    "use strict";
    console.log('process is exiting');

});

function exitHandler(options, err) {
    if(!options.cleanup)
    database.saveBlockchainToFile((err)=>{
        if(err)
            console.log(err)
        else
            console.log('blockchain has been saved');
        if(options.exit)
            process.exit();
    })


}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));*/
