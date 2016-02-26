window.addEventListener('load', function() {
  document.getElementById('register').addEventListener('click', register, false);
  document.getElementById('push').addEventListener('click', setPush , false);
  navigator.serviceWorker.ready.then(checkPush);
}, false);

function register() {
  navigator.serviceWorker.register('push.js').then(checkNotification);
}

function checkNotification() {
  Notification.requestPermission(function(permission) {
    if(permission !== 'denied')
      document.getElementById('push').disabled = false;
    else
      alert('permission is denied.');
  });
}

var subscription = null;

function checkPush(sw) {
  sw.pushManager.getSubscription().then(setSubscription, resetSubscription);
}

function setSubscription(s) {
  if(!s)
    resetSubscription();
  else {
    document.getElementById('register').disabled = true;
    subscription = s;
    var p = document.getElementById('push');
    p.textContent = 'disable';
    p.disabled = false;
    registerNotification(s);
  }
}

function resetSubscription() {
  document.getElementById('register').disabled = true;
  subscription = null;
  var p = document.getElementById('push');
  p.textContent = 'enable';
  p.disabled = false;
}

function setPush() {
  if(!subscription) {
    if(Notification.permission == 'denied') {
      alert('permission is denied.');
      return;
    }
    navigator.serviceWorker.ready.then(subscribe);
  }
  else
    navigator.serviceWorker.ready.then(unsubscribe);
}

function subscribe(sw) {
  sw.pushManager.subscribe({
    userVisibleOnly: true
  }).then(setSubscription, resetSubscription);
}

function unsubscribe() {
  if(subscription) {
    alert("application server should remove endpoint: " + JSON.stringify(subscription));
    subscription.unsubscribe();
  }
  resetSubscription();
}

function registerNotification(s) {
  var endpoint = s.endpoint;
  if(('subscriptionId' in s) && !s.endpoint.match(s.subscriptionId))
    endpoint += '/' + s.subscriptionId;

  alert("application server should set endpoint: " + JSON.stringify(endpoint));

  var sp= subscription.endpoint.split("/");
  var e = sp[sp.length-1];

  document.getElementById('gcm').textContent = 'curl --header "Authorization: key=AIzaSyByxlZomCBATsCmlHJMFDUVflBnpUeyOAs" --header Content-Type:"application/json" https://android.googleapis.com/gcm/send -d "{\\"registration_ids\\":[\\"' + e + '\\"]}"';
  document.getElementById('gcm_payload').textContent = "node simple/server.js 'YOUR_MESSAGE' 'AIzaSyByxlZomCBATsCmlHJMFDUVflBnpUeyOAs' '" + JSON.stringify(subscription) + "'";
}
