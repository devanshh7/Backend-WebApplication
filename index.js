const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/updated-appctn-backend', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(session({
    secret: 'mysecret', // Replace with a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(flash());
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Middleware to make flash messages available in views
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});


// Import routes
const authRoutes = require('./routes/userRoute');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin-auth');
const auth = require('./routes/auth');

// Use routes
app.use('/', authRoutes);
app.use('/', contactRoutes);
app.use('/', adminRoutes);
app.use('/', auth);

app.get('/', (req, res) => {
    res.render('home'); // Make sure you have a 'home.ejs' file in your views folder
});



app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
