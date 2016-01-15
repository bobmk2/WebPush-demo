self.addEventListener('push', function(evt) {
  var title = "WebPush-demo/simple";
  var message = "You receive push event: " + JSON.stringify(evt);
  var icon = "https://nokamoto.github.io/WebPush-demo/icon.png";
  var tag = "";

  evt.waitUntil(self.registration.showNotification(title, {
    body: message,
    icon: icon,
    tag: tag
  }));
}, false);

self.addEventListener('notificationclick', function(evt) {
  evt.notification.close();

  evt.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(evt) {
      var p = location.pathname.split('/');
      p.pop();
      p = location.protocol + '//' + location.hostname + (location.port ? ':'+location.port : '') + p.join('/') + '/';
      for(var i = 0 ; i < evt.length ; i++) {
        var c = evt[i];
        if(((c.url == p) || (c.url == p + 'index.html')) && ('focus' in c))
          return c.focus();
      }
      if(clients.openWindow)
        return clients.openWindow('./');
    })
  );
}, false);
