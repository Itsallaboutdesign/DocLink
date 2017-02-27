ctrl.controller('ChatCtrl',['$http','$scope','$rootScope','core','data',function($http,$scope,$rootScope,core,data){


    $scope.newThread = {
        participants: []
    }

    $scope.newThreadMode = false;
    $scope.discussionMode = false;
    function init(){

        $scope.threads = [];
        if($rootScope.logged){
            data.myThreads($rootScope.currentUser).then(
                function myThreadsSuccess(data){
                    if(typeof data.data != 'string') $scope.threads = data.data;
                    else Materialize.toast(data.data,3000,'red lighten-2');
                }, function myThreadsError(data){
                    console.log(data.data);
                });

            $scope.users = [];
            data.getNames().then(
                function getNamesSuccess(data){
                    if(typeof data.data != 'string') $scope.users = data.data;
                    else Materialize.toast(data.data,3000,'red lighten-2');
                }, function getNamesError(data){
                    console.log(data.data);
                });
        }

    }

    init();

    $scope.toggleUser = function(usr){

    }

    $rootScope.loaded = true;
}]);
