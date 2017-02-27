//MAIN CONTROLLERS MODULE
//All other controllers must be laid in other files to be called in index.html next to this one
var ctrl = angular.module('Ctrls',['Services']);

ctrl.controller('MainCtrl',['$state','$scope','$rootScope','signin','core','$interval',function($state,$scope,$rootScope,signin,core,$interval){
    console.log('Main Ctrl');

    $state.go('landing.main');

    //Initialisation générale
    $rootScope.logged = false;
    $rootScope.connected = true;
    // $rootScope.socket = io.connect(serverUrl, {reconnect: true});

    core.ping().then(function success(){
    },function error(){
        Materialize.toast('The server connection has been lost, please wait...',3000,'red lighten-2');
        $rootScope.connected = false;
    })

    $rootScope.dateDisplay = function (input){
        var date='',day='',month='',year='';

        date = new Date(input);
        day = date.getDate();
        if(day <10) day = '0'+day;
        month = date.getMonth()+1;
        if(month < 10) month= '0'+month;
        year = date.getYear();
        if(year < 100) year = '19'+ year;
        else year = '20' + (year - 100);

        return month +'/'+ day +'/'+year;
    }

    $rootScope.dateHourDisplay = function(input){
        var date='',day='',month='',year='',hours='',min='',sec='';

        date = new Date(input);
        day = date.getDate();
        if(day <10) day = '0'+day;
        month = date.getMonth()+1;
        if(month < 10) month= '0'+month;
        year = date.getYear();
        if(year < 100) year = '19'+ year;
        else year = '20' + (year - 100);
        hours = date.getHours();
        if(hours <10) hours = '0'+hours;
        min = date.getMinutes();
        if(min <10) min = '0'+min;
        sec = date.getSeconds();
        if(sec <10) sec = '0'+sec;

        return month +'/'+ day +'/'+year+' '+hours+':'+min+':'+sec;

    }
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



    $rootScope.dateTabs = {
        days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] ,
        months : ['January','February','March','April','May','June','July','August','September','October','November','December']
    }

    $rootScope.currentDate = {
        day : $rootScope.dateTabs.days[new Date().getDay()],
        month : $rootScope.dateTabs.months[new Date().getMonth()],
        year : new Date().getYear() + 1900
    }

    console.log(new Date().getYear());
    console.log($rootScope.currentDate);

    //Changement d'états
    $scope.goTo = function(destination){
        console.log(destination);
        $state.go(destination);
    }

    //Gestion des états
    $rootScope.$on('$stateChangeStart',function(event,toState,fromState,toParams,fromParams){
        console.log('state change: '+fromParams.name +' -> '+toParams.name);
        $rootScope.currentUser.state_changes++;
        signin.updateUser($rootScope.currentUser).then(function updateUserSuccess(data){console.log(data.data)},function updateUserError(data){console.log(data.data)})
        if(!toState.params.public && !$rootScope.logged){
            event.preventDefault();
            $state.go('landing.main');
            Materialize.toast("You're not connected",3000,'red lighten-2');
        }
    });

    //Verification de la Connexion
    $interval(function(){
            core.ping().then(function success(){
                if(!$rootScope.connected){
                    Materialize.toast('Reconnected',3000,'teal lighten-2');
                    $rootScope.connected = true;
                }
            },function error(){
                if($rootScope.connected){
                    Materialize.toast('The server connection has been lost, please wait...',3000,'red lighten-2');
                    $rootScope.connected = false;
                }
            })
    },2000);


}]);
