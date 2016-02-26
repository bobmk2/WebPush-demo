/**
 * GCMに対してpayload付きのWeb Pushを投げます。
 * 実行には以下のインストールが必要です。
 * % npm install web-push-encryption
 */
if (process.argv.length < 5) {
    console.log('Usage:');
    console.log('node ' + process.argv[1] + ' [payload] [API key] [endpoint]');
    return;
}

var webpush = require('web-push-encryption');
var payload = process.argv[2];
var apiKey = process.argv[3];
var subscription = process.argv[4];


webpush.setGCMAPIKey(apiKey);
var res = webpush.sendWebPush(payload, JSON.parse(subscription));
res.then(function() {
  console.log(res)
});
