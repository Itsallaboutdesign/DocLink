//LANDING PAGE CONTROLLER
ctrl.controller('LandingCtrl',['$state','$rootScope','$scope',function($state,$rootScope,$scope){
    $scope.title = 'Vous êtes bien sur With We Care';
    $state.go('landing.main');
    $scope.goToMain = function(){
        $state.go('landing.main');
    }
    $scope.goToAbout = function(){
        $state.go('landing.about');
    }
    $scope.goTo = function(destination){
        console.log(destination);
        $state.go(destination);
    }
}])
