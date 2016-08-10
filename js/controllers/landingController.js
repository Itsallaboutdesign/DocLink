//LANDING PAGE CONTROLLER
ctrl.controller('LandingCtrl',['$state','$rootScope','$scope','core',function($state,$rootScope,$scope,core){

    //Données serveur
    var data;

    //Variables d'affichage
    $scope.title = 'Vous êtes bien sur With We Care';
    $scope.isPatient = false;
    $scope.isDoctor = false;
    //Affichage de la page clinics
    $scope.clinicsView = 'templates/views/clinics.list.html'; //url de la page à inclure
    $scope.currentClinic = {};

    ///INITIALISATION HORS DONNEES SERVEUR
    $state.go('landing.main');

    //Fonction d'affichage
    $scope.goToMain = function(){
        $state.go('landing.main');
    }
    $scope.goToAbout = function(){
        $state.go('landing.about');
    }
    $scope.goTo = function(destination){
        console.log(destination);
        $state.go(destination);
    }

    //Données d'affichage
    $scope.whatWeDoData = [
        {text:'Digital records',weight: 10},
        {text:'Chat & Phone support', weight:12},
        {text:'E-consultation',weight:8},
        {text:'Pre surgery',weight:9},
        {text:'Travel Companion',weight:11},
        {text:'Post-surgery',weight:9},
        {text:'House visits',weight:9},
        {text:'Continuous feedback',weight:10}
    ];

    ///INITIALISATION GENERALE
    init = function(data){
        $scope.clinics = core.getClinics();
    }

    //Récupération des données serveur
    init();


    ///PARTIE CLINIQUE
    $scope.clinicInfo = function(clinic){
        $scope.clinicsView = 'templates/views/clinics.info.html';
        $scope.currentClinic = clinic;
    }

    $scope.clinicMap = function(clinic){
        $scope.clinicsView = 'templates/views/clinics.map.html';
        $scope.currentClinic = clinic;
    }

    $scope.clinicList = function(){
        $scope.clinicsView = 'templates/views/clinics.list.html';
        $scope.currentClinic = {};
    }

    ///PARTIE CONTACT
    //Fonction d'envoi du formulaire de contact
    $scope.sendForm = function(){
        Materialize.toast('Your contact request was successfully sent',3000,'teal');
    }

}])
