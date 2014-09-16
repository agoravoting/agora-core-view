angular.module('home', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('home').config(function($stateProvider) {
    /* Add New States Above */
    
    
    
});

angular.module('home').controller('HomeController', function($scope, $http, $state, $log) {


        $scope.submit = function(form) {
            $http({
                url: 'https://agora.wadobo.dev:1000/api/v1/user/login/',
                method: 'POST',
                data: {
                    'identification': $scope.identification,
                    'password': $scope.password
                }
            })
                    .success(function(data, status, headers, config) {
                        $state.go('panel');
                        if (status === '200') {
//                            $scope.messages = 'Welcome ' + $scope.identification;
//                            $scope.identification = null;
//                            $scope.password = null;
//                            $scope.submitted = false;
                        } else {
                            $scope.messages = 'Oops, we received your request, but there was an error ' + status;
                            $log.error(data);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.messages = 'There was a network error. ' + status;
                        $log.error(data);
                    });

            // Trigger validation flag
            $scope.submitted = true;

            // If form is invalid, return and let AngularJS show validation errors
            if (form.$invalid) {
                return;
            }
        };

});