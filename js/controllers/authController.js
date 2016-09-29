ctrl.controller('AuthCtrl',['$http','$scope','$rootScope','$state','signin','login',
                            function($http,$scope,$rootScope,$state,signin,login){

    //Initialisation
    $scope.user = {};
    $scope.newUser = {};

    //Login
    $scope.login = function(){

    }

    //Signin
    $scope.signin = function(){
        console.log('Client signin');
        console.log($scope.newUser);

        signin.addUser($scope.newUser)
        .then(function addUserSuccess(data){
            Materialize.toast(data.data.msg);
        },function addUserError(response){
            console.log(response.data);
        });
    }
}])
