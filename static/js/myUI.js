var myUI = angular.module('myUI', ['ngRoute', 'ui.bootstrap']);

myUI.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: 'partials/main.html',
      controller: 'CarouselDemoCtrl'
    })
    .when('/about', {
      templateUrl: 'partials/about.html',
      controller: 'AlertDemoCtrl'
    })
    .when('/contact', {
      templateUrl: 'partials/contacts.html',
      controller: 'contactController'
    });


  // enable html5Mode for pushstate ('#'-less URLs)
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');

  // use the HTML5 History API
  // $locationProvider.html5Mode(
  //		{enabled: true,	requireBase: false}
  //	);

});
/*myUI.config(['$provide', Decorate]);
  
  function Decorate($provide) {
    $provide.decorator('CarouselDemoCtrl', function($delegate) {
      var directive = $delegate[0];
      
      directive.templateUrl = "/template/carousel/carousel.tpl.html";
      
      return $delegate;
    });
  }
//myUI.run(['$templateCache', function($templateCache) {
 // $templateCache.put('template/carousel/carousel.html', undefined);
//}]);
*/
myUI.controller('LinkCtrl', function($scope, $window) {
    $scope.pdf_link = '/cv.pdf' + $window.location.search;
});
// Directive a link not working actual 
 /*   myUI.directive('myAa', function() {
      return {
        restrict: 'E',
        link: function(scope, element, atrrs) {
          element.attr("target", "_self");
        }
      };
    });
*/
myUI.controller('CarouselDemoCtrl', function ($scope) {

  $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  $scope.active = 0;

  var slides = $scope.slides = [];
  var currIndex = 0;

  $scope.addSlide = function () {
    var newWidth = 600 + slides.length + 1;
    slides.push({
      image: '//unsplash.it/' + newWidth + '/300',
      text: ['Nice image', 'Awesome photograph', 'That is so cool', 'I love that'][slides.length % 4],
      id: currIndex++
    });
  };

  $scope.randomize = function () {
    var indexes = generateIndexesArray();
    assignNewIndexesToSlides(indexes);
  };

  for (var i = 0; i < 4; i++) {
    $scope.addSlide();
  }

  // Randomize logic below

  function assignNewIndexesToSlides(indexes) {
    for (var i = 0, l = slides.length; i < l; i++) {
      slides[i].id = indexes.pop();
    }
  }

  function generateIndexesArray() {
    var indexes = [];
    for (var i = 0; i < currIndex; ++i) {
      indexes[i] = i;
    }
    return shuffle(indexes);
  }

  // http://stackoverflow.com/questions/962802#962890
  function shuffle(array) {
    var tmp, current, top = array.length;

    if (top) {
      while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
    }

    return array;
  }
});


myUI.controller('AlertDemoCtrl', function AlertDemoCtrl($scope) {
  $scope.alerts = [
    { type: 'error', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];

  $scope.addAlert = function () {
    $scope.alerts.push({ msg: "Another alert!" });
  };

  $scope.closeAlert = function (index) {
    $scope.alerts.splice(index, 1);
  };
});

myUI.controller('contactController', function($scope) {
  $scope.name = 'Jarosław Klata';
  $scope.tel = '07445484191';
  $scope.emial = 'klata.jarek@gmail.com';
  
});
console.log("from here");
