var indexApp = angular.module('IndexApp', []);

indexApp.controller('IndexController', ['$http', function($http) {

  var self = this;
  self.$http = $http;
  self.home = true;
  self.note = false;

  self.goHome = function() {
    self.home = true;
    self.note = false;
  };

  self.goNote = function() {
    self.home = false;
    self.note = true;
    self.getNotes();
  };

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
