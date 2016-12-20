ctrl.controller('AuthCtrl',['$http','$scope','$rootScope','$state','signin','login',
                            function($http,$scope,$rootScope,$state,signin,login){

    //Initialisation
    $rootScope.currentUser = {
        name : 'Test',
        surname :'Test',
        email : 'test@test.com',
        birthdate : 1476778180000,
        sex: true,
        password: 'test'
    };

    $scope.newUser = {
        sex : false
    };

    if(!$rootScope.logged) $rootScope.currentUser = {}; //Testing purposes variable
    $rootScope.registeredUsers = [{
        name : 'Test',
        surname :'Test',
        email : 'test@test.com',
        birthdate : 1476778180000,
        sex: true,
        password: 'test'
    }]; //Testing purposes variable

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
                        $rootScope.currentUser = $rootScope.registeredUsers[i];
                        $rootScope.logged = true;
                        Materialize.toast("You are now connected, "+$rootScope.currentUser.name,3000,'teal');
                        $('#loginModal').closeModal();
                        $state.go('dashboard');
                    }else Materialize.toast("Wrong password",3000,'red lighten-2');
                    break;
                }
            }
            if(!exists) Materialize.toast("This account doesn't exist.",3000,'red lighten-2');
        }else{
            Materialize.toast("This account doesn't exist.",3000,'red lighten-2');
        }
    }

    $scope.logout = function(){
        if($rootScope.logged){
            $rootScope.logged = false;
            $rootScope.currentUser = {};
            Materialize.toast('You were successfully logged out',3000,'teal');
            $state.go('landing.main');
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
            Materialize.toast(data.data.msg,3000,'teal');
        },function addUserError(response){
            console.log(response.data);
        });
    }
}])
