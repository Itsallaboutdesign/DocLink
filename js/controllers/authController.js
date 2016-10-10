ctrl.controller('AuthCtrl',['$http','$scope','$rootScope','$state','signin','login',
                            function($http,$scope,$rootScope,$state,signin,login){

    //Initialisation
    $scope.user = {};
    $scope.newUser = {
        sex : false
    };
    $scope.currentUser = {}; //Testing purposes variable
    $rootScope.registeredUsers = []; //Testing purposes variable

    //Login
    $scope.login = function(){
        console.log('Client login');
        console.log($rootScope.registeredUsers);
        if($rootScope.registeredUsers.length && $scope.user.email && $scope.user.email !="" && $scope.user.password && $scope.user.password !=""){
            var exists = false;
            for (var i = 0; i < $rootScope.registeredUsers.length; i++) {
                console.log(i);
                if($rootScope.registeredUsers[i].email === $scope.user.email){
                    exists = true;
                    if($rootScope.registeredUsers[i].password === $scope.user.password){
                        $scope.currentUser = $rootScope.registeredUsers[i];
                        Materialize.toast("You are now connected, "+$scope.currentUser.name,3000,'teal');
                    }else Materialize.toast("Wrong password",3000,'red lighten-2');
                    break;
                }
            }
            if(!exists) Materialize.toast("This account doesn't exist.",3000,'red lighten-2');
        }else{
            Materialize.toast("This account doesn't exist.",3000,'red lighten-2');
        }
    }

    //Signin
    $scope.signin = function(){
        console.log('Client signin');
        console.log($scope.newUser);

        //TEST
        $rootScope.registeredUsers.push($scope.newUser);
        console.log($rootScope.registeredUsers);

        signin.addUser($scope.newUser)
        .then(function addUserSuccess(data){
            Materialize.toast(data.data.msg);
        },function addUserError(response){
            console.log(response.data);
        });
    }
}])
