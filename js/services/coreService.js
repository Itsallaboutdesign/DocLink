var serv = angular.module('Services',[]);

var serverPort = 8443;
var serverUrl = 'http://82.223.10.127:'+serverPort;
// var serverUrl = 'http://localhost:'+serverPort;
serv.factory('core',['$http',function($http){
    return{
        ping : function(){
            return $http.get(serverUrl+'/ping');
        }
    }
}]);

serv.factory('quotes',['$http',function($http){
    return{
        getAllQuotes : function(){
            console.log('Getting all quotes');
            return $http.get(serverUrl+'/quotes/all');
        },
        getOneQuote : function(quote){
            return $http.post(serverUrl+'/quotes/one',{_id : quote._id});
        },
        updateQuote : function(quote){
            return $http.post(serverUrl+'/quotes/update',quote);
        },
        addQuote : function(quote){
            console.log('Adding service side...');
            console.log(quote);
            return $http.post(serverUrl+'/quotes/add',quote);
        },
        deleteQuote : function(quote){
            return $http.post(serverUrl+'/quotes/delete',{_id : quote._id});
        },
        deleteAllQuotes : function(){
            return $http.post(serverUrl+'/quotes/delete/all');
        },
        hitOnQuote : function(quote){
            return $http.post(serverUrl+'/quotes/hits',quote);
        },
        setInterview : function(quote){
            return $http.post(serverUrl+'/quotes/interviews',quote);
        }
    }
}]);

serv.factory('threads',['$http',function($http){
    return{
        getAllThreads : function(){
            return $http.get(serverUrl+'/threads/all');
        },
        getOneThread : function(thread){
            return $http.post(serverUrl+'/threads/one',{_id : thread._id});
        },
        updateThread : function(thread){
            return $http.post(serverUrl+'/threads/update',thread);
        },
        addThread : function(thread){
            return $http.post(serverUrl+'/threads/add',thread);
        },
        deleteThread : function(thread){
            return $http.post(serverUrl+'/threads/delete',{_id : thread._id});
        }
    }
}]);

serv.factory('posts',['$http',function($http){
    return{
        getAllPosts : function(){
            return $http.get(serverUrl+'/posts/all');
        },
        getOnePost : function(post){
            return $http.post(serverUrl+'/posts/one',{_id : post._id});
        },
        addPost : function(post){
            return $http.post(serverUrl+'/posts/add',post);
        },
        deletePost : function(post){
            return $http.post(serverUrl+'/posts/delete',{_id : post._id});
        }
    }
}]);

serv.factory('data',['$http',function($http){
    return{
        //Clinics
        getAllClinics : function(){
            return $http.get(serverUrl+'/clinics/all');
        },
        getOneClinic : function(clinic){
            return $http.post(serverUrl+'/clinics/one',{_id : clinic._id});
        },
        updateClinic : function(clinic){
            return $http.post(serverUrl+'/clinics/update',clinic);
        },
        addClinic : function(clinic){
            return $http.post(serverUrl+'/clinics/add',clinic);
        },
        deleteClinic : function(clinic){
            return $http.post(serverUrl+'/clinics/delete',{_id : clinic._id});
        },
        deleteAllClinics : function(){
            return $http.post(serverUrl+'/clinics/delete/all');
        },

        //Countries
        getAllCountries : function(){
            return $http.get(serverUrl+'/countries/all');
        },
        getOneCountry : function(country){
            return $http.post(serverUrl+'/countries/one',{_id : country._id});
        },
        updateCountry : function(country){
            return $http.post(serverUrl+'/countries/update',country);
        },
        addCountry : function(country){
            return $http.post(serverUrl+'/countries/add',country);
        },
        deleteCountry : function(country){
            return $http.post(serverUrl+'/countries/delete',{_id : country._id});
        },
        deleteAllCountries : function(){
            return $http.post(serverUrl+'/countries/delete/all');
        },

        //Surgeries
        getAllSurgeries : function(){
            return $http.get(serverUrl+'/surgeries/all');
        },
        getOneSurgery : function(surgery){
            return $http.post(serverUrl+'/surgeries/one',{_id : surgery._id});
        },
        updateSurgery : function(surgery){
            return $http.post(serverUrl+'/surgeries/update',surgery);
        },
        addSurgery : function(surgery){
            return $http.post(serverUrl+'/surgeries/add',surgery);
        },
        deleteSurgery : function(surgery){
            return $http.post(serverUrl+'/surgeries/delete',{_id : surgery._id});
        },
        deleteAllSurgeries : function(){
            return $http.post(serverUrl+'/surgeries/delete/all');
        },

        //User management
        selectedQuotes : function(id, quotes){
            return $http.post(serverUrl+'/user/quotes',{_id : id, selected_quotes : quotes});
        },

        //Chat management
        createThread : function(user, thread){
            return $http.post(serverUrl+'/chat/thread/new',{user_id: user._id, thread: thread});
        },
        deleteThread : function(thread){
            return $http.post(serverUrl+'/chat/thread/delete',{_id: thread._id});
        },
        myThreads : function(user){
            return $http.post(serverUrl+'/chat/thread/mine',{_id: user._id});
        },
        createMessage : function(thread){
            return $http.post(serverUrl+'/chat/thread/update/msg',thread);
        },
        threadParty : function(thread){
            return $http.post(serverUrl+'/chat/thread/update/party',thread);
        },
        getNames : function(){
            return $http.get(serverUrl+'/users/getNames');
        }

    }
}]);
