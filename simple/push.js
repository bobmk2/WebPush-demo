self.addEventListener('push', function(evt) {
    var title = "WebPush-demo/simple";
    var message = JSON.stringify(evt.data.text());
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

self.addEventListener('pushsubscriptionchange', function() {
    // 何かを実行する。一般的には、XHR や Fetch を通して
    // サーバに新しいサブスクリプションの詳細を送ることで
    // 再サブスクライブする。
    var title = "pushsubscriptionchangeイベントが呼ばれました";
    console.log(title);

    var message = title;
    var icon = "https://nokamoto.github.io/WebPush-demo/icon.png";
    var tag = "";
    self.registration.showNotification(title, {
        body: message,
        icon: icon,
        tag: tag
    });
});
