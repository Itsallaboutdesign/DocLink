ctrl.controller('DashboardCtrl',['$http','$scope','$rootScope','$state',
                                function($http,$scope,$rootScope,$state){


    $state.go('dashboard.home');
}]);
