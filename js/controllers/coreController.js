//MAIN CONTROLLERS MODULE
//All other controllers must be laid in other files to be called in index.html next to this one
var ctrl = angular.module('Ctrls',['Services']);

ctrl.controller('MainCtrl',['$state','$scope','$rootScope',function($state,$scope,$rootScope){
    console.log('Main Ctrl');

    //Initialisation générale
    $rootScope.logged = false;


    //Changement d'états
    $scope.goTo = function(destination){
        console.log(destination);
        $state.go(destination);
    }

    //Gestion des états
    $rootScope.$on('$stateChangeStart',function(event,toState,fromState,toParams,fromParams){
        console.log('state change: '+fromParams.name +' -> '+toParams.name);
        if(!toState.params.public && !$rootScope.logged){
            event.preventDefault();
            $state.go('landing.main');
            Materialize.toast("You're not connected",3000,'red lighten-2');
        }
    });

}]);
