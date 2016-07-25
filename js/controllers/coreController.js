//MAIN CONTROLLERS MODULE
//All other controllers must be laid in other files to be called in index.html next to this one
var ctrl = angular.module('Ctrls',['Services']);

ctrl.controller('MainCtrl',['$state','$scope','$rootScope',function($state,$scope,$rootScope){

    $rootScope.$on('$stateChangeStart',function(event,toState,fromState,toParams,fromParams){
        if(toState.params.name === 'landing'){
            $state.go('landing.main');
        }
    })
}]);
