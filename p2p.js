var WebSocket = require("ws");
const routes=require('./routes');
const database=require('./database');
const async=require('async');
let sockets=[];
const MessageType={'REQUEST_BLOCKCHAIN':0,'RECEIVE_BLOCKCHAIN':1};
function connectToPeers(peersList) {
    peersList.forEach((peer)=>{
        openConnection(peer)

    })
}


function openConnection(peer) {
    var ws = new WebSocket(peer.url);
    ws.on('open', () => {
        console.log(`connected to ${peer.url}`);
        openMessageChannel(ws);
        write(ws,MessageType.REQUEST_BLOCKCHAIN);
    
    }
    );
    ws.on('error', (err) => {
        console.log(`connection failed could not connect to ${peer.url}`)
    });
}

function closeConnection(ws) {
    console.log('connection failed to peer: ' + ws.url);
    sockets.splice(sockets.indexOf(ws), 1);
}
function openMessageChannel(ws) {
    sockets.push(ws);
    ws.on('message',(data)=>{
        let msg={};
        try{
            msg=JSON.parse(data);
        }
        catch(e){
            
        }
        switch (msg.messageType){
            case MessageType.REQUEST_BLOCKCHAIN:
                write(ws,MessageType.RECEIVE_BLOCKCHAIN,loadBlockchainFromPeers());
                break;
            case MessageType.RECEIVE_BLOCKCHAIN:
                console.log(ws)
                console.log('recieve blockchain')
                let json=[];
                try{
                    json=JSON.parse(msg.data);


                }
                catch(e){
                }


                async.eachOfSeries(json,(block,key,cb)=>{
                    console.log(`loading block number ${key}`);
                    database.addBlock(block,(err)=>{
                        err ? cb(err): cb();
                    });

                },(err)=>{
                    if(err)
                        console.log(err);
                    else
                        console.log(`blockchain has been recieved successfully from ${ws.url}`);
                });

                break;


        }
    });

    ws.on('close', () => closeConnection(ws));
    ws.on('error', () => closeConnection(ws));
}

function initP2PServer(server,websocketPort,cb) {
    var server = new WebSocket.Server({port:websocketPort});
    server.on('connection', (ws,req) =>{
        const ip = req.connection.remoteAddress;
        console.log(`new connection recieved from ${ip}`);
        openMessageChannel(ws)
    });
    server.on('error',(err)=>{
        console.log(err)
        setImmediate(cb,new Error(err),null)
    });
    server.on('listening',()=>{
        console.log(`p2p server started on ${websocketPort}`);
        setImmediate(cb,null,null)

    })


}

function loadBlockchainFromPeers() {
    return JSON.stringify(database.getBlockchain());
}

function saveBlockchain() {
    
}
function write(ws,messageType,data) {
    ws.send(JSON.stringify({messageType:messageType,data:data}));
}

module.exports={
    connectToPeers:connectToPeers,
    initP2PServer:initP2PServer
};