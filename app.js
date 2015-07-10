//
// Rock the Block.
//

/**
 * Entry point.
 */

var util = require('util');
var Chain = require('chain-node');

// Parse command line.
var program = require('commander');
program.
    version(require('./package.json').version).
    option('-a, --address [bitcoin address]', 'Bitcoin address').
    option('-w, --wallet [wallet ID]', 'Wallet ID').
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
    // Dodgy:
    // npm start -- --address 3BQhMB9kWQeUMMcdeGi4R6tvYnWJEqYKUm
    // Legit:
    // npm start -- --address 3DsnLVweDR4vp5d31vdCjtwrSGQ1ER5WRc
    require('./show-transactions.js')(chain, program.address);
}
else if (program.wallet) {
    // Dodgy:
    // npm start -- --wallet 2f4aab7f-538a-41c2-8639-3e3916335865
    // Legit:
    // npm start -- --wallet 791639be-8e2c-427a-87a1-8e19dff6f1b8
    require('./show-wallet.js')(chain, program.address);
}
else {
    util.log('Nothing to do');
}
