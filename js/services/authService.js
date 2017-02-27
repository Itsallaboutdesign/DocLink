serv.factory('signin',['$http',function($http){

    return {

        addUser: function(user){
            console.log('Sending to server... '+user.name+' case');
            return $http.post(serverUrl+'/addUser',user);
        },
        getAllUsers : function(){
            return $http.get(serverUrl+'/getAllUsers');
        },
        getOneUser : function(user){
            return $http.post(serverUrl+'/getOneUser',{_id: user._id});
        },
        updateUser : function(user){
            return $http.post(serverUrl+'/updateUser',user);
        },
        deleteUser : function(user){
            return $http.post(serverUrl+'/deleteUser',{_id : user._id});
        },
        deleteAllUsers : function(){
            return $http.post(serverUrl+'/deleteAllUsers');
        }

    }
}]);

serv.factory('login',['$http',function($http){

    return {

        connection : function(user){
            return $http.post(serverUrl+'/login',user);
        },
        logout : function(){
            return $http.post(serverUrl+'/logout');
        }

    }

}]);
