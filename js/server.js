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

Schema = mongoose.Schema;

//Schemas

//The country is a brief description containing medicaly useful informations
var countrySchema = new Schema({
    name : String,
    continent : String,
    region : String,
    population : Number,
    male_proportion : Number,
    capital : String,
    exp_lifetime : Number
});

var Country = mongoose.model('Country',countrySchema);

//We record addresses of Users, Clinics, Doctors and other parterns
var addressSchema = new Schema({
    city : String,
    street : String,
    number : Number,
    zip : String,
    country : countrySchema
});

var Address = mongoose.model('Address',addressSchema);

//Clinic references storage
var clinicSchema = new Schema({
    name : String,
    doctors_id : [Number],
    country : countrySchema,
    phone: Number,
    rating : Number
});

var Clinic = mongoose.model('Clinic',clinicSchema);

//Template of information fields required for client post-operation advisory
var templateSchema = new Schema({

});

var Template = mongoose.model('Template',templateSchema);

//Records of all type of surgeries and quick informations about praticians and clinics
var surgerySchema = new Schema({
    name : String,
    clinic : clinicSchema,
    doctor_id : Number,
    template: templateSchema
});

var Surgery = mongoose.model('Surgery',surgerySchema);

//Doctors can, and should upload resumes for their patients to know them better
var resumeSchema = new Schema({
    // study:,
    // speciality:,
    // surgery:,
    // clinics_history:
});

var Resume = mongoose.model('Resume',resumeSchema);

//Insurances records storage
var insuranceSchema = new Schema({
    name: String,
    address : addressSchema,
    siren : String
});

var Insurance = mongoose.model('Insurance',insuranceSchema);

//Private messages management
var messageSchema = new Schema({
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

var Message = mongoose.model('Message',messageSchema);

//A quote aims to helps doctors promote their surgery/clinic/country
var quoteSchema = new Schema({
    //Basic information
    name: String,
    price: Number,
    currency : String,
    surgery: surgerySchema,
    doctor_id : Number,
    //App information
    hits : Number,
    validations : Number,
    date: Number, //timestamp
    last_modified : Number
});

var Quote = mongoose.model('Quote',quoteSchema);

//A file keeps all informations about a running or closed operation on our service
var fileSchema = new Schema({
    name : String,
    doctor_id : Number,
    patient_id : Number,
    quote : quoteSchema,
    creation_date: Number,
    issue_date: Number,
    country: countrySchema,
    clinic : clinicSchema,
    touristic_advices : [String],
    pre_advices: [String],
    during_advices : [String],
    post_advices: [String]
});

var File = mongoose.model('File',fileSchema);

//Users are wheter staff members, doctors or customers
var userSchema = new Schema({
    //Basic information
    name : String,
    surname : String,
    email : String,
    birthdate : Number,
    sex: Boolean, //True for Male and False for Female
    //Insurance information
    insurance : insuranceSchema,
    //Location information
    country : countrySchema,
    address : addressSchema,
    phone : String,
    mobile : String,
    //App information
    profile_pic : String, //URL to profile picture
    user_type : Boolean, //True for Patient and False for Doctor
    status : Boolean, //Status defines whether a User has an open case or not
    clics : Number, //Monitoring of the User activity in terms of clics
    state_changes : Number, //Monitoring of the User activity in terms of page views,
    signin_date: Number,
    inbox : [messageSchema],
    outbox : [messageSchema],
    //Medical information
    //PATIENT PART
    history : [Number], //Keep an history of all records ids from the users
    medical_files : [fileSchema], //All the files from an user must be stored in their profile, and crypted
    //DOCTOR PART
    surgery: surgerySchema,
    clinic: clinicSchema,
    resume: resumeSchema,
    previous_patients : [Number], //An array of all his patients ids
    rating : Number
    //MANAGER PART

});

var User = mongoose.model('User',userSchema);

//An article allows a customers to make a quick review about his operation
var articleSchema = new Schema({
    name: String,
    country : countrySchema,
    surgery: surgerySchema,
    doctor : userSchema,
    content: String,
    author_name : String,
    author_surname : String,
    author_email: String,
    rating : Number
});

var Article = mongoose.model('Article',articleSchema);

//API Functions
app.post('/addUser',function(req,res){
    console.log('Server Signin');
    console.log(req);
    newUser = {
        name : req.body.name,
        surname : req.body.surname,
        email : req.body.email,
        birthdate : req.body.birthdate,
        sex: req.body.sex
    }
    console.log('User: '+req.body.name)
    User.create(newUser, function(err,createdUser){
        response = 'Your account has been successfully created, '+createdUser.surname;
        console.log('Nouvel utilisateur');
        console.log(createdUser);
        if(err) res.send(err);
        else res.json({
            msg: response
        })
    })
});

//Listening (ALWAYS PUT IT AT THE END)
server.listen(port);
console.log('Server started and listening on port '+ port);
