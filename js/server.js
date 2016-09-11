//Configuration ================================================================
var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var forge = require('node-forge');
var fs = require('fs');
var methodOverride = require('method-override');
var app        = express();
var port       = 8080;
var server     = require('http').Server(app);
var io         = require('socket.io')(server);
var CAS        = require('cas-authentication');
var session    = require('express-session');

//Mongoose initialization
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());

//Autorisation des requêtes cross-origin
app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Connexion à mongodb
mongoose.connect('mongodb://localhost:27017/wwc');
mongoose.set('debug', true);

//Schemas
var Country = mongoose.model('Country',{
    name : String,
    continent : String,
    region : String,
    population : Number,
    male_proportion : Number,
    capital : String,
    exp_lifetime : Number
});

var Address = mongoose.model('Address',{
    city : String,
    street : String,
    number : Number,
    zip : String,
    country : Country
});

var Clinic = mongoose.model('Clinic',{
    name : String,
    doctors : [Number],
    country : Country
});

var Surgery = mongoose.model('Surgery',{
    name : String,
    clinic : Clinic,
    doctor_id : Number
});

var File = mongoose.model('File',{
    name : String,
    doctor_id : Number,
    patient_id : Number,
    surgery : Surgery,
});

var User = mongoose.model('User',{
    //Basic information
    name : String,
    surname : String,
    email : String,
    birthdate : Number,
    sex: Boolean, //True for Male and False for Female
    //Location information
    country : Country,
    address : Address,
    phone : String,
    mobile : String,
    //App information
    profile_pic : String, //URL to profile picture
    user_type : Boolean, //True for Patient and False for Doctor
    status : Boolean, //Status defines whether a User has an open case or not
    clics : Number, //Monitoring of the User activity in terms of clics
    state_changes : Number, //Monitoring of the User activity in terms of page views
    //Medical information
    //PATIENT PART
    history : [Number], //Keep an history of all records ids from the users
    medical_files : [File], //All the files from an user must be stored in their profile, and crypted
    //DOCTOR PART
    surgery: Surgery,
    clinic: Clinic,
    previous_patients : [Number] //An array of all his patients ids
});

var Quote = mongoose.model('Quote',{
    //Basic information
    name: String,
    price: Number,
    currency : String,
    surgery: Surgery,
    doctor_id : Number
    //App information
    hits : Number,
    
});
