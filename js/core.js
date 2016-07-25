var app = angular.module('WWC',['Ctrls','ui.router','ngAnimate']);

app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
    $stateProvider.state('home',{
        url:'/home',
        templateUrl:'templates/home.html',
        controller:'HomeCtrl',
        params:{
            name:'home',
            public: false,
            display:'Accueil'
        }
    }).state('landing',{
        url:'/',
        templateUrl: 'templates/landing.html',
        controller: 'LandingCtrl',
        params:{
            name:'landing',
            public:true,
            display:'Bienvenue'
        }
    })
        //ETATS FILS DE LANDING
        .state('landing.main',{
            url:'/main',
            templateUrl:'templates/main.html'
        }).state('landing.about',{
            url:'/about',
            templateUrl:'templates/about.html'
        })

    $urlRouterProvider.otherwise('main');
}]);
