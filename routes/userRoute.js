const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const user = require('../models/user');
/*
const mongoose = require('mongoose');
const app = express();
const path = require('path')
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, 'public')));
*/

// Mock user data
let users = [];



// Signup route
router.get('/signup', (req, res) => {
    res.render('signup', { errorMessage: req.flash('error'), successMessage: req.flash('success') });
});

router.post('/signup', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        req.flash('error', 'All fields are required');
        return res.redirect('/signup');
    }

    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/signup');
    }

    try {
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email already in use');
            return res.redirect('/signup');
        }

        const newUser = new user({
            username,
            email,
            password
        });

        await newUser.save();
        req.flash('success', 'User created successfully');
        res.redirect('/read'); // Redirect to login page or another page
    } catch (err) {
        console.error('Error during signup:', err);
        req.flash('error', 'An error occurred');
        res.redirect('/signup');
    }
});

// Login route
router.get('/login', (req, res) => {
    res.render('login', { errorMessage: req.flash('error'), successMessage: req.flash('success') });
});

/*
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const checkuser = user.find(user => user.email === email && user.password === password);
    if (checkuser) {
        req.flash('success', 'Login successful!');
        res.redirect('/home');
    } else {
        req.flash('error', 'Invalid email or password');
        res.redirect('/login');
    }
    
});

*/

router.get('/read', async (req, res) => {
    try {
        // Fetch the most recently created user
        const latestUser = await user.findOne().sort({ _id: -1 });

        if (!latestUser) {
            return res.render('read', { username: 'No user found' });
        }

        // Render the view with the username
        res.render('read', { username: latestUser.username });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Server Error');
    }
});

// User Home Route
router.get('/user/home', (req, res) => {
    const username = req.query.username;
    res.render('user-home', { username });

});



// Users view route
router.get('/users', (req, res) => {
    res.render('users', { users });
});

// Home route
router.get('/home', (req, res) => {
    res.render('home');
});

module.exports = router;
