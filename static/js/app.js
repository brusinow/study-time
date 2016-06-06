var app = angular.module('StudyApp', ['ui.router', 'StudyCtrls','ngMaterial','ngMessages'])

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .dark();
});

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'views/home.html',
    controller: 'HomeCtrl'
  })
  .state('newCard', {
    url: '/new',
    templateUrl: 'views/newCard.html',
  })
  .state('showEvent', {
    url: '/events/:id',
    templateUrl: 'views/events.html',
    controller: 'EventShowCtrl'
  })

}]);

