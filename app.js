//
// Rock the Block.
//

/**
 * Entry point.
 */

var util = require('util');
var Rx = require('rx');

function shutdown() {
    util.log('Shutting down...');
}

var sigint = Rx.Observable.fromEvent(process, 'SIGINT').flatMap(function (value) {
    return Rx.Observable.throw(new Error('SIGINT'));
});

var observer = {
    onNext: function(value) {
        util.log('Next: ' + util.inspect(value));
    },
    onError: function(error) {
        util.log(error);
        shutdown();
    },
    onCompleted: function() {
        util.log('Complete');
        shutdown();
    },
};

/*
Rx.Observable.fromEvent(kafkaConsumer, 'message').
    merge(error).
    merge(sigint).
    flatMap(function (message) {
        var bucketId = message.key.toString();
        var bucketLedgerEntry = message.value;
        util.log(bucketId + ': ' + util.inspect(bucketLedgerEntry));

        return Rx.Observable.of(message);
    }).
    subscribe(observer);
*/
