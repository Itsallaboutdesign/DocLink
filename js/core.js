var app = angular.module('WWC',['Ctrls','Services','ui.router','ngAnimate']);

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
    })
    .state('dashboard',{
        url:'/dashboard',
        templateUrl:'templates/dashboard.html',
        controller:'DashboardCtrl',
        params:{
            name: 'dashboard',
            public:false,
            display:'Dashboard'
        }
    })
        //ETATS FILS DE DASHBOARD
        .state('dashboard.home',{
            url:'/home',
            templateUrl:'templates/views/dashboard.home.html',
            params:{
                name:'dashboard.home',
                public:false,
                display:'Dashboard'
            }
        })
        .state('dashboard.interventions',{
            url:'/interventions',
            templateUrl:'templates/views/dashboard.interventions.html',
            params:{
                name:'dashboard.interventions',
                public:false,
                display:'Dashboard'
            }
        })
        .state('dashboard.history',{
            url:'/history',
            templateUrl:'templates/views/dashboard.history.html',
            params:{
                name:'dashboard.history',
                public:false,
                display:'Dashboard'
            }
        })
        .state('dashboard.calendar',{
            url:'/calendar',
            templateUrl:'templates/views/dashboard.calendar.html',
            params:{
                name:'dashboard.calendar',
                public:false,
                display:'Dashboard'
            }
        })
    .state('landing',{
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
            },
            templateUrl:'templates/aboutus.html'
        })
        .state('landing.clinics',{
            url:'/clinics',
            params:{
                name:'clinics',
                public:true,
                display:'Our Partner Clinics'
            },
            templateUrl:'templates/clinics.html'
        })
        // //ETATS FILS DE CLINICS
        //     .state('landing.clinics.list',{
        //         url:'/clinics/list',
        //         params:{
        //             name:'clinics.list',
        //             public:false,
        //             display:'Clinics list'
        //         },
        //         templateUrl:'templates/views/clinics.list.html'
        //     })
        //     .state('landing.clinics.info',{
        //         url:'/clinics/info',
        //         params:{
        //             name:'clinics.info',
        //             public:false,
        //             display:'Clinic Info'
        //         },
        //         templateUrl:'templates/views/clinics.info.html'
        //     })
        //     .state('landing.clinics.map',{
        //         url:'/clinics/info/map',
        //         params:{
        //             name:'clinics.map',
        //             public:false,
        //             display:'Clinic Map'
        //         },
        //         templateUrl:'templates/view/clinics.map.html'
        //     })
        .state('landing.contact',{
            url:'/contact',
            params:{
                name:'contact',
                public:true,
                display:'Contact Us'
            },
            templateUrl:'templates/contact.html'
        })
    $urlRouterProvider.otherwise('');
}]);
