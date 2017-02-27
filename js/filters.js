var fltrs = angular.module('Filters',[]);

fltrs.filter('surgeryCountryCurrency',function(searchInput,quotes){

    var array = [];
    var surgery = searchInput.surgery;
    var country = searchInput.country;
    var currency = searchInput.currency;
    var price = searchInput.price;
    var city = searchInput.city;

    for (var i = 0; i < quotes.length; i++) {
        if(!city || city === ""){
            if(quotes[i].surgery.name === surgery &&
               quotes[i].country.name === country &&
               quotes[i].currency === currency &&
               quotes[i].price < price){
                array.push(quotes[i]);
            }
        }else{
            if(quotes[i].surgery.name === surgery &&
               quotes[i].country.name === country &&
               quotes[i].currency === currency &&
               quotes[i].price < price &&
               quotes[i].surgery.clinic.adress.city === city){
                array.push(quotes[i]);
            }
        }

    }


    return array;
});
