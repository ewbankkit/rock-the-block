//
// Rock the Block.
//

/**
 * Entry point.
 */

var util = require('util');
var Chain = require('chain-node');
var ChainWallets = require('chain-wallets-node');

// Parse command line.
var program = require('commander');
program.
    version(require('./package.json').version).
    option('-a, --address [bitcoin address]', 'Bitcoin address').
    option('-t, --showtransactions', 'Show transactions').
    option('-w, --wallet [wallet ID]', 'Wallet ID').
    option('-x, --xprv [wallet XPRV]', 'Wallet XPRV').
    parse(process.argv);

// Read in configuration.
var publicConfig = require('./config/public.config.json'),
    privateConfig = require('./config/private.config.json');

var chain = new Chain({
    keyId     : privateConfig.chain.api_key_id,
    keySecret : privateConfig.chain.api_key_secret,
    blockChain: publicConfig.chain.blockchain
});
var chainWallets = new ChainWallets.Client({
    keyId     : privateConfig.chain.api_key_id,
    keySecret : privateConfig.chain.api_key_secret,
    blockChain: publicConfig.chain.blockchain
});

if (program.showtransactions && program.address) {
    // Dodgy:
    // npm start -- --address 3BQhMB9kWQeUMMcdeGi4R6tvYnWJEqYKUm --showtransactions
    // Legit:
    // npm start -- --address 3DsnLVweDR4vp5d31vdCjtwrSGQ1ER5WRc --showtransactions
    require('./show-transactions.js')(chain, program.address);
}
else if (program.wallet) {
    // Dodgy:
    // npm start -- --wallet 2f4aab7f-538a-41c2-8639-3e3916335865 [--xprv ...] [--address ...]
    // Legit:
    // npm start -- --wallet 791639be-8e2c-427a-87a1-8e19dff6f1b8 [--xprv ...]
    if (program.xprv) {
        chainWallets.keyStore.add(new ChainWallets.Xprv(program.xprv, true));
    }
    require('./show-wallet.js')(chainWallets, program.wallet, program.address);
}
else {
    util.log('Nothing to do');
}
