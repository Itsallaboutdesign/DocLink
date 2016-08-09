var serv = angular.module('Services',[]);

serv.factory('core',['$http',function($http){
    return{
        //Temporary function, for test purposes only
        //Final function should emit an http request to node server to fetch those datas
        getClinics : function(){
            return [
                {
                    name:'Dr Michel Assor, Institut du Genou Arthrosport',
                    type:'Orthopedics surgery',
                    location:'11 Boulevard de la Pugette',
                    phone:'+33 4 91 23 12 31',
                    _id:0
                },
                {
                    name:'Dr Michel Assor, Institut du Genou Arthrosport',
                    type:'Orthopedics surgery',
                    location:'11 Boulevard de la Pugette',
                    phone:'+33 4 91 23 12 31',
                    _id:1
                },
                {
                    name:'Dr Michel Assor, Institut du Genou Arthrosport',
                    type:'Orthopedics surgery',
                    location:'11 Boulevard de la Pugette',
                    phone:'+33 4 91 23 12 31',
                    _id:2
                },
                {
                    name:'Dr Michel Assor, Institut du Genou Arthrosport',
                    type:'Orthopedics surgery',
                    location:'11 Boulevard de la Pugette',
                    phone:'+33 4 91 23 12 31',
                    _id:3
                },
                {
                    name:'Dr Michel Assor, Institut du Genou Arthrosport',
                    type:'Orthopedics surgery',
                    location:'11 Boulevard de la Pugette',
                    phone:'+33 4 91 23 12 31',
                    _id:4
                },
                {
                    name:'Dr Michel Assor, Institut du Genou Arthrosport',
                    type:'Orthopedics surgery',
                    location:'11 Boulevard de la Pugette',
                    phone:'+33 4 91 23 12 31',
                    _id:5
                }

            ]
        }
    }
}]);
