var indexApp = angular.module('IndexApp', []);

indexApp.controller('IndexController', ['$http', function($http) {

  var self = this;
  self.$http = $http;
  self.home_vis = true;
  self.note_vis = false;
  self.login_vis = false;

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
    renderButton(self);
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

var buildOnSuccess = function(ctx) {
  return function (googleUser) {
    ctx.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  };
}

function onFailure(error) {
  console.log(error);
};

function renderButton(ctx) {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': buildOnSuccess(ctx),
    'onfailure': onFailure
  });
};
