app.factory('authInterceptor', ['$q', '$window', '$location', function($q, $window, $location) {
  return {
      request: function(config) {
          const accessToken = $window.localStorage.getItem('accessToken');
          if (accessToken) {
              config.headers['Authorization'] = `Bearer ${accessToken}`;
          }
          return config;
      },
      responseError: function(response) {
          if (response.status === 401) {
              const refreshToken = $window.localStorage.getItem('refreshToken');

              return refreshAccessToken(refreshToken).then(newTokenResponse => {
                  $window.localStorage.setItem('accessToken', newTokenResponse.accessToken);

                  response.config.headers['Authorization'] = `Bearer ${newTokenResponse.accessToken}`;
                  return $http(response.config);
              }).catch(error => {
                  $window.localStorage.removeItem('accessToken');
                  $window.localStorage.removeItem('refreshToken');
                  $location.path('/login');
                  return $q.reject(error);
              });
          }
          return $q.reject(response);
      }
  };
}]);

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
}]);
