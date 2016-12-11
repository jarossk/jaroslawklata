angular.module('booksApp', ['facebook'])

  .config([
    'FacebookProvider',
    function(FacebookProvider) {
     var myAppId = '1128736477201486';
     
     // You can set appId with setApp method
     // FacebookProvider.setAppId('myAppId');
     
     /**
      * After setting appId you need to initialize the module.
      * You can pass the appId on the init method as a shortcut too.
      */
     FacebookProvider.init(myAppId);
     
    }
  ])
  
  .controller('MainController', [
    '$scope',
    '$timeout',
    'Facebook',
    function($scope, $timeout, Facebook) {
      
      // Define user empty data :/
      $scope.user = {};
      
      // Defining user logged status
      $scope.logged = false;
      
      // And some fancy flags to display messages upon user status change
      $scope.byebye = false;
      $scope.salutation = false;
      
      /**
       * Watch for Facebook to be ready.
       * There's also the event that could be used
       */
      $scope.$watch(
        function() {
          return Facebook.isReady();
        },
        function(newVal) {
          if (newVal)
            $scope.facebookReady = true;
        }
      );
      
      var userIsConnected = false;
      
      Facebook.getLoginStatus(function(response) {
        if (response.status == 'connected') {
          userIsConnected = true;
        }
      });
      
      /**
       * IntentLogin
       */
      $scope.IntentLogin = function() {
        if(!userIsConnected) {
          $scope.login();
        }
      };
      
      /**
       * Login
       */
       $scope.login = function() {
         Facebook.login(function(response) {
          if (response.status == 'connected') {
            $scope.logged = true;
            $scope.me();
          }
        
        });
       };
       
       /**
        * me 
        */
        $scope.me = function() {
          Facebook.api('/me', function(response) {
            /**
             * Using $scope.$apply since this happens outside angular framework.
             */
            $scope.$apply(function() {
              $scope.user = response;
            });
            
          });
        };
      
      /**
       * Logout
       */
      $scope.logout = function() {
        Facebook.logout(function() {
          $scope.$apply(function() {
            $scope.user   = {};
            $scope.logged = false;  
          });
        });
      }
      
      /**
       * Taking approach of Events :D
       */
      $scope.$on('Facebook:statusChange', function(ev, data) {
        console.log('Status: ', data);
        if (data.status == 'connected') {
          $scope.$apply(function() {
            $scope.salutation = true;
            $scope.byebye     = false;    
          });
        } else {
          $scope.$apply(function() {
            $scope.salutation = false;
            $scope.byebye     = true;
            
            // Dismiss byebye message after two seconds
            $timeout(function() {
              $scope.byebye = false;
            }, 2000)
          });
        }
        
        
      });
      
      
    }
  ])
  
  /**
   * Just for debugging purposes.
   * Shows objects in a pretty way
   */
  .directive('debug', function() {
		return {
			restrict:	'E',
			scope: {
				expression: '=val'
			},
			template:	'<pre>{{debug(expression)}}</pre>',
			link:	function(scope) {
				// pretty-prints
				scope.debug = function(exp) {
					return angular.toJson(exp, true);
				};
			}
		}
	});

  /*

    <div data-ng-controller="MainController">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-lg-offset-2">
          
          <div class="page-header">
            <h1>Hello angular-facebook! <small><a href="http://www.facebook.com/luiscarlosjayk" target="_blank">by Ciul</a></small> </h1>  
          </div>
          
          <div>
            <div class="alert alert-info" data-ng-show="salutation">Hello, {{user.name}}</div>
            <div class="alert alert-warning" data-ng-show="byebye">Bye bye :'(</div>
          </div>
          
          <button type="button" class="btn btn-primary btn-large" data-ng-show="!logged" data-ng-disabled="!facebookReady" data-ng-click="IntentLogin()">Login with Facebook</button>
          <button type="button" class="btn btn-danger btn-large" data-ng-show="logged" data-ng-disabled="!facebookReady" data-ng-click="logout()">Logout</button>
          
          <div>
            <debug val="user"></debug>
          </div>
          
        </div>
      </div>
    </div>
  </div>


{
  "id": "967448536698113",
  "first_name": "Jarosław",
  "gender": "male",
  "last_name": "Klata",
  "link": "https://www.facebook.com/app_scoped_user_id/967448536698113/",
  "locale": "pl_PL",
  "name": "Jarosław Klata",
  "timezone": 1,
  "updated_time": "2016-08-20T18:53:01+0000",
  "verified": true
}
 /// app.js 


 ar app=angular.module('funwithfb',[]);

  app.controller('MainController',function($scope,Facebook){
    $scope.user=Facebook.getUser(FB);
    console.log($scope.user);
  });
  app.service('Facebook', function($q, $rootScope) {

    // resolving or rejecting a promise from a third-party
    // API such as Facebook must be
    // performed within $apply so that watchers get
    // notified of the change
    resolve = function(errval, retval, deferred) {
      $rootScope.$apply(function() {
        if (errval) {
          deferred.reject(errval);
        } else {
            console.log(retval);
          retval.connected = true;
          console.log(retval);
          deferred.resolve(retval);
        }
      });
    }

    return {
      getUser: function(FB) {
        var deferred = $q.defer();
        FB.getLoginStatus(function(response) {
          if (response.status == 'connected') {
            FB.api('/me', function(response) {
              resolve(null, response, deferred);
            });
          } else if (response.status == 'not_authorized') {
            FB.login(function(response) {
              if (response.authResponse) {
                FB.api('/me', function(response) {
                  resolve(null, response, deferred);
                });
              } else {
                resolve(response.error, null, deferred);
              }
            });
          } 
        });
        promise = deferred.promise;
        promise.connected = false;
        return promise;
      }
    }; 
  });


     <!DOCTYPE html>
      <html ng-app="funwithfb">
      <head> 
        <meta charset="utf-8">
        <title>FB With Angular</title>
        <link rel="stylesheet" href="css/bootstrap.css">
      </head>

      <body ng-controller="MainController">
        <div id="fb-root"></div>
        <div class="ng-cloak" ng-show="user.connected">
          Hello {{user.first_name}}!
        </div>

        <div class="ng-cloak" ng-hide="user.connected">
          One moment please...
        </div>

        <script src="http://connect.facebook.net/en_US/all.js"></script>
        <script type="text/javascript">
          FB.init({
            appId      : '272951952842742',
            xfbml      : true,
            version    : 'v2.0',
          });
        </script>
        <script src="js/angular.min.js"></script>
        <script src="js/app.js"></script>
        </body>
      </html


  */




