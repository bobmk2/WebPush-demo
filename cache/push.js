var CACHE_NAME = 'messages';
var CACHE_TYPE = 'invisible';
var mutable_counter = 0;

function pushMessage(message) {
  return caches.open(CACHE_NAME).then(function(cache) {
    return cache.match(CACHE_TYPE).then(function(response) {
      return response.json().then(function(notifications) {
        var n = notifications;
        n.push(message);
        return cache.put(
          new Request(CACHE_TYPE),
          new Response(JSON.stringify(n), {
            headers: {
              'content-type': 'application/json'
            }
          })
        ).then(function() {
          return n;
        });
      });
    });
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.all([
        cache.put(new Request(CACHE_TYPE), new Response("[]", {
          headers: {
            'content-type': 'application/json'
          }
        }))]);
    })
  );
});

self.addEventListener('push', function(evt) {
  mutable_counter += 1;
  evt.waitUntil(pushMessage({counter: mutable_counter, message: "You receive push event: " + JSON.stringify(evt)}));
}, false);
