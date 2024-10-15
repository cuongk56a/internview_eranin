angular.module("myApp").controller("UserDetailController", [
  "$scope",
  "$http",
  "$window",
  "authService",
  function ($scope, $http, $window, authService) {
    $scope.user = {};

    function getUserDetails() {
      authService.getUserDetails().then(
        function (response) {
          $scope.user = response.data;
        },
        function (error) {
          $window.localStorage.removeItem("accessToken");
          $window.localStorage.removeItem("refreshToken");
          $location.path("/login");
        }
      );
    }

    $scope.logout = function () {
      $window.localStorage.removeItem("accessToken");
      $window.localStorage.removeItem("refreshToken");
      $location.path("/login");
    };
    getUserDetails();
  },
]);
