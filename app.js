//
// Rock the Block.
//

/**
 * Entry point.
 */

// Legit:
// npm start -- --address 3BQhMB9kWQeUMMcdeGi4R6tvYnWJEqYKUm
// Dodgy:
// npm start -- --address 3DsnLVweDR4vp5d31vdCjtwrSGQ1ER5WRc

var util = require('util');
var Rx = require('rx');
var Chain = require('chain-node');

function shutdown() {
    util.log('Shutting down...');
}

var sigint = Rx.Observable.fromEvent(process, 'SIGINT').flatMap(function (value) {
    return Rx.Observable.throw(new Error('SIGINT'));
});

var observer = {
    onNext     : function(value) {
        util.log('Next: ' + util.inspect(value));
    },
    onError    : function(error) {
        util.log(error);
        shutdown();
    },
    onCompleted: function() {
        util.log('Complete');
        shutdown();
    },
};

// Parse command line.
var program = require('commander');
program.
    version(require('./package.json').version).
    option('-a, --address [bitcoin address]', 'Bitcoin address').
    parse(process.argv);
if (!program.address) {
    console.log('No bitcoin address specified');
    process.exit(1);
}

// Read in configuration.
var publicConfig = require('./config/public.config.json'),
    privateConfig = require('./config/private.config.json');

var chain = new Chain({
    keyId     : privateConfig.chain.api_key_id,
    keySecret : privateConfig.chain.api_key_secret,
    blockChain: publicConfig.chain.blockchain
});

Rx.Observable.fromNodeCallback(chain.getAddress, chain)(program.address).
    merge(sigint).
    flatMap(function (addresses) {
        return Rx.Observable.from(addresses).first();
    }).
    flatMap(function (address) {
        var getTransactions,
            getOpReturns;

        util.log('Basic details: ' + util.inspect(address));

        getTransactions = Rx.Observable.fromNodeCallback(chain.getAddressTransactions, chain)(
            address.address,
            {limit: chain.transaction_limit});
        getOpReturns = Rx.Observable.fromNodeCallback(chain.getAddressOpReturns, chain)(address.address);

        return Rx.Observable.merge(getTransactions, getOpReturns);
    }).
    flatMap(function (transactions) {
        return Rx.Observable.from(transactions);
    }).
    /*
    flatMap(function (transaction) {
        return Rx.Observable.from(transaction.inputs);
    }).
    flatMap(function (input) {
        return Rx.Observable.just(input);
    }).*/
    subscribe(observer);
