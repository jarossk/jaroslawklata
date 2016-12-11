angular.module('booksApp', ['ngRoute', 'ngResource', 'facebook'])
// .run(function($http, $rootScope) { });
/*
app.config(['$routeProvider', '$locationProvider', function appConfig($routeProvider, $locationProvider)  {
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'book.html',
			controller: 'bookController'
		})
		.when('/boo', {
			templateUrl: 'book1.html',
			controller: 'bookController'
		})
    .when('/contacts', {
      templateUrl: 'contacts.html',
      controller: 'contactController'
    })
		.otherwise({
      redirectTo: '/home'
      }
    );


    // enable html5Mode for pushstate ('#'-less URLs)
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
		
		// use the HTML5 History API
   // $locationProvider.html5Mode(
	//		{enabled: true,	requireBase: false}
	//	);

}]);
// Initialize the application
//app.run(['$location', function AppRun($location) {
 //   debugger; // -->> here i debug the $location object to see what angular see's as URL
//}]);



app.factory('bookService', function($resource) {
	return $resource('/books/:id');
});

app.controller('bookController', function(bookService, $scope) {
	$scope.books = bookService.query();
	$scope.newBook = {title: '', description: ''};

	$scope.post = function() {
	//	$scope.books.push($scope.newBook);
		console.log($scope.books);
		bookService.save($scope.newBook, function() {
			$scope.books = bookService.query();
			$scope.newBook = {title: '', description: ''};
		});
	};
});

.config(function(FacebookProvider) {
	FacebookProvider.init('1128736477201486');
})


*/
.config(['FacebookProvider', function(FacebookProvider) {
  var myAppId = '1128736477201486';
     // You can set appId with setApp method
     // FacebookProvider.setAppId('myAppId');
  FacebookProvider.init(myAppId);
}])

.controller('mainCtrl', [
  '$scope',
  '$timeout',
  'Facebook',
  function ($scope,$timeout, Facebook) {

    // define user empty data :/
    $scope.user = {};

    // defining user logged status
    $scope.logged = false;

          $scope.loginStatus = 'disconnected';

          $scope.facebookIsReady = false;

          $scope.user = null;

          $scope.login = function () {
            Facebook.login(function(response) {
              $scope.loginStatus = response.status;
            });
          };



          $scope.removeAuth = function () {
            Facebook.api({
              method: 'Auth.revokeAuthorization'
            }, function(response) {
              Facebook.getLoginStatus(function(response) {
                $scope.loginStatus = response.status;
              });
            });
          };

					$scope.me = function() {
          Facebook.api('/me', function(response) {
            /**
             * Using $scope.$apply since this happens outside angular framework.
             */
            $scope.$apply(function() {
              $scope.user = response;
							conosle.log($scope.user);
            });
            
          });
        };
      

          $scope.$watch(function() {
              return Facebook.isReady();
            }, function(newVal) {
              if (newVal) {
                $scope.facebookIsReady = true;
              }
            }
          );
        });