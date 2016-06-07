var app = angular.module('StudyApp', ['StudyCtrls','ui.router','ngMaterial','ngMessages']);

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
  .state('newStack', {
    url: '/stacks/new',
    templateUrl: 'views/newStack.html',
    controller: 'NewStackCtrl'
  })
  .state('newCard', {
    url: '/card/new',
    templateUrl: 'views/newCard.html',
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
