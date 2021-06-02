const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const {isEmail} = require('validator');

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password lengths is 6 characters']
    }
});

// fire a function after doc has been saved
userSchema.post('save', (doc,next) => {
    // console.log('New user has been created!', doc);
    next();
});

// fire a function before doc has been saved 
userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static custom login function 
userSchema.statics.login = async function(email,password) {
    const user = await this.findOne({email});

    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            // console.log('user authenticated');
            return user;
        }
        // console.log('incorrect pass');
        throw new Error('Incorrect password');
    }
    // console.log('incorrect email');
    throw new Error('Incorrect email');
}


const User = mongoose.model('user', userSchema);

module.exports = User;