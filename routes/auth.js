const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Ensure this path is correct
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'No account with that email found.');
            return res.redirect('/login');
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'Invalid password.');
            return res.redirect('/login');
        }

        // If user is an admin, redirect to admin dashboard
        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        }

        // If user is a normal user, redirect to the user home page
        return res.redirect(`/user/home?username=${user.username}`);

    } catch (err) {
        console.error('Error during login:', err);
        req.flash('error', 'An error occurred during login. Please try again.');
        return res.redirect('/login');
    }
});

module.exports = router;
























/*
// POST route for login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            req.flash('error', 'No user found with this email');
            return res.redirect('/login');
        }

        // Check if password is defined
        if (!user.password) {
            req.flash('error', 'Password is not set for this user');
            return res.redirect('/login');
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            req.flash('error', 'Invalid password');
            return res.redirect('/login');
        }

        // Check if the user is an admin
        if (user.role === 'admin') {
            req.flash('success', `Hello Admin ${user.username}`);
            return res.redirect('/admin/dashboard'); // Redirect to admin dashboard
        } else {
            req.flash('success', `Hello, you are a normal user ${user.username}`);
            return res.redirect('/user/home'); // Redirect to user home page
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

*/