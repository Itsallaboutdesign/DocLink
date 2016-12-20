var serv = angular.module('Services',[]);

var serverPort = 8080;
var serverUrl = 'http://localhost:'+serverPort;

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
        },

        getQuotes :function(){
            return[
                {
                    name:'Trouillier',
                    surname:'Maxime',
                    price:5000,
                    specialty:'Heart surgeon',
                    motivation:'Best doctor around here',
                    pic:'img/profile_pictures/trouillet.png',
                    accepted : false,
                    period:{
                        date: 0,
                        time : 0
                    },
                    interview:{
                        booked : false,
                        date : 0,
                        time: 0
                    }
                },
                {
                    name:'Pierre',
                    surname:'Jean',
                    price:3000,
                    specialty:'Plastic surgeon',
                    motivation:'Best doctor around here',
                    pic:'img/profile_pictures/trouillet.png',
                    accepted : false,
                    period:{
                        date: 0,
                        time : 0
                    },
                    interview:{
                        booked : false,
                        date : 0,
                        time: 0
                    }
                },
                {
                    name:'Richard',
                    surname:'Jack',
                    price:7000,
                    specialty:'Heart surgeon',
                    motivation:'Best doctor around here',
                    pic:'img/profile_pictures/trouillet.png',
                    accepted : false,
                    period:{
                        date: 0,
                        time : 0
                    },
                    interview:{
                        booked : false,
                        date : 0,
                        time: 0
                    }
                },
                {
                    name:'Anderson',
                    surname:'Eric',
                    price:6000,
                    specialty:'Neurosurgery',
                    motivation:'Best doctor around here',
                    pic:'img/profile_pictures/trouillet.png',
                    accepted : false,
                    period:{
                        date: 0,
                        time : 0
                    },
                    interview:{
                        booked : false,
                        date : 0,
                        time: 0
                    }
                },
            ]
        }
    }
}]);
