module.exports = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        return next();
    } else {
        req.flash('error', 'Access denied.');
        res.redirect('/login');
    }
};
