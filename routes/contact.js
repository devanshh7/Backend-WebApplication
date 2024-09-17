const express = require('express');
const router = express.Router();
const flash = require('connect-flash');

// Contact route
router.get('/contact', (req, res) => {
    res.render('contact');
});

router.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Here, you would typically send the message to an email or save it to a database
    req.flash('success', 'Message sent successfully!');
    res.redirect('/contact');
});

module.exports = router;
