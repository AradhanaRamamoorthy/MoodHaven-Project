import express from 'express';
import dotenv from 'dotenv'
dotenv.config({path: './config/config.env'})

const app = express()

import passport from 'passport';
import session from 'express-session'
import configurePassport from './config/passport.js'

configurePassport(passport)

import configRoutesFunction from './routes/index.js';
import exphbs from 'express-handlebars';

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(session({
    secret: 'secret',
    resave: false, 
    saveUninitialized: false,
    cookie: {secure: false}
}))
app.use(passport.initialize());
app.use(passport.session());

configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});


