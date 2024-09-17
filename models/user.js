// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // confirmpassword: { type: String, required: true },
    role: { type: String, default: 'user' } // Default to 'user', can be 'admin'
});

// Hash the password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password',)) {
        this.password = await bcrypt.hash(this.password, 10);
        // this.confirmpassword = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('user', userSchema);
































// const mongoose = require('mongoose')

// mongoose.connect("mongodb://127.0.0.1:27017/my-appctn-backend")
// .then(() => console.log('MongoDB connected'))

// const userSchema = mongoose.Schema({
//     password: String,
//     email: String,
//    {
//         type: String,
//         required: true,
//         unique: true
//     },
  
//    
//     username: String,
//     confirmpassword: String

// })

// module.exports = mongoose.model('user', userSchema)