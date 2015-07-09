//
// Rock the Block.
//

/**
 * Entry point.
 */

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

// Read in configuration.
var publicConfig = require('./config/public.config.json'),
    privateConfig = require('./config/private.config.json');

var chain = new Chain({
    keyId     : privateConfig.chain.api_key_id,
    keySecret : privateConfig.chain.api_key_secret,
    blockChain: publicConfig.chain.blockchain
});

Rx.Observable.fromNodeCallback(chain.getAddress, chain)('17x23dNjXJLzGMev6R63uyRhMWP1VHawKc').
    merge(sigint).
    subscribe(observer);
