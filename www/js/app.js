// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.capture', {
    url: "/capture",
    views: {
      'menuContent': {
        templateUrl: "templates/capture.html",
        controller: 'CameraController'
      }
    }
  })
    .state('app.categories', {
      url: "/categories",
      views: {
        'menuContent': {
          templateUrl: "templates/categories.html",
          controller: 'CategoriesCtrl'
        }
      }
    })
      .state('app.detail', {
          url: "/detail/:photoId",
          views: {
              'menuContent': {
                  templateUrl: "templates/detail.html",
                  controller: 'DetailCtrl'
              }
          }
      })

  .state('app.single', {
    url: "/categories/:catId",
    views: {
      'menuContent': {
        templateUrl: "templates/categorie.html",
        controller: 'CategorieCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/categories');
});
