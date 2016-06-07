var studyApp = angular.module('StudyCtrls', ['StudyServices'])

studyApp.controller('HomeCtrl', ['$scope', 'Stack', function($scope, Stack){
$scope.stacks = [];

  Stack.query(function success(data) {
    $scope.stacks = data;
  }, function error(data) {
    console.log(data);
  });


    $scope.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete this stack?')
          .textContent('You will lose all of your included cards.')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Please do it!')
          .cancel('Please no!');
    $mdDialog.show(confirm).then(function() {
      $scope.status = 'You decided to get rid of your debt.';
    }, function() {
      $scope.status = 'You decided to keep your debt.';
    });
  };


  $scope.deleteStack = function(id, stacksIdx) {
    Stack.delete({id: id}, function success(data) {
      $scope.stacks.splice(stacksIdx, 1);
    }, function error(data) {
      console.log(data);
    });
  }
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


studyApp.controller('NewStackCtrl', ['$scope', '$location', 'Stack', 'Auth', function($scope, $location, Stack, Auth) {
  $scope.stack = {
    name: ''
  };

  $scope.createStack = function() {
    console.log($scope.stack);
    console.log(Auth.currentUser());
    $scope.stack.user = Auth.currentUser();
    Stack.save($scope.stack, function success(data) {
      console.log("Success! ",data)
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

studyApp.controller('SignupCtrl', ['$scope', '$http', '$location','Auth', function($scope, $http, $location, Auth) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userSignup = function() {
    $http.post('/api/users', $scope.user).then(function success(res) {
      $http.post('/api/auth', $scope.user).then(function success(res) {
      Auth.saveToken(res.data.token);
      console.log('Token:', res.data.token)
      $location.path('/');
    }, function error(){
      console.log(data);
    })
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