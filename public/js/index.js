var indexApp = angular.module('IndexApp', []);

indexApp.controller('IndexController', ['$timeout', '$http',
function($timeout, $http) {

  var self = this;
  self.$http = $http;
  self.home_vis = true;
  self.note_vis = false;
  self.login_vis = false;

  self.user = {};

  self.goHome = function() {
    hideAll();
    self.home_vis = true;
  };

  self.goNote = function() {
    hideAll();
    self.note_vis = true;
    self.getNotes();
  };

  self.goLogin = function() {
    hideAll();
    self.login_vis = true;
  }

  self.loginCallBack = function() {

    renderButton(function(name) {
      $timeout(function() { self.user.name = name }, 0);
    });
  }

  var hideAll = function() {
    self.home_vis = false;
    self.note_vis = false;
    self.login_vis = false;
  }

  self.log = function(val) {
    console.log(val);
  }

  self.getNotes = function() {
    self.$http
      .get('https://cnyndk9kk5.execute-api.us-east-1.amazonaws.com/latest/note/asdf')
      .then(function(response) {
        self.notes = response.data;
      });
  };

  self.deleteNote = function(note) {
    self.$http
      .delete('https://cnyndk9kk5.execute-api.us-east-1.amazonaws.com/latest/note/asdf', {
        params: { noteId: note.noteId }
      }).then(function(response) {
        self.response = response;
        self.getNotes();
      });
  };

  self.createNote = function() {
    self.$http
      .post('https://cnyndk9kk5.execute-api.us-east-1.amazonaws.com/latest/note/', {
        userId: "asdf",
        message: self.newMessage
      }).then(function(response) {
        self.response = response;
        self.newMessage = "";
        self.getNotes();
      });
  }
}]);

var buildOnSuccess = function(rend) {
  return function (googleUser) {
    var name = googleUser.getBasicProfile().getName();
    console.log('Logged in as: ' + name);

    AWS.config.region = 'us-east-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:955a014f-a703-4c37-8716-26531a558cbd",
        Logins: {
           'accounts.google.com': googleUser.getAuthResponse().id_token
        }
     });

    var cognitoUser = AWS.config.credentials.get(function(err) {
      if (err) {
        console.log(err);
        return;
      };

      var client = new AWS.CognitoSyncManager();
      client.openOrCreateDataset('myDatasetName', function(err, dataset) {

        dataset.put("name", name, function(err, record) {
          if (err) {
            console.log(err);
            return;
          }
          dataset.synchronize({
            onSuccess: function(data, newRecords) {
              console.log(data);
            },
            onFailure: function(err) {
              console.log("error in synchronization");
              console.log(err);
            }
          })
        });
      });

      console.log(AWS.config.credentials);
      var apigClient = apigClientFactory.newClient({
        accessKey: AWS.config.credentials.accessKeyId, //'ACCESS_KEY',
        secretKey: AWS.config.credentials.secretAccessKey, //'SECRET_KEY',
        sessionToken: AWS.config.credentials.sessionToken, // 'SESSION_TOKEN', //OPTIONAL: If you are using temporary credentials you must include the session token
        region: 'us-east-1' // OPTIONAL: The region where the API is deployed, by default this parameter is set to us-east-1
      });

      apigClient.notePost({}, {
        userId: "asdf",
        message: "testing sdk"
      }, {});
      rend(name);
    });
  }
}

function onFailure(error) {
  console.log(error);
};

function renderButton(rend) {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': buildOnSuccess(rend),
    'onfailure': onFailure
  });
};
