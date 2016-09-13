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
    country : Country,
    phone: Number,
    rating : Number
});

//Template of information fields required for client post-operation advisory
var Template = mongoose.model('Template',{

});

var Surgery = mongoose.model('Surgery',{
    name : String,
    clinic : Clinic,
    doctor_id : Number,
    template: Template
});

var Resume = mongoose.model('Resume',{
    // study:,
    // speciality:,
    // surgery:,
    // clinics_history:
});

var Insurance = mongoose.model('Insurance',{
    name: String,
    address : Address,
    siren : String
});

var Message = mongoose.model('Message',{
    object : String,
    content: String,
    author_id : Number,
    author_name : String,
    author_surname: String,
    dest_id : Number,
    dest_name : String,
    dest_surname : String,
    read : Boolean,
    read_time : Number,
    sent_time : Number
});

var User = mongoose.model('User',{
    //Basic information
    name : String,
    surname : String,
    email : String,
    birthdate : Number,
    sex: Boolean, //True for Male and False for Female
    //Insurance information
    insurance : Insurance,
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
    state_changes : Number, //Monitoring of the User activity in terms of page views,
    signin_date: Number,
    inbox : [Message],
    outbox : [Message],
    //Medical information
    //PATIENT PART
    history : [Number], //Keep an history of all records ids from the users
    medical_files : [File], //All the files from an user must be stored in their profile, and crypted
    //DOCTOR PART
    surgery: Surgery,
    clinic: Clinic,
    resume: Resume,
    previous_patients : [Number], //An array of all his patients ids
    rating : Number
    //MANAGER PART

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
    validations : Number,
    date: Number //timestamp
    last_modified : Number
});

var File = mongoose.model('File',{
    name : String,
    doctor_id : Number,
    patient_id : Number,
    quote : Quote,
    creation_date: Number,
    issue_date: Number,
    country: Country,
    clinic : Clinic,
    touristic_advices : [String],
    pre_advices: [String],
    during_advices : [String],
    post_advices: [String]
});

var Article = mongoose.model('Article',{
    name: String,
    country : Country,
    surgery: Surgery,
    doctor : Doctor,
    content: String,
    author_name : String,
    author_surname : String,
    author_email: String,
    rating : Number
});



//API Functions
