angular.module('myApp').controller('AuthController', ['$scope', '$http', '$window', '$location', 'authService', function($scope, $http, $window, $location, authService) {
    $scope.newUser = {};
    $scope.message = '';
    $scope.isCodeSent = false;

    // Hàm gửi mã xác thực
    $scope.sendCode = function() {
        if ($scope.credentials.email) {
            authService.sendCode($scope.credentials.email).then(function(response) {
                $scope.isCodeSent = true;
                $scope.message = 'Mã đã được gửi đến email của bạn.';
            }, function(error) {
                $scope.message = 'Gửi mã thất bại!';
            });
        } else {
            $scope.message = 'Vui lòng nhập đầy đủ email và mật khẩu.';
        }
    };

    // Hàm đăng nhập
    $scope.login = function() {
        if ($scope.isCodeSent && $scope.credentials.code) {
            authService.login($scope.credentials).then(function(response) {
                $window.localStorage.setItem('accessToken', response.data.accessToken);
                $window.localStorage.setItem('refreshToken', response.data.refreshToken);
                $window.localStorage.setItem('userId', response.data.id);
                $location.path('/userDetail');
            }, function(error) {
                $scope.message = 'Đăng nhập thất bại!';
            });
        } else {
            $scope.message = 'Vui lòng nhập mã xác thực.';
        }
    };

    // Hàm đăng ký
    $scope.register = function() {
        authService.register($scope.newUser).then(function(response) {
            $scope.message = 'Đăng ký thành công!';
        }, function(error) {
            $scope.message = 'Đăng ký thất bại!';
        });
    };
}]);
