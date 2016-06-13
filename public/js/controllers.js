var studyApp = angular.module('StudyCtrls', ['StudyServices', "ngMaterial", "ngRoute", "ui.bootstrap",'ngStorage'])


studyApp.controller('HomeCtrl', ['$scope','$sessionStorage','$window','$http','$stateParams','Stack', 'verifyDeleteStack', 'Auth', function($scope, $sessionStorage, $window, $http, $stateParams, Stack, verifyDeleteStack, Auth, $mdDialog, $mdMedia){
  $scope.loading = true;
  $scope.stacks = [];

  $scope.currentUser = Auth.currentUser();
  $scope.Auth = Auth;
 
  // $scope.user = {
  //   username: '',
  //   email: '',
  //   password: '',
  // };

  $scope.user = $sessionStorage.user;

  Stack.query(function success(data) {
    $scope.loading = false;
    $scope.visible = true;
    console.log("This is some data: ",data);
    $scope.stacks = data;
  }, function error(data) {
    console.log(data);
  });

  $scope.delete = function(id, stacksIdx) {
    console.log("id is: ",id);
    console.log("stacksIdx: ",stacksIdx);
    verifyDeleteStack(id).then(function() {
    console.log("made it through confirm");
    Stack.delete({id: id}, function success(data) {
    $scope.stacks.splice(stacksIdx, 1);
    }, function error(data) {
    console.log(data);
    });
    });
  }

}])

studyApp.controller('CommunityCtrl', ['$scope', '$sessionStorage', '$stateParams', '$http', 'Stack', 'verifyDeleteStack', 'Auth', function($scope,$sessionStorage,$stateParams, $http, Stack, verifyDeleteStack, Auth, $mdDialog, $mdMedia){
  $scope.loading = true;


 $http({
      method: 'GET',
      url: '/api/stacks/community/'
    }).then(function success(data) {
      $scope.loading = false;
       console.log("Success! ",data.data);
       $scope.stacks = data.data;
    }, function error(data) {
      console.log("Nope.")
    });





}])


studyApp.controller('CommunityShowCtrl', ['$scope','$stateParams', '$http', 'Stack', 'verifyDeleteStack', 'Auth', function($scope, $stateParams, $http, Stack, verifyDeleteStack, Auth, $mdDialog, $mdMedia){
console.log($stateParams.id);

 $http({
      method: 'GET',
      url: '/api/stacks/community/'+$stateParams.id
    }).then(function success(data) {
       console.log("Success yay!! ",data.data[0]);
       $scope.stack = data.data[0];
       $scope.cards = data.data[0].cards;

    }, function error(data) {
      console.log("Nope.")
    });





}])



studyApp.controller('NewStackCtrl', ['$scope', '$sessionStorage', '$location', 'Stack', 'Auth', function($scope, $sessionStorage, $location, Stack, Auth) {
  


  $scope.stack = {
      userId: $sessionStorage.user.id,
      username: $sessionStorage.user.username,
      name: "",
      public: ""
  };


  

  $scope.createStack = function() {
    console.log("stack coming in: ",$scope.stack);
    Stack.save($scope.stack, function success(data) {
      // console.log("Success! ",data)
      $location.path('/');
    }, function error(data) {
      console.log(data);
    });
  }
}])


studyApp.controller('EditStackCtrl', ['$scope', '$http', '$location', '$stateParams', 'Stack','Card', function($scope, $http, $location, $stateParams, Stack, Card) {
  $scope.message = 'false';
  $scope.onChange = function(cbState) {
    $scope.message = cbState;
  };

  $http({
      method: 'GET',
      url: '/api/stacks/' + $stateParams.id + '/edit',
      data: $stateParams.id
    }).then(function success(data) {
       console.log("Success! ",data.data);
       $scope.stack = data.data;
       console.log(data.data.public);
       $scope.stack.public = data.data.public;
       $scope.cards = data.data.cards;
    }, function error(data) {
      console.log("Nope.")
    });


    $scope.editStack = function() {
      $http({
        method: 'PUT',
        url: '/api/stacks/' + $stateParams.id + '/edit',
        data: $scope.stack
      }).then(function success(data) {
         console.log("Success! ",data)
        $location.path('/');
      }, function error(data) {
        console.log("Nope.")
      });
    }

}])




