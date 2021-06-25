var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// get reference from userSchema
var userSchema = new mongoose.Schema({
    email: String,
    pwd: String,
    name: String,
    description: String
})

userSchema.pre('save', function(next) {
    var user = this

    if (!user.isModified('pwd'))
        return next()

    // 2nd param expects a salt - allows us to randomize our hash 
    // null lets bcrypt know automatically that we want to generate a salt
    // 3rd param is a progress callback - to know progress of hash generation
    // 4th param is completed callback 
    bcrypt.hash(user.pwd, null, null, (err, hash) => {
        if(err) return next (err)

        user.pwd = hash
        next()
    });
})

module.exports = mongoose.model('User', userSchema);