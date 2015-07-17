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

/**
 * The Chain Wallets API passes three arguments to the callback function instead of the usual two.
 * RxJS bundles these up into an array.
 * This function extracts the first element of the array (the response object).
 */
Rx.Observable.prototype.undoWeirdness = function () {
    return this.flatMap(function (r) {
        if (_.isArray(r)) {
            return Rx.Observable.from(r).first();
        }
        return Rx.Observable.just(r);
    });
}

module.exports = function (chainWallet, w, a) {
    Rx.Observable.fromNodeCallback(chainWallet.getWallet, chainWallet)(w).
        merge(sigint).
        undoWeirdness().
        flatMap(function (wallet) {
            util.log(wallet.label);
            return Rx.Observable.fromNodeCallback(chainWallet.getBuckets, chainWallet)(wallet.wallet_id);
        }).
        undoWeirdness().
        flatMap(function (buckets) {
            return Rx.Observable.from(buckets);
        }).
        flatMap(function (bucket) {
            util.log(util.inspect(bucket));
            if (!a || (bucket.balance == 0)) {
                return Rx.Observable.just(null);
            }

            var amount = bucket.balance
            util.log('Transferring ' + amount + ' bits to ' + a);

            var options = {
                inputs: [{
                    bucket_id        : bucket.bucket_id,
                    amount           : amount,
                    min_confirmations: 0
                }],
                outputs: [{
                    address: a,
                    amount : amount
                }]
            };
            return Rx.Observable.fromNodeCallback(chainWallet.transact, chainWallet)(options);
        }).
        subscribe(observer);
};
