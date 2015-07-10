//
// Rock the Block.
//

/**
 * Show Chain wallet.
 */

var util = require('util');
var Rx = require('rx');

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

module.exports = function (chain, w) {
    Rx.Observable.fromNodeCallback(chain.getWallet, chain)(w).
        merge(sigint).
        subscribe(observer);
};
