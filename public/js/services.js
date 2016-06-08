angular.module('StudyServices', ['ngResource', 'ngMaterial'])




.factory('Stack', ['$resource', function($resource) {
  return $resource('/api/stacks/:id');
}])

.factory('Card', ['$resource', function($resource) {
  return $resource('/api/stacks/:id/card');
}])


.factory('verifyDeleteStack', function($mdDialog) {
    //Include a reference to the user object we're deleting
    return function(id, stacksIdx) {
      
    //Call the confirm() function to configure the confirmation dialog
    var confirm = $mdDialog.confirm()
        .title('Confirm Your Choice')
        .content('Are you sure you want to delete this stack?')
        .ariaLabel('Delete Stack')
        .ok('Delete Stack')
        .cancel('Cancel');
        return $mdDialog.show(confirm);
    }
})



.factory('Auth', ['$window', function($window) {
  return {
    saveToken: function(token) {
      $window.localStorage['secretstacks-token'] = token;
    },
    getToken: function() {
      return $window.localStorage['secretstacks-token'];
    },
    removeToken: function() {
      $window.localStorage.removeItem('secretstacks-token');
    },
    isLoggedIn: function() {
      var token = this.getToken();
      return token ? true : false;
    },
    currentUser: function() {
      if (this.isLoggedIn()) {
        var token = this.getToken();
        try {
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          return payload;
        } catch(err) {
          return false;
        }
      }
    }
  }
}])

.factory('AuthInterceptor', ['Auth', function(Auth) {
  return {
    request: function(config) {
      var token = Auth.getToken();
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
  }
}]);