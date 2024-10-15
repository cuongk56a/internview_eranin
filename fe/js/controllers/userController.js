angular.module("myApp").controller("userController", [
  "$scope",
  "$http",
  "$window",
  "$location",
  "authService",
  function ($scope, $http, $window,$location, authService) {
    $scope.user = {};

    function getUserDetails() {
      authService.getUserDetails().then(
        function (response) {
          $scope.user = response.data;
        },
        function (error) {
          $window.localStorage.removeItem("accessToken");
          $window.localStorage.removeItem("refreshToken");
          $window.localStorage.removeItem("userId");
          $location.path("/login");
        }
      );
    }

    getUserDetails();

    $scope.logout = function () {
      $window.localStorage.removeItem("accessToken");
      $window.localStorage.removeItem("refreshToken");
      $window.localStorage.removeItem("userId");
      $location.path("/login");
    };
  },
]);
