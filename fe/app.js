var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'authController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'authController'
        })
        .when('/user-detail', {
            templateUrl: 'views/userDetail.html',
            controller: 'userController'
        })
        .otherwise({
            redirectTo: '/login'
        });
}]);

app.run(['$rootScope', '$location', '$window', function($rootScope, $location, $window) {
    $rootScope.$on('$routeChangeStart', function(event, next) {
        var token = $window.localStorage.getItem("accessToken");

        if (!token && next.templateUrl === 'views/userDetail.html') {
            $location.path('/login');
        }

        if (token && (next.templateUrl === 'views/login.html' || next.templateUrl === 'views/register.html')) {
            $location.path('/user-detail');
        }
    });
}]);
