//MAIN CONTROLLERS MODULE
//All other controllers must be laid in other files to be called in index.html next to this one
var ctrl = angular.module('Ctrls',['Services']);

ctrl.controller('MainCtrl',['$state','$scope','$rootScope',function($state,$scope,$rootScope){
    console.log('Main Ctrl');

    $rootScope.$on('$stateChangeStart',function(event,toState,fromState,toParams,fromParams){
        console.log('state change: '+fromParams.name +' -> '+toParams.name);

    })
}]);
