Package.describe({
  summary:'client side authentication using Firebase',
  version:'0.0.1',
  name:'mstn:firebase-accounts'
});

Package.onUse(function(api){
  api.versionsFrom('1.2');

  api.use([
    'mstn:firebase-core',
    'mongo',
    'templating'
  ], 'client');

  api.addFiles([
    'firebase_accounts_client.js'
  ], 'client');

});
