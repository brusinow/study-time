var app = angular.module('StudyApp', ['StudyCtrls','ui.router','ngMaterial','ngMessages','ui.bootstrap']);

function NavBarCtrl($scope) {
    $scope.isCollapsed = true;
}

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise('/404');

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'views/home.html',
    controller: 'HomeCtrl'
  })
  .state('community', {
    url: '/stacks/community',
    templateUrl: 'views/community.html',
    controller: 'CommunityCtrl'
  })
  .state('communityShow', {
  url: '/stacks/community/:id',
  templateUrl: 'views/communityShow.html',
  controller: 'CommunityShowCtrl'
  })
  .state('newStack', {
    url: '/stacks/new',
    templateUrl: 'views/newStack.html',
    controller: 'NewStackCtrl'
  })
   .state('editStack', {
    url: '/stacks/:id/edit',
    templateUrl: 'views/editStack.html',
    controller: 'EditStackCtrl'
  })
  .state('newCard', {
    url: '/stacks/:id/card',
    templateUrl: 'views/newCard.html',
    controller: 'NewCardCtrl'
  })
  .state('editCard', {
    url: '/stacks/:stackId/:cardId/card/edit',
    templateUrl: 'views/editCard.html',
    controller: 'EditCardCtrl'
  })
  .state('stackShow', {
    url: '/stacks/:id',
    templateUrl: 'views/cards.html',
    controller: 'CardCtrl'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'views/userSignup.html',
    controller: 'SignupCtrl'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'views/userLogin.html',
    controller: 'LoginCtrl'
  })
  .state('404', {
    url: '/404',
    templateUrl: 'views/404.html'
  });

  $locationProvider.html5Mode(true);
}])

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}])

