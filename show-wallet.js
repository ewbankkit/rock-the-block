//
// Rock the Block.
//

/**
 * Show Chain wallet.
 */

var util = require('util');
var Rx = require('rx');
var _ = require('lodash');

var sigint = Rx.Observable.fromEvent(process, 'SIGINT').flatMap(function (value) {
    return Rx.Observable.throw(new Error('SIGINT'));
});

var observer = {
    onNext     : function(value) {
        util.log('Next: ' + util.inspect(value));
    },
    onError    : function(error) {
        util.log(error);
    },
    onCompleted: function() {
        util.log('Complete');
    },
};

module.exports = function (chainWallet, w) {
    Rx.Observable.fromNodeCallback(chainWallet.getWalletAssetBalance, chainWallet)(w).
        merge(sigint).
        flatMap(function (balances) {
            return Rx.Observable.from(balances);
        }).
        /*
        flatMap(function (balance) {
            return _.has(balance, 'asset_type');
        }).
        */
        subscribe(observer);
};
