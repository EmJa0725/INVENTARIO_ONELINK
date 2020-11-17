const express =  require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');

const {database} = require('./keys');
const { dirname } = require('path');

// initializacions
const app = express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname,'views'))
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.use(session({
    secret: 'gestor',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());//public



//Global variables
app.use((req,res,next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user =  req.user;
    next();
});

  
//Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/menuAdministrador', require('./routes/menuAdministrador'));

//Public
app.use(express.static(path.join(__dirname,'public')));


app.listen(app.get('port'), () => {
    console.log('Server running on port', app.get('port'));
});