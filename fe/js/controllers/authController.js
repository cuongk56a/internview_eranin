angular.module('myApp').controller('authController', ['$scope', '$http', '$window', '$location','authService','$timeout', function($scope, $http, $window, $location, authService,$timeout) {
    $scope.newUser = {};
    $scope.message = '';
    $scope.countdown = 0;

    // Hàm gửi mã xác thực
    $scope.sendCode = function() {
        if ($scope.credentials.email && $scope.credentials.password) {
            authService.sendCode($scope.credentials.email).then(function(response) {
                $scope.message = 'Mã đã được gửi đến email của bạn.';
                $scope.countdown = 60;
            var countdownFn = function() {
                if ($scope.countdown > 0) {
                    $scope.countdown--;
                    $timeout(countdownFn, 1000);
                } else {
                    $scope.message = 'Thời gian hết hạn để lấy mã.';
                }
            };

            countdownFn();
            }, function(error) {
                $scope.message = 'Gửi mã thất bại!';
            });
        } else {
            $scope.message = 'Vui lòng nhập đầy đủ email và mật khẩu.';
        }
    };

    // Hàm đăng nhập
    $scope.login = function() {
        if ($scope.credentials.code && $scope.credentials.email && $scope.credentials.password) {
            authService.login($scope.credentials).then(function(response) {
                $window.localStorage.setItem('accessToken', response.data.accessToken);
                $window.localStorage.setItem('refreshToken', response.data.refreshToken);
                $window.localStorage.setItem('userId', response.data.userId);
                $location.path('/user-detail');
            }, function(error) {
                $scope.message = 'Đăng nhập thất bại!';
            });
        } else {
            $scope.message = 'Vui lòng nhập thông tin';
        }
    };

    // Hàm đăng ký
    $scope.register = function() {
        if ($scope.newUser.password !== $scope.newUser.confirmPassword) {
            $scope.message = 'Mật khẩu và xác nhận mật khẩu không khớp!';
            return;
        }
        authService.register($scope.newUser).then(function(response) {
            $scope.message = 'Đăng ký thành công!';
            $scope.newUser = {
                fullName: '',
                email: '',
                password: '',
                confirmPassword: ''
            };
        }, function(error) {
            $scope.message = 'Đăng ký thất bại!';
        });
    };
}]);
