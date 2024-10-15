angular.module("myApp").factory("authService", [
  '$http',
  function ($http) {
    this.sendCode = function (email) {
      return $http.get(`http://localhost:3000/api/v1/auth/token/?email=${email}`);
    };

    this.login = function (credentials) {
      return $http.post("http://localhost:3000/api/v1/auth/login", credentials);
    };

    this.register = function (newUser) {
      return $http.post("http://localhost:3000/api/v1/auth/register", newUser);
    };

    this.refreshToken = function () {
        var refreshToken= $window.localStorage.getItem("refreshToken")
      return $http.post("http://localhost:3000/api/v1/auth/token", {
        refreshToken
      });
    };

    this.getUserDetails = function () {
      var token = $window.localStorage.getItem("accessToken");
      var userId = $window.localStorage.getItem("userId");
      return $http.get(`http://localhost:3000/api/v1/user/${userId}`, {
        headers: { Authorization: "Bearer " + token },
      });
    };

    // return service;
  },
]);
