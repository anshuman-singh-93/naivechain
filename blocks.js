class Block {
    constructor(index, previousHash, timestamp, data, hash,transactions) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
        this.transactions=transactions||[];

    }
}


module.exports={Block:Block};