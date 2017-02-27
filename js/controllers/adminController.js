ctrl.controller('AdminCtrl',['$http','$scope','$rootScope','$state','core',
                                'signin','quotes','data',
                                function($http,$scope,$rootScope,$state,core,signin,quotes,data){

        //Variable d'affichage
        $scope.state = {
            displayUser : false,
            displayQuote : false,
            displayClinic : false,
            displayCountry : false,
            addingUser : false,
            addingQuote : false,
            addingClinic : false,
            addingCountry : false,
            currentUser : {
                address:{
                    country:{}
                }
            },
            currentQuote : {},
            currentClinic : {
                doctors_id:[],
                accreditations:[]
            },
            currentCountry : {},
            currentSurgery: {},
            type : 1
        };

        $scope.showTitle=true;
        $scope.quotes = [];
        $scope.users = [];
        $scope.clinics = [];
        $scope.contries = [];
        $scope.surgeries = [];

        setTimeout(function(){
            $scope.showTitle = false;
        },1500);

        function birthdateDisplayConversion(birthdate){
            var date='',day='',month='',year='';
            date = new Date(birthdate);
            day = date.getDate();
            if(day <10) day = '0'+day;
            month = date.getMonth()+1;
            if(month < 10) month= '0'+month;
            year = date.getYear();
            if(year < 100) year = '19'+ year;
            else year = '20' + (year - 100);

            return month +'/'+ day +'/'+year;

        }

        // Initialisation des données

        function init(){
            var errors = 0;
            signin.getAllUsers().then(
                function getAllUsersSuccess(data){
                    if(typeof data.data != 'string'){
                        console.log(data.data);
                        for (var i = 0; i < data.data.length; i++) {
                            data.data[i].birthdate = birthdateDisplayConversion(data.data[i].birthdate);
                            if(data.data[i].name && data.data[i].name != '')
                                $scope.users.push(data.data[i]);
                                if($scope.refreshing){
                                    Materialize.toast('Successfully refreshed',3000,'teal lighten-2');
                                    $scope.refreshing = false;
                                }
                        }
                    }
                    else Materialize.toast(data.data,3000,'red lighten-2');
                },
                function getAllUsersError(data){
                    console.log(data.data);
                    Materialize.toast('Users: Server error',3000,'red lighten-2');
                        Materialize.toast(data.data,5000,'red lighten-3');
                        errors++;
                }
            );

            quotes.getAllQuotes().then(
                function getAllQuotesSuccess(data){
                    if(typeof data.data != 'string') $scope.quotes = data.data;
                    else Materialize.toast(data.data,3000,'red lighten-2');
                },
                function getAllQuotesError(data){
                    console.log(data.data);
                    Materialize.toast('Quotes: Server error',3000,'red lighten-2');
                    Materialize.toast(data.data,5000,'red lighten-3');
                    errors++;
                }
            );

            data.getAllClinics().then(
                function getAllClinicsSuccess(data){
                    if(typeof data.data != 'string') $scope.clinics = data.data;
                    else Materialize.toast(data.data,3000,'red lighten-2');
                },
                function getAllClinicsError(data){
                    console.log(data.data);
                    Materialize.toast('Clinics: Server error',3000,'red lighten-2');
                    Materialize.toast(data.data,5000,'red lighten-3');
                    errors++;
                }
            );

            data.getAllCountries().then(
                function getAllCountriesSucces(data){
                    if(typeof data.data != 'string') $scope.countries = data.data;
                    else Materialize.toast(data.data,3000,'red lighten-2');
                },function getAllCountriesError(data) {
                    console.log(data.data);
                    Materialize.toast('Countries: Server error',3000,'red lighten-2');
                    Materialize.toast(data.data,5000,'red lighten-3');
                    errors++;
                }
            );

            data.getAllSurgeries().then(
                function getAllSurgeriesSucces(data){
                    if(typeof data.data != 'string') $scope.surgeries = data.data;
                    else Materialize.toast(data.data,3000,'red lighten-2');
                },function getAllSurgeriesError(data) {
                    console.log(data.data);
                    Materialize.toast('Surgeries: Server error',3000,'red lighten-2');
                    Materialize.toast(data.data,5000,'red lighten-3');
                    errors++;
                }
            )

        }

        init();

        $scope.refresh = function(){
            $scope.refreshing = true;
            Materialize.toast('Refreshing...',3000,'teal');
            $scope.quotes = [];
            $scope.users = [];
            $scope.clinics = [];
            $scope.contries = [];
            $scope.surgeries = [];
            init();
        }

        //Fonctions d'affichage
        $scope.displayUser = function(user){
            $scope.state.currentUser = user;
            $scope.state.addingUser = false;
            $scope.state.displayUser = true;
        }

        $scope.displayQuote = function(quote){
            $scope.state.currentQuote = quote;
            $scope.state.addingQuote = false;
            $scope.state.displayQuote = true;
        }

        $scope.displayClinic = function(clinic){
            $scope.state.currentClinic = clinic;
            $scope.state.addingClinic = false;
            $scope.state.displayClinic = true;
        }

        $scope.displayCountry = function(country){
            $scope.state.currentCountry = country;
            $scope.state.addingCountry = false;
            $scope.state.displayCountry = true;
        }

        $scope.displaySurgery = function(surgery){
            $scope.state.currentSurgery = surgery;
            $scope.state.addingSurgery = false;
            $scope.state.displaySurgery = true;
        }

        $scope.exitUser = function(){
            $scope.state.currentUser = {};
            $scope.state.displayUser = false;
            $scope.state.addingUser = false;
        }

        $scope.exitQuote = function(){
            $scope.state.currentQuote = {};
            $scope.state.displayQuote = false;
            $scope.state.addingQuote = false;
        }

        $scope.exit = function(){
            $scope.state.currentClinic = {
                doctors_id:[],
                accreditations:[]
            }
            $scope.state.currentCountry = {};
            $scope.state.displayClinic = false;
            $scope.state.addingClinic = false;
            $scope.state.displayCountry = false;
            $scope.state.addingCountry = false;
            $scope.state.displaySurgery = false;
            $scope.state.addingSurgery = false;
        }

        $scope.stateType = function(int){
            $scope.state.type = int;
            console.log('State type:'+ $scope.state.type);
        }

        //FONCTIONS

        $scope.addUserMode = function(){
            $scope.state.addingUser = true;
            $scope.state.displayUser = false;
            $scope.state.currentUser = {};
        }

        $scope.addQuoteMode = function(){
            $scope.state.addingQuote = true;
            $scope.state.displayQuote = false;
            $scope.state.currentQuote = {};
        }

        $scope.addClinicMode = function(){
            $scope.state.addingClinic = true;
            $scope.state.displayClinic = false;
            $scope.state.currentClinic = {
                doctors_id:[],
                accreditations:[]
            }
        }

        $scope.addCountryMode = function(){
            $scope.state.addingCountry = true;
            $scope.state.displayCountry = false;
            $scope.state.currentCountry = {};
        }

        $scope.addSurgeryMode = function(){
            $scope.state.addingSurgery = true;
            $scope.state.displaySurgery = false;
            $scope.state.curretnSurgery = {};
        }

        $scope.add = function(input){
            console.log('Add');
            //User
            if(input.email != "" && input.email){
                console.log('User');
                //Birthdate conversion
                if(input.birthdate)
                    input.birthdate = new Date(input.birthdate).getTime();
                //Checking majority
                if( input.birthdate > ( new Date().getTime() - (568080000000) ) )
                    Materialize.toast('Users must be over 18 to register',3000,'red lighten-2');
                else
                signin.addUser(input).then(
                    function addUserSuccess(data){
                        if(typeof data.data != 'string' && !data.data.msg){
                            Materialize.toast(input.surname+' has beeen registered',3000,'teal');
                            $scope.users = data.data;
                            for (var i = 0; i < $scope.users.length; i++) {
                                $scope.users[i].birthdate = birthdateDisplayConversion($scope.users[i].birthdate);
                            }
                            $scope.exitUser();
                        }else{
                            if(data.data.msg) Materialize.toast(data.data.msg,3000,'red lighten-2');
                            else Materialize.toast(data.data,3000,'red lighten-2');
                        }
                    },function addUserError(data){
                        Materialize.toast('Server error',3000,'red lighten-2');
                    }
                )
            }
            //Quote
            else{
                console.log('Quote');
                console.log(input);
                quotes.addQuote(input).then(
                    function addQuoteSuccess(data){
                        if(typeof data.data != 'string'){
                            Materialize.toast('Quote was successfully created',3000,'teal');
                            $scope.quotes = data.data;
                            $scope.exitQuote();
                        }else Materialize.toast(data.data,3000,'red lighten-2');
                    },function addQuoteError(data){
                        Materialize.toast('Server error',3000,'red lighten-2');
                    }
                );
            }
        }

        $scope.save = function(input){
            //User
            if(input.email != "" && input.email){
                //Birthdate conversion
                if(input.birthdate)
                    input.birthdate = new Date(input.birthdate).getTime();
                //Checking majority
                if( input.birthdate > ( new Date().getTime() - (568080000000) ) )
                    Materialize.toast('Users must be over 18 to register',3000,'red lighten-2');
                else
                signin.updateUser(input).then(
                    function updateUserSuccess(data){
                        if(typeof data.data != 'string'){
                            Materialize.toast(input.surname+' was successfully updated',3000,'teal');
                            $scope.users = data.data;
                            for (var i = 0; i < $scope.users.length; i++) {
                                $scope.users[i].birthdate = birthdateDisplayConversion($scope.users[i].birthdate);
                            }
                            $scope.exitUser();
                        }else Materialize.toast(data.data,3000,'red lighten-2');
                    },function updateUserError(data){
                        Materialize.toast('Server error',3000,'red lighten-2');
                    }
                );
            }
            //Quote
            else{
                quotes.updateQuote(input).then(
                    function updateQuoteSuccess(data){
                        if(typeof data.data != 'string'){
                            Materialize.toast('Quote was successfully updated',3000,'teal');
                            $scope.quotes = data.data;
                            $scope.exitQuote();
                        }else Materialize.toast(data.data,3000,'red lighten-2');
                    },function updateQuoteError(data){
                        Materialize.toast('Server error',3000,'red lighten-2');
                    }
                )
            }
        }

        $scope.delete = function(input){
            //User
            if(input.email != "" && input.email){
                signin.deleteUser(input).then(
                    function deleteUserSuccess(data){
                        if(typeof data.data != 'string'){
                            Materialize.toast(input.surname+' was successfully deleted',3000,'teal');
                            $scope.users = data.data;
                            for (var i = 0; i < $scope.users.length; i++) {
                                $scope.users[i].birthdate = birthdateDisplayConversion($scope.users[i].birthdate);
                            }
                            $scope.exitUser();
                        }else Materialize.toast(data.data,3000,'red lighten-2');
                    },function deleteUserError(data){
                        Materialize.toast('Server error',3000,'red lighten-2');
                    }
                )
            }
            //Quote
            else{
                quotes.deleteQuote(input).then(
                    function deleteQuoteSuccess(data){
                        if(typeof data.data != 'string'){
                            Materialize.toast('Quote was successfully deleted',3000,'teal');
                            $scope.quotes = data.data;
                            $scope.exitQuote();
                        }else Materialize.toast(data.data,3000,'red lighten-2');
                    },function deleteQuoteError(data){
                        Materialize.toast('Server error',3000,'red lighten-2');
                    }
                )
            }
        }

        $scope.deleteAllUsers = function(){
            signin.deleteAllUsers().then(
                function deleteAllUsersSuccess(data){
                    if(typeof data.data != 'string'){
                        Materialize.toast('All users have been deleted',3000,'teal');
                        $scope.users = data.data;
                        $scope.exitUser();
                    }else Materialize.toast(data.data,3000,'red lighten-2');
                },function deleteAllUsersError(data){
                    Materialize.toast('Server error',3000,'red lighten-2');
                }
            )
        }


        $scope.deleteAllQuotes = function(){
            quotes.deleteAllQuotes().then(
                function deleteAllQuotesSuccess(data){
                    if(typeof data.data != 'string'){
                        Materialize.toast('All Quotes have been deleted',3000,'teal');
                        $scope.quotes = data.data;
                        $scope.exitQuote();
                    }else Materialize.toast(data.data,3000,'red lighten-2');
                },function deleteAllQuotesError(data){
                    Materialize.toast('Server error',3000,'red lighten-2');
                }
            )
        }

        //GENERAL DATA MANAGEMENT

        $scope.addClinic = function(clinic){
            data.addClinic(clinic).then(
                function addClinicSuccess(data){
                    if(typeof data.data != 'string'){
                        Materialize.toast('Clinic was successfully created',3000,'teal');
                        $scope.clinics = data.data;
                        $scope.exit();
                    }else Materialize.toast(data.data,3000,'red lighten-2');
                },function addClinicError(data){
                    Materialize.toast('Server error',3000,'red lighten-2');
                }
            );
        }

        $scope.addCountry = function(country){
            data.addCountry(country).then(
                function addCountrySuccess(data){
                    if(typeof data.data != 'string'){
                        Materialize.toast('Country was successfully created',3000,'teal');
                        $scope.countries = data.data;
                        $scope.exit();
                    }else Materialize.toast(data.data,3000,'red lighten-2');
                },function addCountryError(data){
                    Materialize.toast('Server error',3000,'red lighten-2');
                }
            );
        }

        $scope.addSurgery = function(country){
            data.addSurgery(country).then(
                function addSurgerySuccess(data){
                    if(typeof data.data != 'string'){
                        Materialize.toast('Surgery was successfully created',3000,'teal');
                        $scope.surgeries = data.data;
                        $scope.exit();
                    }else Materialize.toast(data.data,3000,'red lighten-2');
                },function addSurgeryError(data){
                    Materialize.toast('Server error',3000,'red lighten-2');
                }
            );
        }


        $scope.saveClinic = function(clinic){
            data.updateClinic(clinic).then(
                function updateClinicSuccess(data){
                    if(typeof data.data != 'string'){
                        Materialize.toast('Clinic was successfully updated',3000,'teal');
                        $scope.clinics = data.data;
                        $scope.exit();
                    }else Materialize.toast(data.data,3000,'red lighten-2');
                },function updateClinicError(data){
                    Materialize.toast('Server error',3000,'red lighten-2');
                }
            );
        }

        $scope.saveCountry = function(country){
            data.updateCountry(country).then(
                function updateCountrySuccess(data){
                    if(typeof data.data != 'string'){
                        Materialize.toast('Country was successfully updated',3000,'teal');
                        $scope.countries = data.data;
                        $scope.exit();
                    }else Materialize.toast(data.data,3000,'red lighten-2');
                },function updateCountryError(data){
                    Materialize.toast('Server error',3000,'red lighten-2');
                }
            );
        }

        $scope.saveSurgery = function(country){
            data.updateSurgery(country).then(
                function updateSurgerySuccess(data){
                    if(typeof data.data != 'string'){
                        Materialize.toast('Surgery was successfully updated',3000,'teal');
                        $scope.surgeries = data.data;
                        $scope.exit();
                    }else Materialize.toast(data.data,3000,'red lighten-2');
                },function updateSurgeryError(data){
                    Materialize.toast('Server error',3000,'red lighten-2');
                }
            );
        }

        $scope.deleteClinic = function(clinic){
            data.deleteClinic(clinic).then(
                function deleteClinicSuccess(data){
                    if(typeof data.data != 'string'){
                        Materialize.toast('Clinic was successfully deleted',3000,'teal');
                        $scope.clinics = data.data;
                        $scope.exit();
                    }else Materialize.toast(data.data,3000,'red lighten-2');
                },function deleteClinicError(data){
                    Materialize.toast('Server error',3000,'red lighten-2');
                }
            );
        }

        $scope.deleteCountry = function(country){
            data.deleteCountry(country).then(
                function deleteCountrySuccess(data){
                    if(typeof data.data != 'string'){
                        Materialize.toast('Country was successfully deleted',3000,'teal');
                        $scope.countries = data.data;
                        $scope.exit();
                    }else Materialize.toast(data.data,3000,'red lighten-2');
                },function deleteCountryError(data){
                    Materialize.toast('Server error',3000,'red lighten-2');
                }
            );
        }

        $scope.deleteSurgery = function(country){
            data.deleteSurgery(country).then(
                function deleteSurgerySuccess(data){
                    if(typeof data.data != 'string'){
                        Materialize.toast('Surgery was successfully deleted',3000,'teal');
                        $scope.surgeries = data.data;
                        $scope.exit();
                    }else Materialize.toast(data.data,3000,'red lighten-2');
                },function deleteSurgeryError(data){
                    Materialize.toast('Server error',3000,'red lighten-2');
                }
            );
        }

        $scope.deleteAllClinics = function(){
            data.deleteAllClinics().then(
                function deleteAllClinicsSuccess(data){
                    if(typeof data.data != 'string'){
                        Materialize.toast('All clinics have been deleted',3000,'teal');
                        $scope.clinics = data.data;
                        $scope.exit();
                    }else Materialize.toast(data.data,3000,'red lighten-2');
                },function deleteAllClinicsError(data){
                    Materialize.toast('Server error',3000,'red lighten-2');
                }
            );
        }

        $scope.deleteAllCountries = function(){
            data.deleteAllCountries().then(
                function deleteAllCountriesSuccess(data){
                    if(typeof data.data != 'string'){
                        Materialize.toast('All countries have been deleted',3000,'teal');
                        $scope.countries = data.data;
                        $scope.exit();
                    }else Materialize.toast(data.data,3000,'red lighten-2');
                },function deleteAllCountriesError(data){
                    Materialize.toast('Server error',3000,'red lighten-2');
                }
            );
        }

        $scope.deleteAllSurgeries = function(){
            data.deleteAllSurgeries().then(
                function deleteAllSurgeriesSuccess(data){
                    if(typeof data.data != 'string'){
                        Materialize.toast('All surgeries have been deleted',3000,'teal');
                        $scope.surgeries = data.data;
                        $scope.exit();
                    }else Materialize.toast(data.data,3000,'red lighten-2');
                },function deleteAllSurgeriesError(data){
                    Materialize.toast('Server error',3000,'red lighten-2');
                }
            );
        }

        $scope.addDoctorToClinic = function(clinic){
            if(clinic.doctors_id[clinic.doctors_id.length-1] !='') clinic.doctors_id.push('');
        }

        $scope.deleteDoctorFromClinic = function(clinic,index){
            clinic.doctors_id.splice(index,1);
        }

        $scope.addAccreditationToClinic = function(clinic){
            if(clinic.accreditations[clinic.accreditations.length-1] !='') clinic.accreditations.push('');
        }

        $scope.deleteAccreditationFromClinic = function(clinic,index){
            clinic.accreditations.splice(index,1);
        }

        $scope.selectDoctor = function(usr,type,index){
            console.log('Doctor Selection');
            switch(type){
                case 1: //User
                break;
                case 2: //Quote
                    if($scope.state.currentQuote){
                        $scope.state.currentQuote.name = usr.name;
                        $scope.state.currentQuote.surname = usr.surname;
                        $scope.state.currentQuote.doctor_id = usr._id;
                        $scope.state.currentQuote.pic = usr.profile_pic;
                    }
                break;
                case 3: //Clinic
                    if($scope.state.currentClinic){
                        $scope.state.currentClinic.doctors_id[$scope.state.clinicIndex] = usr._id;
                    }
                break;
                case 4: //Country
                break;
                case 5: //Surgery
                break;
            }
        }

        $scope.selectSurgery = function(surgery,type){
            console.log('Surgery Selection');
            switch(type){
                case 1: //User
                break;
                case 2: //Quote
                    if($scope.state.currentQuote){
                        $scope.state.currentQuote.surgery = surgery;
                    }
                break;
                case 3: //Clinic
                break;
                case 4: //Country
                break;
                case 5: //Surgery
                break;
            }
        }

        $scope.selectCountry = function(country,type){
            switch($scope.state.type){
                case 1: //User
                    $scope.state.currentUser.address.country = country;
                break;
                case 2: //Quote
                    if($scope.state.currentQuote){
                        $scope.state.currentQuote.country = country;
                    }
                break;
                case 3: //Clinic
                    if($scope.state.currentClinic){
                        $scope.state.currentClinic.address.country = country;
                    }
                break;
                case 4: //Country
                break;
                case 5: //Surgery
                break;
            }
        }

        $scope.selectClinic = function(clinic,type){
            switch($scope.state.type){
                case 1: //User
                break;
                case 2: //Quote
                break;
                case 3: //Clinic
                break;
                case 4: //Country
                break;
                case 5: //Surgery
                    if($scope.state.currentSurgery){
                        $scope.state.currentSurgery.clinic = clinic;
                    }
                break;
            }
        }

}]);
