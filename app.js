import express from 'express';
import dotenv from 'dotenv';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

dotenv.config({ path: './config/config.env' });

const app = express();

import passport from 'passport';
import session from 'express-session';
import configurePassport from './config/passport.js';

configurePassport(passport);

import configRoutesFunction from './routes/index.js';
import exphbs from 'express-handlebars';

const window = new JSDOM('').window;
const DOMPurifyInstance = DOMPurify(window);

const sanitizeInput = (value) => {
    if (typeof value === 'string') {
        return DOMPurifyInstance.sanitize(value, {
            ALLOWED_URI_REGEXP: /^(https?|mailto|ftp|file|data|blob):/i 
        });
    } else if (typeof value === 'object' && value !== null) {
        for (const key in value) {
            value[key] = sanitizeInput(value[key]);
        }
    }
    return value;
};

const sanitizeMiddleware = (req, res, next) => {
    req.body = sanitizeInput(req.body);
    req.query = sanitizeInput(req.query);
    req.params = sanitizeInput(req.params);
    next();
};

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(session({
    name: 'MoodHaven',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Secure cookies in production
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(sanitizeMiddleware);

configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
