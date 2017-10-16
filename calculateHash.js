const crypto = require('crypto');

const calculateHash = (index, previousHash, timestamp, data) => {
    let hash = crypto.createHash('sha256');
    return hash.update(index + previousHash + timestamp + data).digest('hex');
};

module.exports=calculateHash;

