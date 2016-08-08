var app = angular.module('WWC',['Ctrls','ui.router','ngAnimate']);
console.log('Welcome to WithWeCare');
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
        url:'',
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
            params:{
                name:'main',
                public:true,
                display:'Welcome'
            },
            templateUrl:'templates/main.html'
        }).state('landing.about',{
            url:'/about',
            params:{
                name:'about',
                public:true,
                display:'About'
            },
            templateUrl:'templates/about.html'
        }).state('landing.whatwedo',{
            url:'/whatwedo',
            params:{
                name:'whatwedo',
                public:true,
                display:'What we do'
            },
            templateUrl:'templates/whatwedo.html'
        })
        .state('landing.aboutus',{
            url:'/aboutus',
            params:{
                name: 'aboutus',
                public:true,
                display: 'About us'
            }
        })

    $urlRouterProvider.otherwise('');
}]);
