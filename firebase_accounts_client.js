"use strict"

class FirebaseAccounts {
  constructor(options){
    this.ref = null;
    // client only collection to store users
    this.users = new Mongo.Collection(null); 
  }
  userId(){
    const auth = this.connection().getAuth();
    return auth ? auth.uid : null;
  }
  user(){
    const userId = this.userId();
    return this.users.findOne(userId);
  }
  config(options){
    options = options || {};

    const endpoint = options.endpoint;
    
    if (!endpoint){
      throw new Error('Firebase endpoint is required.');
    }

    this.ref = new Firebase._FirebaseRef(endpoint);
    this.ref.onAuth(handleAuthChanged, this);
  }
  logout(){
    this.connection().unauth();  
  }
  login(serviceType, callback){
    this.connection().authWithOAuthPopup(serviceType,
                                  handleOAuthPopup(this, callback));
  }
  connection(){
    if (!this.ref){
      throw new Error('No Firebase endpoint defined.');
    }
    return this.ref;
  }
};

const handleAuthChanged = function(authData){
  if (authData){
    authData._id = authData.uid;
    this.users.insert(authData);
  }
};

const handleOAuthPopup = function(accounts, callback){
  return function(error, authData){
     if (error){
      callback(error);
    } else {
      callback(null, authData);
    }
  }
};

Firebase.Accounts = new FirebaseAccounts;

// register helpers
//
Template.registerHelper('currentUser', function(){
  var user = Firebase.Accounts.user();
  if (user){
    return user[ user.provider ];
  }
});