studyApp.controller('CardCtrl', ['$scope', '$route', '$http','$stateParams', 'Stack','Card', 'Auth', function($scope, $route, $http, $stateParams, Stack, Card, Auth) {
  $scope.randomSort = function(contact) {
    console.log("random sort triggered...");
  return Math.random();
  };


  $scope.loading = true;
  $scope.cards = [];
  $scope.loggedIn = Auth.isLoggedIn();
  $scope.stackId = $stateParams.id;
  console.log($stateParams);
  $http({
      method: 'GET',
      url: '/api/stacks/' + $stateParams.id,
      data: $stateParams.id
    }).then(function success(data) {
       $scope.visible = true;
      $scope.loading = false;
       // console.log("Success! ",data.data.name);
       $scope.stackName = data.data.name;
       $scope.cards = data.data.cards;
    }, function error(data) {
      console.log("Nope.")
    });


  $scope.delete = function(id, cardIdx) {
    console.log("Card id is: ",id);
    console.log("Index of card is: ",cardIdx)
    var cardId = id;
    $http.delete('/api/stacks/'+ $stateParams.id + '/card/' + cardId).then(function success(data) {
         console.log("Success! ",data);
        $scope.cards.splice(cardIdx, 1);
      }, function error(data) {
        console.log("Nope.")
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
      answer: $scope.answer,
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

studyApp.controller('EditCardCtrl', ['$scope', '$http', '$location', '$stateParams', 'Stack','Card', function($scope, $http, $location, $stateParams, Stack, Card) {
 $scope.loading = false;
 console.log($stateParams);


  $http({
      method: 'GET',
      url: '/api/stacks/' + $stateParams.stackId + '/'+$stateParams.cardId+'/card/edit',
      data: $stateParams
    }).then(function success(data) {
       console.log("Success! ",data.data);
       $scope.question = data.data.question;
       $scope.answer = data.data.answer;
    }, function error(data) {
      console.log("Nope.")
    });


    $scope.editCard = function() {
       $scope.loading = true;
      $http({
        method: 'POST',
        url: '/api/stacks/' + $stateParams.stackId + '/'+$stateParams.cardId+'/card/edit',
        data: {
          question: $scope.question,
          answer: $scope.answer
        }
      }).then(function success(data) {
         $scope.loading = false;
         console.log("Success! ",data)
        $location.path('/stacks/'+ $stateParams.stackId);
      }, function error(data) {
        console.log("Nope.")
      });
    }

}])






.controller('SwitchDemoCtrl', function($scope) {
  $scope.stack.public = false
 $scope.message = 'false';
  $scope.onChange = function(cbState) {
    $scope.message = cbState;
  };
});

studyApp.controller('NavCtrl', ['$scope', '$sessionStorage', '$window', '$location', 'Auth', function($scope, $sessionStorage, $window, $location, Auth) {
  $scope.storage = $sessionStorage;
  // console.log($scope.storage.user);
  if (Auth.isLoggedIn()){
    var user = Auth.currentUser();
    // $scope.currentUser = user._doc.username;
  };

  $scope.Auth = Auth;

  
  $scope.logout = function() {
    Auth.removeToken();
    $sessionStorage = '';
    console.log('My token:', Auth.getToken());
  }
}])

studyApp.controller('SignupCtrl', ['$scope', '$sessionStorage', '$http', '$location','Auth', function($scope, $sessionStorage, $http, $location, Auth) {
  $scope.user = {
    username: '',
    email: '',
    password: ''
  };
  $scope.userSignup = function() {
    $http.post('/api/users', $scope.user).then(function success(res) {
      $http.post('/api/auth', $scope.user).then(function success(res) {
      $sessionStorage.user = res.data.user;
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

studyApp.controller('LoginCtrl', ['$scope', '$sessionStorage', '$http', '$location', 'Auth', function($scope, $sessionStorage, $http, $location, Auth) {
  $scope.loading = false;
  $scope.submitted = false;
  $scope.user = {
    username: '',
    email: '',
    password: '',
  };
  $scope.userLogin = function() {
    $scope.loading = true;
    $scope.submitted = true;
    $http.post('/api/auth', $scope.user).then(function success(res) {
      $sessionStorage.user = res.data.user;
      Auth.saveToken(res.data.token);
      console.log('Token:', res.data.token)
      $location.path('/');
    }, function error(res) {
      console.log(data);
    });
  }
}])




