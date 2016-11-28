ctrl.controller('DashboardCtrl',['$http','$scope','$rootScope','$state','core',
                                function($http,$scope,$rootScope,$state,core){
    $state.go('dashboard.home');

    //Initialisation
    init = function(){
        $scope.quotes = core.getQuotes();
        $scope.showingDescription = false;
        $scope.currentDescription = {};
    }

    init();

    //View functions

    $scope.showDescription = function(quote){
        $scope.showingDescription = true;
        $scope.currentDescription = quote;
    }

    $scope.closeDescription = function(){
        $scope.showingDescription = false;
        $scope.currentDescription = {};
    }

}]);
