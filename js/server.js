//Configuration ================================================================
var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var forge = require('node-forge');
var fs = require('fs');
var methodOverride = require('method-override');
var app        = express();
var serverUrl  = '82.223.10.127';
// var serverUrl = 'localhost';
var port       = 8443;
var server     = require('http').Server(app);
var io         = require('socket.io')(server);
var CAS        = require('cas-authentication');
var session    = require('express-session');
var sess;

//Mongoose initialization
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());

app.use(cookieParser());
var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(session({
  name: 'session',
  cookie: { secure: true,
            httpOnly: true,
            domain: 'withwecare.com',
            path: '/',
            expires: expiryDate
        },
    secret:'withwecare'
  })
);



//Autorisation des requêtes cross-origin
app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Connexion à mongodb
mongoose.connect('mongodb://'+serverUrl+':27017/wwc');
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
    zip : Number,
    country : countrySchema
});

var Address = mongoose.model('Address',addressSchema);

//Clinic references storage
var clinicSchema = new Schema({
    name : String,
    doctors_id : [String],
    address : addressSchema,
    phone: Number,
    rating : Number,
    accreditations : [String]
});

var Clinic = mongoose.model('Clinic',clinicSchema);

//Template of information fields required for client post-operation advisory
var templateSchema = new Schema({

});

var Template = mongoose.model('Template',templateSchema);

//Records of all type of surgeries and quick informations about praticians and clinics
var surgerySchema = new Schema({
    name : String,
    code : String, //A three letters code for the surgery type
    clinic : clinicSchema,
    doctor_id : String,
    template: templateSchema
});

var Surgery = mongoose.model('Surgery',surgerySchema);

//Doctors can, and should upload resumes for their patients to know them better
var resumeSchema = new Schema({
    diploma : String,
    diploma_country : countrySchema,
    distinctions : [String],
    specialty : [{
        name : String,
        code : String, //A three letters code for the surgery type
        price_avg : Number
    }],
    clinics_history : [clinicSchema], //A record of all previous clinics
    clinic : clinicSchema //Actual clinic
});

var Resume = mongoose.model('Resume',resumeSchema);

//Insurances records storage
var insuranceSchema = new Schema({
    name: String,
    address : addressSchema,
    phone: String,
    siren : String
});

var Insurance = mongoose.model('Insurance',insuranceSchema);

//Private messages management
var messageSchema = new Schema({
    object : String,
    content: String,
    author_id : String,
    author_name : String,
    author_surname: String,
    author_pic : String,
    dest_id : String,
    dest_name : String,
    dest_surname : String,
    dest_pic : String,
    read : Boolean,
    read_time : Number,
    sent_time : Number
});

var Message = mongoose.model('Message',messageSchema);

var threadSchema = new Schema({
    participants: [{
        name: String,
        surname: String,
        picture : String,
        id : String
    }],
    date_creation : Number,
    messages : [messageSchema]
});

var Thread = mongoose.model('Thread',threadSchema);

