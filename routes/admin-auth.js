const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middleware/authmiddleware');
const flash = require('connect-flash');

// Admin Signup Route
router.post('/admin-signup', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        req.flash('error', 'All fields are required');
        return res.redirect('/admin-signup');
    }

    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/admin-signup');
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email already in use');
            return res.redirect('/admin-signup');
        }

        const newUser = new User({
            username,
            email,
            password,
            role: 'admin' // Set user role as admin
        });

        await newUser.save();
        req.flash('success', 'Admin user created successfully');
        res.redirect('/read');
        /* res.redirect('/admin-login');  Redirect to admin login page or another page */
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred');
        res.redirect('/admin-signup');
    }
});
router.get('/admin-signup', (req, res) => {
    res.render('admin-signup');
});

router.get('/admin/dashboard', async (req, res) => {
    try {
        // Fetch all users who are not admins
        const users = await User.find({ role: 'user' });

        // Render the admin dashboard view and pass the users data
        res.render('admin-dashboard', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        req.flash('error', 'An error occurred while fetching users.');
        res.redirect('/login');
    }
});
module.exports = router;
