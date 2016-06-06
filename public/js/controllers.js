var studyApp = angular.module('StudyCtrls', ['StudyServices'])

studyApp.controller('HomeCtrl', ['$scope', function($scope){
$scope.stacks = [
  {name: 'stack 1'},
  {name: 'stack 2'},
  {name: 'stack 3'},
  {name: 'stack 4'},
  ];

}])

studyApp.controller('CardCtrl', ['$scope', '$stateParams', 'Stack', function($scope, $stateParams, Stack) {
  $scope.stack = {};
  $scope.cards = [
    {question: "question 1", answer: "answer 1"},
    {question: "question 2", answer: "answer 2"},
    {question: "question 3", answer: "answer 3"},
    {question: "question 4", answer: "answer 4"},
    {question: "question 5", answer: "answer 5"},
    {question: "question 6", answer: "answer 6"}
  ];

  Stack.get({id: $stateParams.id}, function success(data) {
    $scope.stack = data;
  }, function error(data) {
    console.log(data);
  });
}])

studyApp.controller('NewStackCtrl', ['$scope', '$location', 'Stack', function($scope, $location, Stack) {
  $scope.stack = {
    name: ''
  };

  $scope.createStack = function() {
    Stack.save($scope.stack, function success(data) {
      $location.path('/');
    }, function error(data) {
      console.log(data);
    });
  }
}])

studyApp.controller('NavCtrl', ['$scope', 'Auth', function($scope, Auth) {
  $scope.Auth = Auth;
  $scope.logout = function() {
    Auth.removeToken();
    console.log('My token:', Auth.getToken());
  }
}])

studyApp.controller('SignupCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userSignup = function() {
    $http.post('/api/users', $scope.user).then(function success(res) {
      $location.path('/');
    }, function error(res) {
      console.log(data);
    });
  }
}])

studyApp.controller('LoginCtrl', ['$scope', '$http', '$location', 'Auth', function($scope, $http, $location, Auth) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userLogin = function() {
    $http.post('/api/auth', $scope.user).then(function success(res) {
      Auth.saveToken(res.data.token);
      console.log('Token:', res.data.token)
      $location.path('/');
    }, function error(res) {
      console.log(data);
    });
  }
}])