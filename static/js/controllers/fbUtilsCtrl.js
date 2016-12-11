(function(){
    'use strict';

angular.module('myApp', ['ngFacebook', 'ngRoute'])

  .constant('facebookConfigSettings', {
    'routingEnabled' : true,
    'channelFile'    : 'channel.html',
    'appID'          : '1128736477201486'
  })
  .config(function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl : 'partials/main.html',
      controller  : angular.noop
    })
    .when('/private', {
      templateUrl : 'partials/private.html',
      controller  : angular.noop,
      needAuth    : true
    })
    .otherwise({
      redirectTo  : '/'
    });
  })

  .config(['$facebookProvider', function($facebookProvider) {
  $facebookProvider.setAppId('1128736477201486').setPermissions(['email', 'user_friends']);
  }])

  .run(['$rootScope', '$window', function($rootScope, $window) {
        (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    $rootScope.$on('fb.load', function() {
      $window.dispatchEvent(new Event('fb.load'));
    });
  }])

 

  .controller('myCtrl', ['$scope', "$facebook" , function($scope, $facebook) {
    
     var user = {};
     var friends = {};

    $scope.$on('fb.auth.authResponseChange', function() {

      $scope.status = $facebook.isConnected();

       console.log($scope.status);
      if($scope.status) {
        $facebook.api('/me', {fields: ['last_name', 'first_name']}).then(function(response) {
          $scope.user = response;
          console.log(response.last_name);
          console.log(JSON.stringify(response));
        });
      }
    });

    $scope.loginToggle = function() {
      if($scope.status) {
        $facebook.logout();
      } else {
        $facebook.login();
      }
    };

    $scope.getFriends = function() {
      if($scope.status) return;
      $facebook.api('/me/friends', {fields: ['user_friends']}).then(function(response) {
        $scope.$apply(function() {
          $scope.friends = response.data; 
          console.log($scope.friends);
        });
      });
    }

  }]);



  }());