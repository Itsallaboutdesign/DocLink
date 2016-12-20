ctrl.controller('DashboardCtrl',['$http','$scope','$rootScope','$state','core',
                                function($http,$scope,$rootScope,$state,core){
    $state.go('dashboard.home');

    //--------------------------------------------------------------------------
    //Initialization
    //--------------------------------------------------------------------------

    init = function(){

        //Server calls
        $scope.quotes = core.getQuotes();

        //Local variable initialization
        $scope.showingDescription = false;
        $scope.currentDescription = {};
        $scope.countries = [
            "Albania","Belgium","Croatia","Cote d'ivoire","Danmark","Ecuador","France","Germany","Hungary","Israel","Jordania","Koweit","Laos","Monaco","Namibia","Ouganda","Poland","Qatar","Romania","Spain","Turkey","Uruguay","Venezuela","Wallis & Futuna","Zambia"
        ];
        $scope.documentTypes = [
            "Id","Driver Licence","Passport"
        ];

        $scope.ui = {
            medicalProfile:{
                countryModalOk : false,
                citizenModalOk : false,
                documentTypeModalOk : false
            },
            intervention:{
                tabState : 1
            }
        };

        $scope.medicalProfile = {
            state : "Select your country",
            citizenship : "Citizenship",
            birthday:{
                day : 01,
                month: 01,
                year: 1900
            },
            idDocument:{
                type:"Document type",
                number: "",
                expiry:{
                    day: 01,
                    month: 01,
                    year: 2017,
                }
            },
            medicalInfo:{
                insuranceNumber:"",
                allergies:"",
                certificate:"",
                addFile:"",
                notes:"",
            }
        };

    }

    init();


    //--------------------------------------------------------------------------
    //View functions
    //--------------------------------------------------------------------------


    ///INTERVENTION PART

    //Quotes tab

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

    //Changes ui state when the country selection modal is triggered
    //Triggering of modals is performed on the HTML page
    $scope.selectCountry = function(country){
        $scope.ui.medicalProfile.countryModalOk = true;
        $scope.medicalProfile.state = country;
    }

    //Changes ui state when the citizenship selection modal is triggered
    $scope.selectCitizenship = function(country){
        $scope.ui.medicalProfile.citizenModalOk = true;
        $scope.medicalProfile.citizenship = country;
    }

    //Changes ui state when the document type selection modal is triggered
    $scope.selectDocumentType = function(type){
        $scope.ui.medicalProfile.documentTypeModalOk = true;
        $scope.medicalProfile.idDocument.type = type;
    }

    //Switches the current tab
    $scope.interventionTabSet = function(tabNumber){
        tab_id = "quotes";
        $scope.interventionTabActivate(tabNumber);
        switch(tabNumber){
            case 1: tab_id = "quotes"; break;
            case 2: tab_id = "medprofile"; break;
            case 3: tab_id = "trip"; break;
            case 4: tab_id = "advices"; break;
            case 5: tab_id = "payment"; break;
            default: tab_id = "quotes"; break;
        }
        $('ul.tabs').tabs('select_tab', tab_id);
    }

    $scope.interventionTabActivate = function(tabNumber){
        switch(tabNumber){
            case 1: tab_id = "tab1"; break;
            case 2: tab_id = "tab2"; break;
            case 3: tab_id = "tab3"; break;
            case 4: tab_id = "tab4"; break;
            case 5: tab_id = "tab5"; break;
            default: tab_id = "tab1"; break;
        }
        document.getElementById(tab_id).className = "tab";
    }

    //Changes the tab state and calls the switching tab method
    $scope.interventionTabState = function(){
        $scope.ui.intervention.tabState ++;
        $scope.interventionTabActivate($scope.ui.intervention.tabState);
    }

    //Tab management functions

    //Accepting a quote
    $scope.acceptQuote = function(){
        $scope.interventionTabState();
        for (var i = 0; i < $scope.quotes.length; i++) {
            if($scope.quotes[i].accepted) Materialize.toast('The quote from '+ $scope.quotes[i].surname+' '+$scope.quotes[i].name+' has been canceled',3000,'red lighten-2 white-text');
            $scope.quotes[i].accepted = false;
        }
        $scope.currentDescription.accepted = true;
        //The accepted quote is contained in $scope.currentDescription
        Materialize.toast('You accepted the quote from '+$scope.currentDescription.surname+' '+$scope.currentDescription.name,3000,'teal white-text');
    }

    $scope.cancelQuote = function(){
        $scope.ui.intervention.tabState = 1;
        $scope.currentDescription.accepted = false;
        Materialize.toast('The quote from '+ $scope.currentDescription.surname+' '+$scope.currentDescription.name+' has been canceled',3000,'red lighten-2 white-text');
    }

    //Select another period
    $scope.selectNewPeriod = function(){

    }

    //Book an interview
    $scope.bookInterview = function(){

    }

    $scope.submitMedicalProfile = function(){
        $scope.interventionTabState();
        $scope.interventionTabSet($scope.ui.intervention.tabState);
        Materialize.toast('Your medical profile has been saved',3000,'teal white-text');
    }

    //


}]);