//A quote aims to helps doctors promote their surgery/clinic/country
var quoteSchema = new Schema({
    //Basic information
    price: Number,
    currency : String, //a three letters code as the international currency codes
    surgery: surgerySchema,
    country: countrySchema,
    doctor_id : String,
    pic : String,
    name : String,
    surname : String,
    motivation: String,
    interviews:[{
        requested : Boolean,
        set : Boolean,
        date_patient : Number,
        date_patient_seen : Boolean, //Checks if the customer has seen the proposed date. Notification triggered if false
        date_doctor : Number,
        date_doctor_seen : Boolean, //Same in the other way
        date_change_ctr : Number, //Counter for the date changes
        date_set : Number,
        patient_id : String
    }],
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
    doctor_id : String,
    patient_id : String,
    doctor_pic : String,
    patient_pic : String,
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

//Recording of user interactions with the app
//A table of action types with their ids shall be created
var actionSchema = new Schema({
    type : String,
    type_id : Number,
    date : Number,
});

var Action = mongoose.model('Action',actionSchema);

//Users are wheter staff members, doctors or customers
var userSchema = new Schema({
    //Basic information
    name : String,
    surname : String,
    email : String,
    birthdate : Number,
    sex: Boolean, //True for Male and False for Female
    password : String,
    //Insurance information
    insurance : insuranceSchema,
    //Location information
    address : addressSchema,
    phone : String,
    mobile : String,
    //App information
    profile_pic : String, //URL to profile picture
    user_type : Boolean, //True for Doctor and False for Patient
    status : Boolean, //Status defines whether a User has an open case or not
    clics : Number, //Monitoring of the User activity in terms of clics
    state_changes : Number, //Monitoring of the User activity in terms of page views,
    signin_date: Number,
    connections : Number,
    last_connection : Number,
    inbox : [messageSchema],
    outbox : [messageSchema],
    //Medical information
    //PATIENT PART
    history : [actionSchema], //Keep an history of all records ids from the users
    medical_files : [fileSchema], //All the files from an user must be stored in their profile, and crypted
    selected_quotes:[{
        quote: quoteSchema,
        time : Number
    }],
    current_doctors : [{
        name : String,
        surname : String,
        surgery : surgerySchema,
        picture : String,
        id : String
    }],
    previous_doctors : [{
        name : String,
        surname : String,
        surgery : surgerySchema,
        picture : String,
        id : String
    }],
    reason : String,
    //DOCTOR PART
    surgery : surgerySchema,
    clinic : clinicSchema,
    resume : resumeSchema,
    description : String,
    previous_patients : [{
        name : String,
        surname : String,
        picture : String,
        id : String
    }], //An array of all his patients ids
    current_patients : [{
        name : String,
        surname : String,
        picture : String,
        id : String
    }],
    rating : Number,
    //MANAGER PART
    staff : Boolean,
    admin : Boolean

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

var forumThreadSchema = new Schema({
    title : String,
    author_name : String,
    author_surname : String,
    author_email : String,
    thread_picture : String,
    date : Number,
    last_modification : Number,
    topic : String,
    img: String,
    country : countrySchema,
    surgery: surgerySchema,
    firstPost:{
        date : Number,
        last_modification : Number,
        content: String,
        author_name : String,
        author_surname : String,
        author_email : String
    },
    content:[{
        date : Number,
        last_modification : Number,
        content: String,
        author_name : String,
        author_surname : String,
        author_email : String
    }],
    staff : Boolean
});

var ForumThread = mongoose.model('ForumThread',forumThreadSchema);

//API Functions

app.get('/',function(req,res){
    console.log('Get on /');
    res.send('Bienvenue sur le serveur WithWeCare');
});

app.get('/ping',function(req,res){
    res.json({msg:'ok'})
});

//Add User
app.post('/addUser',function(req,res){
    console.log('Server Signin');
    //Checking data validity
    if(req.body.name && req.body.name!=""
        && req.body.surname && req.body.surname!=""
        && req.body.email && req.body.email!=""
        && req.body.birthdate && req.body.birthdate < ( new Date().getTime() - (568080000000) )
        && req.body.password && req.body.password!=""
    ){

        req.body.connections = 0;
        req.body.state_changes = 0;
        req.body.clics = 0;
        req.body.signin_date = new Date().getTime();
        req.body.last_connection = new Date().getTime();
        console.log('User: '+req.body.name);

        //Checking unicity
        User.findOne({'email':req.body.email},function(err,foundUser){
            if(foundUser) res.json({msg:'A user has already registered with this email'});
            else{
                User.create(req.body, function(err,createdUser){
                    if(createdUser){
                        response = 'Your account has been successfully created, '+createdUser.surname;
                        console.log('Nouvel utilisateur');
                        console.log(createdUser);
                        if(err) res.send(err);
                        else User.find(function(err,users){
                          if(err) res.send(err);
                          res.json(users);
                        });
                    }else response = 'There was an error while creating your account';
                });
            }
        });
    }else res.json({msg : 'Please fill in all the fields'});

});

//Login
app.post('/login',function(req,res){
    console.log('Server login');
    User.findOne({'email':req.body.email},function(err,foundUser){
            if(err) res.send(err);
            if(foundUser && foundUser != null){
                console.log(foundUser);
                if(foundUser.password === req.body.password){
                    User.findOneAndUpdate({_id : foundUser._id},{
                        $inc : {connections : 1},
                        $set : {last_connection : new Date().getTime()}
                    },{returnNewDocument: true},function(err,user){
                        if(err) res.send(err);
                        else{
                            io.emit('login');
                            res.json(user);
                        }
                    });
                }else res.json({msg:'Wrong password'});
            }else res.json({msg:'No user registered with this email'});
    });
});

app.post('/logout',function(req,res){
    req.session.destroy;
    res.send('logged out');
});

app.get('/count', function(req, res){
   if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times");
   }else{
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
   }
});

app.get('/count2', function(req, res){
   if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times");
   }else{
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
   }
});

//Get All Users
app.get('/getAllUsers',function(req,res){
    console.log('Getting all users');
    User.find(function(err,users){
        if(err) res.send(err);
        else res.json(users);
    });
});

app.get('/users/getNames',function(req,res){
    User.find({},'name surname profile_pic',function(err,users){
        if(err) res.send(err);
        else res.json(users);
    });
});

//Get One User
app.post('/getOneUser',function(req,res){
    User.findById({_id: req.body._id},function(err,user){
        if(err) res.send(err);
        else res.json(user);
    });
});

//Update User and send back all
app.post('/updateUser',function(req,res){
    User.remove({_id: req.body._id},function(err,user){
        if(err) res.send(err);
        else User.create(req.body,function(err,user){
            if(err) res.send(err);
            else User.find(function(err,users){
                if(err) res.send(err);
                else res.json(users);
            });
        });
    });
});

//Update quote selection of user (params: user schema)
app.post('/user/quotes',function(req,res){
    User.findOneAndUpdate({_id: req.body._id},{
        $set : {selected_quotes : req.body.selected_quotes}
    },{returnNewDocument:true,new:true},function(err,user){
        if(err) res.send(err);
        else res.json(user);
    });
});

//Delete User and send back all
app.post('/deleteUser',function(req,res){
    User.remove({_id : req.body._id},function(err,user){
        if(err) res.send(err);
        else User.find(function(err,users){
            if(err) res.send(err);
            else
                res.json(users);
        });
    });
});

//Delete all users
app.post('/deleteAllUsers',function(req,res){
    User.remove(function(err,users){
        if(err) res.send(err);
        else User.find(function(err,users){
            if(err) res.send(err);
            else res.json(users);
        })
    })
});


// User.remove({},function(err){
//     console.log("Removed all users");
// });

//FORUM MANAGEMENT

//Get all threads
app.get('/threads/all', function(req,res){
    ForumThread.find(function(err,threads){
        if (err) res.send(err);
        else res.json(threads);
    });
});

//Get one thread by _Id (mongoose Id)
app.post('/threads/one',function(req,res){
    ForumThread.findById(req.body._id,function(err,thread){
        if(err) res.send(err);
        else res.json(thread);
    });
});

//Create Thread
app.post('/threads/add',function(req,res){
    ForumThread.create(req.body,function(err,thread){
        if(err) res.send(err);
        else ForumThread.find(function(err,threads){
            if(err) res.send(err);
            else res.json(threads);
        });
    });
});

app.post('/threads/update',function(req,res){
    ForumThread.findOneAndUpdate({_id:req.body._id},req.body,{new:true},function(err,thread){
        if(err) res.send(err);
        else ForumThread.find(function(err,threads){
            if(err) res.send(err);
            else res.json(threads);
        })
    });
})

//Delete Thread and send back all threads
app.post('/threads/delete',function(req,res){
    ForumThread.remove({_id: req.body._id},function(err,thread){
        if(err) res.send(err);
        else{
            ForumThread.find(function(err,threads){
                if(err) res.send(err);
                else res.json(threads);
            })
        }
    })
});

//POSTS MANAGEMENT

// //Get all posts
// app.get('/posts/all', function(req,res){
//     Post.find(function(err,posts){
//         if (err) res.send(err);
//         else res.json(posts);
//     });
// });
//
// //Get one post by _Id (mongoose Id)
// app.post('/posts/one',function(req,res){
//     Post.findById(req.body._id,function(err,post){
//         if(err) res.send(err);
//         else res.json(post);
//     });
// });
//
// //Create Post
// app.post('/posts/add',function(req,res){
//     Post.create(req.body,function(err,post){
//         if(err) res.send(err);
//         else res.json(post);
//     });
// });
//
// //Delete Post and send back all posts
// app.post('/posts/delete',function(req,res){
//     Post.remove({_id: req.body._id},function(err,post){
//         if(err) res.send(err);
//         else{
//             Post.find(function(err,posts){
//                 if(err) res.send(err);
//                 else res.json(posts);
//             });
//         }
//     });
// });

//QUOTES MANAGEMENT

//Get all quotes
app.get('/quotes/all', function(req,res){
    console.log('Getting all quotes');
    Quote.find(function(err,quotes){
        if (err) res.send(err);
        else res.json(quotes);
    });
});

//Get one quote by _Id (mongoose Id)
app.post('/quotes/one',function(req,res){
    Quote.findById(req.body._id,function(err,quote){
        if(err) res.send(err);
        else res.json(quote);
    });
});

//Create Quote
app.post('/quotes/add',function(req,res){
    req.body.date = new Date().getTime();
    req.body.last_modified = new Date().getTime();
    Quote.create(req.body,function(err,quote){
        if(err) res.send(err);
        else Quote.find(function(err,quotes){
            if(err) res.send(err);
            else res.json(quotes);
        });
    });
});

//Update Quote
app.post('/quotes/update',function(req,res){
    req.body.last_modified = new Date().getTime();
    console.log('Updating quote');
    Quote.remove({_id: req.body._id},function(err,quote){
        if(err) res.send(err);
        else Quote.create(req.body,function(err,quote){
                if(err) res.send(err);
                else Quote.find(function(err,quotes){
                    if(err) res.send(err);
                    else res.json(quotes);
                });
            });
    })
});

//Add hits to quote
app.post('/quotes/hits',function(req,res){
    Quote.findOneAndUpdate({_id: req.body._id},{
        $inc: {hits : 1}
    },{returnNewDocument : true, new:true},function(err,quote){
        if(err) res.send(err);
        else res.json(quote);
    });
});

//Set interview
app.post('/quotes/interviews',function(req,res){
    Quote.findOneAndUpdate({_id:req.body._id},{
        $set : {interviews : req.body.interviews}
    },{returnNewDocument:true, new:true,function(err,quote){
        if(err) res.send(err);
        else res.json(quote);
    }});
});

//Delete Quote and send back all quotes
app.post('/quotes/delete',function(req,res){
    Quote.remove({_id: req.body._id},function(err,quote){
        if(err) res.send(err);
        else{
            Quote.find(function(err,quotes){
                if(err) res.send(err);
                else res.json(quotes);
            });
        }
    });
});

app.post('/quotes/delete/all',function(req,res){
    Quote.remove(function(err,quotes){
        if(err) res.send(err);
        else res.json(quotes);
    });
});

//CLINICS MANAGEMENT

//Get all clinics
app.get('/clinics/all', function(req,res){
    console.log('Getting all clinics');
    Clinic.find(function(err,clinics){
        if (err) res.send(err);
        else res.json(clinics);
    });
});

//Get one clinic by _Id (mongoose Id)
app.post('/clinics/one',function(req,res){
    Clinic.findById(req.body._id,function(err,clinic){
        if(err) res.send(err);
        else res.json(clinic);
    });
});

//Create Clinic
app.post('/clinics/add',function(req,res){
    Clinic.create(req.body,function(err,clinic){
        if(err) res.send(err);
        else Clinic.find(function(err,clinics){
            if(err) res.send(err);
            else res.json(clinics);
        });
    });
});

app.post('/clinics/update',function(req,res){
    console.log(req.body);
    Clinic.remove({_id: req.body._id},function(err,clinic){
        console.log(clinic);
        if(err) res.send(err);
        else Clinic.create(req.body,function(err,clinic){
            if(err) res.send(err);
            else Clinic.find(function(err,clinics){
                if(err) res.send(err);
                else res.json(clinics);
            });
        });
    });
});

//Delete Clinic and send back all clinics
app.post('/clinics/delete',function(req,res){
    Clinic.remove({_id: req.body._id},function(err,clinic){
        if(err) res.send(err);
        else{
            Clinic.find(function(err,clinics){
                if(err) res.send(err);
                else res.json(clinics);
            });
        }
    });
});

app.post('/clinics/delete/all',function(req,res){
    Clinic.remove(function(err,clinics){
        if(err) res.send(err);
        else res.json(quotes);
    });
});

//COUNTRIES MANAGEMENT

//Get all countries
app.get('/countries/all', function(req,res){
    console.log('Getting all countries');
    Country.find(function(err,countries){
        if (err) res.send(err);
        else res.json(countries);
    });
});

//Get one country by _Id (mongoose Id)
app.post('/countries/one',function(req,res){
    Country.findById(req.body._id,function(err,country){
        if(err) res.send(err);
        else res.json(country);
    });
});

//Create Country
app.post('/countries/add',function(req,res){
    Country.create(req.body,function(err,country){
        if(err) res.send(err);
        else Country.find(function(err,countries){
            if(err) res.send(err);
            else res.json(countries);
        });
    });
});

app.post('/countries/update',function(req,res){
    Country.findOneAndUpdate({_id: req.body._id},req.body,{new:true},function(err,country){
        if(err) res.send(err);
        else Country.find(function(err,countries){
            if(err) res.send(err);
            else res.json(countries);
        });
    });
});

//Delete Country and send back all countries
app.post('/countries/delete',function(req,res){
    Country.remove({_id: req.body._id},function(err,country){
        if(err) res.send(err);
        else{
            Country.find(function(err,countries){
                if(err) res.send(err);
                else res.json(countries);
            });
        }
    });
});

app.post('/countries/delete/all',function(req,res){
    Country.remove(function(err,countries){
        if(err) res.send(err);
        else res.json(countries);
    });
});

//SURGERIES MANAGEMENT

//Get all surgeries
app.get('/surgeries/all', function(req,res){
    console.log('Getting all surgeries');
    Surgery.find(function(err,surgeries){
        if (err) res.send(err);
        else res.json(surgeries);
    });
});

//Get one surgery by _Id (mongoose Id)
app.post('/surgeries/one',function(req,res){
    Surgery.findById(req.body._id,function(err,surgery){
        if(err) res.send(err);
        else res.json(surgery);
    });
});

//Create Surgery
app.post('/surgeries/add',function(req,res){
    Surgery.create(req.body,function(err,surgery){
        if(err) res.send(err);
        else Surgery.find(function(err,surgeries){
            if(err) res.send(err);
            else res.json(surgeries);
        });
    });
});

app.post('/surgeries/update',function(req,res){
    Surgery.remove({id: req.body._id},function(err,surgery){
        if(err) res.send(err);
        else Surgery.create(req.body,function(err,surgery){
            if(err) res.send(err);
            else Surgery.find(function(err,surgeries){
                if(err) res.send(err);
                else res.json(surgeries);
            })
        })
    })
});

//Delete Surgery and send back all surgeries
app.post('/surgeries/delete',function(req,res){
    Surgery.remove({_id: req.body._id},function(err,surgery){
        if(err) res.send(err);
        else{
            Surgery.find(function(err,surgeries){
                if(err) res.send(err);
                else res.json(surgeries);
            });
        }
    });
});

app.post('/surgeries/delete/all',function(req,res){
    Surgery.remove(function(err,surgeries){
        if(err) res.send(err);
        else res.json(surgeries);
    });
});

//CHAT MANAGEMENT

//Create a thread and return all personnal threads
app.post('/chat/thread/new',function(req,res){
    Thread.create(req.body.thread,function(err,thread){
        if(err) res.send(err);
        else Thread.find({participants: {$in : { id: req.body.user_id }}},function(err,threads){
            if(err) res.send(err);
            else res.json(threads);
        });
    });
});

//Delete a thread and return all personnal threads
app.post('/chat/thread/delete',function(req,res){
    Thread.remove({_id: req.body._id},function(err,thread){
        if(err) res.send(err);
        else Thread.find({participants: {$in : { id: req.body.user_id }}},function(err,threads){
            if(err) res.send(err);
            else res.json(threads);
        });
    });
});

//Fetch user's threads
app.post('/chat/thread/mine',function(req,res){
    Thread.find({participants: {$in : { id: req.body._id }}},function(err,threads){
        if(err) res.send(err);
        else res.json(threads);
    });
});

//Update thread (add message)
app.post('/chat/thread/update/msg',function(req,res){
    Thread.findOneAndUpdate({_id: req.body._id},{
        $set : {messages: req.body.messages}
    },{returnNewDocument:true, new:true},function(err,thread){
        if(err) res.send(err);
        else res.json(thread);
    });
});

app.post('/chat/thread/update/party',function(req,res){
    Thread.findOneAndUpdate({_id: req.body._id},{
        $set : {participants: req.body.participants}
    },{returnNewDocument:true, new:true},function(err,thread){
        if(err) res.send(err);
        else res.json(thread);
    });
});

//Listening (ALWAYS PUT IT AT THE END)
server.listen(port);
console.log('With We Care Server started and listening on port '+ serverUrl +':'+ port);
