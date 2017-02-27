var app = angular.module('WWC',['Ctrls','Services','Filters','ui.router','ngAnimate']);

console.log('Welcome to WithWeCare');
var socket = io.connect('http://82.223.10.127:8443',{reconnect: true});

//GESTION DE LA DATE (PERIODE)

Date.prototype.getYearDay = function() { //1 - 366
	var year  = this.getFullYear();
	var month = this.getMonth();
	var day   = this.getDate();

	var offset = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

	//l'année bissextile n'est utile qu'à partir de mars
	var bissextile = (month < 2) ? 0 : (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0));

	return parseInt(day + offset[month] + bissextile);
}
Date.prototype.getMonday = function() {
	var offset = (this.getDay() + 6) % 7;
	return new Date(this.getFullYear(), this.getMonth(), this.getDate()-offset);
}
Date.prototype.getWeek = function() { //1 - 53
	var year = this.getFullYear();
	var week;

	//dernier lundi de l'année
	var lastMonday = new Date(year, 11, 31).getMonday();

	//la date est dans la dernière semaine de l'année
	//mais cette semaine fait partie de l'année suivante
	if(this >= lastMonday && lastMonday.getDate() > 28) {
		week = 1;
	}
	else {
		//premier lundi de l'année
		var firstMonday = new Date(year, 0, 1).getMonday();

		//correction si nécessaire (le lundi se situe l'année précédente)
		if(firstMonday.getFullYear() < year) firstMonday = new Date(year, 0, 8).getMonday();

		//nombre de jours écoulés depuis le premier lundi
		var days = this.getYearDay() - firstMonday.getYearDay();

		//window.alert(days);

		//si le nombre de jours est négatif on va chercher
		//la dernière semaine de l'année précédente (52 ou 53)
		if(days < 0) {
			week = new Date(year, this.getMonth(), this.getDate()+days).getWeek();
		}
		else {
			//numéro de la semaine
			week = 1 + parseInt(days / 7);

			//on ajoute une semaine si la première semaine
			//de l'année ne fait pas partie de l'année précédente
			week += (new Date(year-1, 11, 31).getMonday().getDate() > 28);
		}
	}

	return parseInt(week);
}

app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
    $stateProvider.state('dashboard',{
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
		.state('landing.research',{
				url:'/research',
				templateUrl:'templates/views/main.research.html',
				params:{
					name:'research',
					public:true,
					display:'Research'
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
		.state('landing.forum',{
			url:'/forum',
			controller: 'ForumCtrl',
			params:{
				name:'forum',
				public:true,
				display:'Forum'
			},
			templateUrl:'templates/forum.html'
		})
	.state('admin',{
		url:'/admin',
		controller: 'AdminCtrl',
		params:{
			name:'admin',
			public: true,
			display: 'Administration'
		},
		templateUrl : 'templates/admin.html'
	})
    $urlRouterProvider.otherwise('');
}]);
