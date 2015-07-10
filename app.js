//
// Rock the Block.
//

/**
 * Entry point.
 */

// Dodgy:
// npm start -- --address 3BQhMB9kWQeUMMcdeGi4R6tvYnWJEqYKUm
// Legit:
// npm start -- --address 3DsnLVweDR4vp5d31vdCjtwrSGQ1ER5WRc

var util = require('util');
var Chain = require('chain-node');

// Parse command line.
var program = require('commander');
program.
    version(require('./package.json').version).
    option('-a, --address [bitcoin address]', 'Bitcoin address').
    parse(process.argv);

// Read in configuration.
var publicConfig = require('./config/public.config.json'),
    privateConfig = require('./config/private.config.json');

var chain = new Chain({
    keyId     : privateConfig.chain.api_key_id,
    keySecret : privateConfig.chain.api_key_secret,
    blockChain: publicConfig.chain.blockchain
});

if (program.address) {
    require('./show-transactions.js')(chain, program.address);
}
else {
    util.log('Nothing to do');
}
