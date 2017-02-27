//LANDING PAGE CONTROLLER
ctrl.controller('LandingCtrl',['$state','$stateParams','$rootScope','$scope','core','quotes','data',function($state,$stateParams,$rootScope,$scope,core,quotes,data){

    $state.go('landing.main');
    $scope.tabState = 1;
    ///INITIALISATION GENERALE
    init = function(){
        console.log('Landing Initialization');
        //Server calls
        $scope.clinics = [];
        data.getAllClinics().then(function getClinicsSuccess(data){
            $scope.clinics = data.data;
        },function getClinicsError(data){
            console.log(data.data);
        })


        $scope.quotes = [];
        $scope.quotesInStack = 0;
        quotes.getAllQuotes().then(
            function getAllQuotesSuccess(data){
                if(typeof data.data != 'string'){
                     $scope.quotes = data.data;
                     console.log($scope.quotes);
                     if($rootScope.currentUser.selected_quotes){
                         for (var i = 0; i < $scope.quotes.length; i++) {
                             console.log($scope.quotes[i]._id);
                             for (var j = 0; j < $rootScope.currentUser.selected_quotes.length; j++) {
                                 if($rootScope.currentUser.selected_quotes[j]._id === $scope.quotes[i]._id){
                                     $scope.quotes[i].added = true;
                                     $scope.quotesInStack++;
                                 }
                             }
                         }
                     }
                }
                else Materialize.toast(data.data,3000,'red lighten-2');
            },
            function getAllQuotesError(data){
                console.log(data.data);
            }
        );
    }

    //Récupération des données serveur
    init();

    socket.on('login',function(){
        init();
    })

    //Shows description of the selected quote
    $scope.showDescription = function(quote){
        $scope.showingDescription = true;
        $scope.currentDescription = quote;
    }

    //Closes description of a quote
    $scope.closeDescription = function(){
        $scope.showingDescription = false;
        $scope.currentDescription = {};
    }

    $scope.hideNav = function(){
    	$('.side-nav').sideNav('hide');
    }

    //Switches the current tab
    $scope.interventionTabSet = function(tabNumber){
        tab_id = "tab1";
        $scope.interventionTabActivate(tabNumber);
        switch(tabNumber){
            case 1: tab_id = "tab1"; break;
            case 2: tab_id = "tab2"; break;
            case 3: tab_id = "tab3"; break;
            case 4: tab_id = "tab4"; break;
            default: tab_id = "tab1"; break;
        }
        $('ul.tabs').tabs('select_tab', tab_id);
    }

    $scope.interventionTabActivate = function(tabNumber){
        switch(tabNumber){
            case 1: tab_id = "tab1"; break;
            case 2: tab_id = "tab2"; break;
            case 3: tab_id = "tab3"; break;
            case 4: tab_id = "tab4"; break;
            default: tab_id = "tab1"; break;
        }
        document.getElementById(tab_id).className = "tab";
    }

    //Changes the tab state and calls the switching tab method
    $scope.interventionTabState = function(){
        $scope.tabState ++;
        $scope.interventionTabActivate($scope.tabState);
    }


    //Variables d'affichage
    $scope.title = 'Vous êtes bien sur With We Care';
    $scope.isPatient = false;
    $scope.isDoctor = false;
    $rootScope.landingDisplay++;


    //Affichage de la page clinics
    $scope.clinicsView = 'templates/views/clinics.list.html'; //url de la page à inclure
    $scope.currentClinic = {};
    //Affichage de la page de contact
    $scope.request = {};

    ///INITIALISATION HORS DONNEES SERVEUR
    if($rootScope.landingDisplay === 1) $state.go('landing.main');

    //Fonction d'affichage
    $scope.goToMain = function(){
        $state.go('landing.main');
    }
    $scope.goToAbout = function(){
        $state.go('landing.about');
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

    $scope.searchInput = {
        price: 10000,
        surgery:{
            code : ""
        },
        country:{
            name: ""
        },
        currency:"EUR",
        city:""
    }

    //Filtres d'affichage
    $scope.surgeryCountryCurrency = function(quote){

        return function(quote){
            var array = [];
            if($scope.searchInput.surgery.code != "") var surgery = $scope.searchInput.surgery.code;
            if($scope.searchInput.country.name != "") var country = $scope.searchInput.country.name;
            var currency = $scope.searchInput.currency;
            var price = $scope.searchInput.price;
            var city = $scope.searchInput.city;

            if(surgery && surgery != ""){
                if(country && country !=""){
                    if(currency && currency !=""){
                        if(quote.surgery.code === surgery &&
                           quote.country.name === country &&
                           quote.currency === currency &&
                           quote.price < price){
                               if(!city || city === ""){
                                    return quote;
                               }else{
                                   if(quote.surgery.clinic.address.city === city) return quote;
                               }
                           }
                    }else{
                        if(quote.surgery.code === surgery &&
                           quote.country.name === country &&
                           quote.price < price){
                               if(!city || city === ""){
                                    return quote;
                               }else{
                                   if(quote.surgery.clinic.address.city === city) return quote;
                               }
                           }
                    }
                }else{
                    if(quote.surgery.code === surgery &&
                       quote.price < price){
                           if(!city || city === ""){
                                return quote;
                           }else{
                               if(quote.surgery.clinic.address.city === city) return quote;
                           }
                       }
                }

            }else{
                if(quote.price < price){
                    if(!city || city === "")
                         return quote;
                    else{
                        if(quote.surgery.clinic.address.city === city) return quote;
                    }
                }

            }
        }
    }



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
        $scope.request = {};
    }

    //PARTIE ACCOMPANIMENT
    $scope.addDoctorToSelection = function(){
        var user = $rootScope.currentUser;
        var quote = $scope.currentDescription;
        var exists = false;
        if(!user.selected_quotes) user.selected_quotes = [];
        else for (var i = 0; i < user.selected_quotes.length; i++) {
            if(user.selected_quotes[i]._id === quote._id) exists = true;
        }

        if(!exists) user.selected_quotes.push(quote);
        $scope.currentDescription.added = true;
        data.selectedQuotes(user._id, user.selected_quotes).then(
            function addToQuotesSuccess(data){
                if(typeof data.data != 'string'){
                    $rootScope.currentUser = data.data;
                    init();
                    Materialize.toast(quote.surname +' '+ quote.name +' was added to your quotes selection',3000,'teal lighten-2');
                }else Materialize.toast(data.data,'3000','red lighten-2');
            },function addToQuotesError(data){
                console.log(data.data);
            }
        )
    }

    $scope.removeDoctorFromSelection = function(quote){
        var user = $rootScope.currentUser;

        for (var i = 0; i < user.selected_quotes.length; i++) {
            if(user.selected_quotes[i]._id === quote._id){
                user.selected_quotes.splice(i,1);
                break;
            }
        }
        $scope.currentDescription.added = false;
        data.selectedQuotes(user._id, user.selected_quotes).then(
            function removeFromQuotesSuccess(data){
                if(typeof data.data != 'string'){
                    $rootScope.currentUser = data.data;
                    init();
                    Materialize.toast(quote.surname +' '+ quote.name +' was removed from your quotes selection',3000,'teal lighten-2');
                }else Materialize.toast(data.data,'3000','red lighten-2');
            },function removeFromQuotesError(data){
                console.log(data.data);
            }
        )
    }

}])
