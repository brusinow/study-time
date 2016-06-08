var studyApp = angular.module('StudyCtrls', ['StudyServices', "ngMaterial", "ngRoute"])


studyApp.controller('HomeCtrl', ['$scope','$stateParams','Stack', 'verifyDeleteStack', 'Auth', function($scope, $stateParams, Stack, verifyDeleteStack, Auth, $mdDialog, $mdMedia){
  $scope.stacks = [];
 
  $scope.user = Auth.currentUser();
  console.log(Auth.currentUser());

  Stack.query($scope.user, function success(data) {
    console.log(data);
    $scope.stacks = data;


  }, function error(data) {
    console.log(data);
  });



  $scope.delete = function(id, stacksIdx) {
      verifyDeleteStack(id).then(function() {
       Stack.delete({id: id}, function success(data) {
      $scope.stacks.splice(stacksIdx, 1);
      }, function error(data) {
      console.log(data);
      });
      });
}

}])

studyApp.controller('CardCtrl', ['$scope', '$stateParams', 'Stack','Card', function($scope, $stateParams, Stack, Card) {
  $scope.stackId = $stateParams.id;
  $scope.cards = [{}]

  Stack.get({id: $stateParams.id}, function success(data) {
    $scope.cards = data.cards;
    console.log($scope.cards);
  }, function error(data) {
    console.log(data);
  });

  $scope.delete = function(id, cardIdx) {
    console.log("Card id is: ",id);
    console.log("Index of card is: ",cardIdx)
  Card.delete({id: id}, function success(data) {
    console.log("data is: ",data);
    $scope.cards.splice(cardIdx, 1);
  }, function error(data) {
    console.log(data);
  });
  }


}])

studyApp.controller('NewCardCtrl', ['$scope', '$location', '$stateParams', 'Stack', 'Auth','$http', function($scope, $location, $stateParams, Stack, Auth, $http) {
  $scope.stack = {
    cards: [{
      question: "",
      answer: ""
    }]
  };
  

  var stackId = $stateParams.id;
  console.log("Stack id is: ",stackId);
  $scope.createCard = function() {
    var newCard = {
      question: $scope.question,
      answer: $scope.answer
    }
    console.log("new card is: ",newCard);
    $http({
      method: 'POST',
      url: '/api/stacks/' + stackId + '/card',
      data: newCard
    }).then(function success(data) {
       console.log("Success! ",data)
      $location.path('/stacks/'+ stackId);
    }, function error(data) {
      console.log("Nope.")
    });

  }
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






.controller('SwitchDemoCtrl', function($scope) {
  $scope.data = {
    cb1: true,
  };
  $scope.message = 'false';
  $scope.onChange = function(cbState) {
    $scope.message = cbState;
  };
});

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