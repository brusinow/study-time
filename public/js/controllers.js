var studyApp = angular.module('StudyCtrls', ['StudyServices', "ngMaterial", "ngRoute", "ui.bootstrap"])


studyApp.controller('HomeCtrl', ['$scope','$stateParams','Stack', 'verifyDeleteStack', 'Auth', function($scope, $stateParams, Stack, verifyDeleteStack, Auth, $mdDialog, $mdMedia){

  $scope.currentUser = Auth.currentUser();
  $scope.Auth = Auth;
 


// This is working!
  Stack.query($scope.user, function success(data) {
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

studyApp.controller('CommunityCtrl', ['$scope','$stateParams', '$http', 'Stack', 'verifyDeleteStack', 'Auth', function($scope, $stateParams, $http, Stack, verifyDeleteStack, Auth, $mdDialog, $mdMedia){

 $http({
      method: 'GET',
      url: '/api/stacks/community/'
    }).then(function success(data) {
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
       console.log("Success! ",data);
       $scope.stack = data.data;
       $scope.cards = data.data.cards;

    }, function error(data) {
      console.log("Nope.")
    });





}])



studyApp.controller('NewStackCtrl', ['$scope', '$location', 'Stack', 'Auth', function($scope, $location, Stack, Auth) {
  $scope.stack = {
    name: '',
    public: ""
  };


  

  $scope.createStack = function() {
    console.log($scope.user);
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
        method: 'POST',
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




studyApp.controller('CardCtrl', ['$scope', '$http','$stateParams', 'Stack','Card', 'Auth', function($scope, $http, $stateParams, Stack, Card, Auth) {
  $scope.cards = []

  $scope.loggedIn = Auth.isLoggedIn();

  $scope.stackId = $stateParams.id;
  console.log($stateParams);

  $http({
      method: 'GET',
      url: '/api/stacks/' + $stateParams.id,
      data: $stateParams.id
    }).then(function success(data) {
       console.log("Success! ",data.data.name);
       $scope.stackName = data.data.name;
       $scope.cards = data.data.cards;
    }, function error(data) {
      console.log("Nope.")
    });


  $scope.delete = function(id, cardIdx) {
    console.log("Card id is: ",id);
    console.log("Index of card is: ",cardIdx)
    var cardId = id;

$http.delete('/api/stacks/'+ $stateParams.id + '/card/' + cardId, {params: {cardId: cardId}
}).then(function success(data) {
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
      $http({
        method: 'POST',
        url: '/api/stacks/' + $stateParams.stackId + '/'+$stateParams.cardId+'/card/edit',
        data: {
          question: $scope.question,
          answer: $scope.answer
        }
      }).then(function success(data) {
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

studyApp.controller('NavCtrl', ['$scope', '$location', 'Auth', function($scope, $location, Auth) {
  
  // if (Auth.isLoggedIn()){
  //   var user = Auth.currentUser();
  //   console.log("user is: ",user);
  //   // $scope.currentUser = user._doc.username;
  //   console.log("made it to my if")
  // };

  $scope.Auth = Auth;
  console.log("Auth: ",$scope.Auth.isLoggedIn());

  
  $scope.logout = function() {
    Auth.removeToken();
    console.log('My token:', Auth.getToken());
  }
}])

studyApp.controller('SignupCtrl', ['$scope', '$http', '$location','Auth', function($scope, $http, $location, Auth) {
  $scope.user = {
    username: '',
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
    username: '',
    email: '',
    password: '',
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




