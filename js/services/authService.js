serv.factory('signin',['$http',function($http){

    return {

        addUser: function(user){
            console.log('Sending to server... '+user.name+' case');
            return $http.post(serverUrl+'/addUser',user);
        }

    }
}]);

serv.factory('login',['$http',function($http){

    return {

        login : function(user){
            return $http.post(serverUrl+'/login',user);
        }

    }

}]);
