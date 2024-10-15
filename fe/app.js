var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'AuthController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'AuthController'
        })
        .when('/user-detail', {
            templateUrl: 'views/user-detail.html',
            controller: 'UserDetailController'
        })
        .otherwise({
            redirectTo: '/login'
        });
}]);
