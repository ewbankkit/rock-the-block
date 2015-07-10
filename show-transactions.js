//
// Rock the Block.
//

/**
 * Show blockchain transactions.
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

module.exports = function (chain, a) {
    Rx.Observable.fromNodeCallback(chain.getAddress, chain)(a).
        merge(sigint).
        flatMap(function (addresses) {
            return Rx.Observable.from(addresses).first();
        }).
        flatMap(function (address) {
            var getTransactions;

            //util.log('Basic details: ' + util.inspect(address));

            getTransactions = Rx.Observable.fromNodeCallback(chain.getAddressTransactions, chain)(
                address.address,
                {limit: chain.transaction_limit});

            return Rx.Observable.merge(getTransactions);
        }).
        flatMap(function (transactions) {
            return Rx.Observable.from(transactions);
        }).
        flatMap(function (transaction) {
            //util.log('Transaction details: ' + util.inspect(transaction));
            function f(x) {
                return {
                    value  : x.value,
                    address: _.first(x.addresses)
                };
            };

            var t = {
                hash   : transaction.hash,
                amount : transaction.amount,
                fees   : transaction.fees,
                inputs : _.map(transaction.inputs, f),
                outputs: _.map(transaction.outputs, f)
            };
            return Rx.Observable.just(t);
        }).
        subscribe(observer);
};
